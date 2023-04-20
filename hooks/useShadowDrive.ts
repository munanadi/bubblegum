import { ShdwDrive, StorageAccountResponse } from "@shadow-drive/sdk";
import { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { SHADOW_DRIVE_ENDPOINT } from "@/constants/endpoints";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { bytesToHuman } from "@/helpers/shadowDrive";
import { useAppState } from "@/store/AppState";

export interface ShadowDriveHook {
    drive: ShdwDrive | null;
    getStorageAccounts: (
        skipDeleted?: boolean
    ) => Promise<StorageAccountResponse[] | []>;
    findUrlByFileName: (
        fileName: string,
        storageAccountPublickey: anchor.web3.PublicKey
    ) => Promise<string | undefined>;
    getOrCreateStorageAccountByName: (
        storageAccountName: string
    ) => Promise<StorageAccountResponse | undefined>;
    getStorageAccountWithName: (
        StorageAccountName: string
    ) => Promise<StorageAccountResponse | undefined>;
}

export const useShadowDrive = (
    wallet: WalletContextState | undefined,
    connection: anchor.web3.Connection | undefined
): ShadowDriveHook => {
    const [drive, setDrive] = useState<ShdwDrive | null>(null);

    const setStorageAccounts = useAppState(state => state.setStroageAccounts);
    const setStorageAccount = useAppState(state => state.setStroageAccount);

    useEffect(() => {
        const initDrive = async () => {
            if (wallet && connection) {
                const drive = await new ShdwDrive(connection, wallet).init();
                setDrive(drive);
            }

            // TODO: Refactor needed. Get storage account too.
            const stAcc = await getStorageAccountWithName("gum_bucket");
            if (stAcc) {
                setStorageAccount(stAcc);
            }
        };

        if (wallet?.connected) {
            initDrive();
        }
    }, [wallet?.connected]);

    useEffect(() => {
        getStorageAccounts(true);
    }, [drive]);

    /**
     * Returns a list of storage accounts under the wallet or []
     * by default returns all accounts, use param to skip marked for deleted
     * @param skipDeleted false by default, true to skip marked for deletion files
     */
    const getStorageAccounts = async (skipDeleted?: boolean) => {
        if (!drive) {
            return [];
        }

        let accounts = await drive.getStorageAccounts("v2");

        if (skipDeleted) {
            accounts = accounts.filter(acc => !acc.account.toBeDeleted);
        }

        if (!accounts) {
            return [];
        }

        return accounts;
    };

    /**
     * Function return a storage account with a given identifer
     */
    const getStorageAccountWithName = async (storageAccountName: string) => {
        const accounts = await getStorageAccounts(true);

        const storageAccount = accounts.filter(
            acc => acc.account.identifier === storageAccountName
        );

        if (storageAccount) {
            setStorageAccount(storageAccount[0]);
            return storageAccount[0];
        }

        return undefined;
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
            return name === fileName;
        });

        fileUrl = name
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

        // check for the storage account with the input received
        let account = await getStorageAccountWithName(storageAccountName);

        // If storage account not found with the same name create one
        if (!account) {
            try {
                await drive.createStorageAccount(
                    storageAccountName,
                    "500MB",
                    "v2"
                );
            } catch (e) {
                throw new Error("Error creating storage bucket");
            }
        }

        if (account?.account) {
            setStorageAccount(account);
        }
        return account;
    };

    return {
        drive,
        getStorageAccounts,
        findUrlByFileName,
        getOrCreateStorageAccountByName,
        getStorageAccountWithName,
    };
};
