import {
    CreateStorageResponse,
    ShdwDrive,
    StorageAccount,
    StorageAccountResponse,
} from "@shadow-drive/sdk";
// import { bytesToHuman } from "@shadow-drive/sdk/dist/utils/helpers"
import { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { SHADOW_DRIVE_ENDPOINT } from "@/constants/endpoints";
import { WalletContextState } from "@solana/wallet-adapter-react";

export interface ShadowDriveHook {
    drive: ShdwDrive | null;
    getStorageAccounts: () => Promise<StorageAccountResponse[] | []>;
    findUrlByFileName: (
        fileName: string,
        storageAccountPublickey: anchor.web3.PublicKey
    ) => Promise<string | undefined>;
    getOrCreateStorageAccountByName: (
        storageAccountName: string
    ) => Promise<StorageAccount | undefined>;
}

export const useShadowDrive = (
    wallet: WalletContextState | undefined,
    connection: anchor.web3.Connection | undefined
): ShadowDriveHook => {
    const [drive, setDrive] = useState<ShdwDrive | null>(null);

    useEffect(() => {
        const initDrive = async () => {
            if (wallet && connection) {
                const drive = await new ShdwDrive(connection, wallet).init();
                setDrive(drive);
            }
        };

        if (wallet?.connected) {
            initDrive();
        }
    }, [wallet?.connected]);

    useEffect(() => {
        getStorageAccounts();
    }, [drive]);

    /**
     * Returns a list of storage accounts under the wallet or []
     */
    const getStorageAccounts = async () => {
        if (!drive) {
            return [];
        }

        let accounts = await drive.getStorageAccounts("v2");

        if (!accounts) {
            return [];
        }

        return accounts;
    };

    /**
     * Function takes a filename and a storage account address under which it is stored and
     * returns a URL pointing to that file
     * @param fileName search for this filename
     * @param storageAccountPublickey search in this user address
     * @returns stored file url
     */
    const findUrlByFileName = async (
        fileName: string,
        storageAccountPublickey: anchor.web3.PublicKey
    ) => {
        if (!drive || !storageAccountPublickey) {
            throw new Error("drive or publickey invalid");
        }

        const retrieveFileName =
            (await drive.listObjects(storageAccountPublickey)) ?? [];

        let fileUrl;

        const name = retrieveFileName.keys.find(name => {
            name === fileName;
        });

        fileUrl = fileUrl
            ? new URL(
                  `${SHADOW_DRIVE_ENDPOINT}${storageAccountPublickey}/${name}`
              ).toString()
            : fileUrl;

        return fileUrl;
    };

    // TODO: Rewrite this function
    const getOrCreateStorageAccountByName = async (
        storageAccountName: string
    ) => {
        if (!drive) {
            throw new Error("Drive is not initalized");
        }

        // get list of all storage accounts
        const accounts = await getStorageAccounts();

        // check for the storage account with the input received
        let account = accounts?.find(acc => {
            acc.account.identifier === storageAccountName;
        });

        // If storage account not found with the same name create one
        if (!account) {
            try {
                await drive.createStorageAccount(
                    storageAccountName,
                    "1GB",
                    "v2"
                );
            } catch (e) {
                throw new Error("Error creating storage bucket");
            }
        }

        return account?.account;
    };

    return {
        drive,
        getStorageAccounts,
        findUrlByFileName,
        getOrCreateStorageAccountByName,
    };
};
