import React, { useEffect, useState } from "react";
import { useCreateUser, useCreateProfile } from "@gumhq/react-sdk";
import { useGumSDK } from "@/hooks/useGumSdk";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ShdwDrive, StorageAccountResponse } from "@shadow-drive/sdk";
import * as anchor from "@coral-xyz/anchor";
import randomBytes from "randombytes";
import { SHADOW_DRIVE_ENDPOINT } from "@/constants/endpoints";
import { getUser } from "@/helpers/fetchData";

const { PublicKey } = anchor.web3;

function Profile() {
    const wallet = useWallet();
    const { connection } = useConnection();

    const sdk = useGumSDK();
    const { getOrCreate: getOrCreateUser, create: createUser } =
        useCreateUser(sdk);
    const { getOrCreate: getOrCreateProfile, create: createProfile } =
        useCreateProfile(sdk);

    const [drive, setDrive] = useState<ShdwDrive>();
    const [storageAccount, setStorageAccount] =
        useState<StorageAccountResponse>();
    const [profileMetadata, setProfileMetadata] = useState<string | null>(null);

    // Init Drive
    useEffect(() => {
        async function initDrive() {
            // TODO: Need to have SHDW, Pre transaction convert SHD as required.
            const drive = await new ShdwDrive(connection, wallet).init();
            setDrive(drive);
        }
        initDrive();
    }, [wallet?.connected]);

    // Get Storage Accounts
    useEffect(() => {
        async function getAccounts() {
            const accounts = await drive?.getStorageAccounts("v2");

            if (!accounts) {
                console.log("Storage not created");
                return;
            }

            // Get the first account created
            setStorageAccount(accounts[0]);
        }
        getAccounts();
    }, [drive]);

    // Check if profile_metadata is present
    useEffect(() => {
        async function checkForProfileMetaData() {
            if (drive && storageAccount) {
                const fileNames =
                    (await drive.listObjects(storageAccount?.publicKey)) ?? [];
                const metadataPresent =
                    fileNames.keys.filter(
                        (fileName: any) => fileName === "metadata.json"
                    ).length > 0;

                let url = "";
                if (metadataPresent) {
                    url =
                        SHADOW_DRIVE_ENDPOINT +
                        `${storageAccount.publicKey}/metadata.json`;
                    url = new URL(url).toString();
                    setProfileMetadata(url);
                }
            }
        }
        checkForProfileMetaData();
    }, [storageAccount, drive]);

    const handleClick = async () => {
        if (wallet?.publicKey && wallet && drive) {
            // Get or Create User
            // This doesnt work at the moment, cause mainnet indexers need updation
            // let userPDA = await getOrCreateUser(wallet?.publicKey);
            let userPDA;
            try {
                userPDA = await getUser(wallet?.publicKey);

                if (!userPDA) {
                    userPDA = await createUser(wallet?.publicKey);
                }
            } catch (err: any) {
                throw new Error(
                    `Error getting or creating user: ${err.message}`
                );
            }

            console.log(`user present ${userPDA?.toString()}`);

            // No storage account, Create one
            if (!storageAccount) {
                // Creating an account
                // TODO: Need to strcuture data more properly
                // Can store stuff under a gum bucket
                const newAcct = await drive.createStorageAccount(
                    "firstBucket",
                    "5MB",
                    "v2"
                );
                const storageAccounts = await drive.getStorageAccounts("v2");
                // TODO: First storage account is picked. Maybe check for other accounts and pick with a certain name
                setStorageAccount(storageAccounts[0]);
            }

            // Check for profile metadata file in storage
            if (!profileMetadata) {
                if (storageAccount) {
                    // profile metadata URI should have name, bio, username, avatar
                    // TODO: populate data from inputs
                    const data = {
                        name: "John doe",
                        bio: "What's up there?",
                        avatar: "", // TOOD: add minidenticons later as defaults
                        username: "jondoe",
                    };

                    // Construct the file to upload
                    let file = new File(
                        [JSON.stringify(data)],
                        "metadata.json",
                        {
                            type: "application/json",
                        }
                    );

                    let upload;
                    try {
                        upload = await drive.uploadFile(
                            storageAccount.publicKey,
                            file
                        );

                        let url = new URL(
                            upload.finalized_locations[0]
                        ).toString();
                        setProfileMetadata(url);
                    } catch (e) {
                        console.log("Upload failed", upload?.upload_errors);
                    }
                }
            }
        }
    };

    return (
        <div>
            {wallet?.publicKey && (
                <button onClick={handleClick}>Create Account</button>
            )}
        </div>
    );
}

export default Profile;
