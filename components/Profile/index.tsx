import React, { useEffect, useState } from "react";
import { useCreateUser, useCreateProfile } from "@gumhq/react-sdk";
import { useGumSDK } from "@/hooks/useGumSdk";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ShdwDrive, StorageAccountResponse } from "@shadow-drive/sdk";
import * as anchor from "@coral-xyz/anchor";
import randomBytes from "randombytes";
import { SHADOW_DRIVE_ENDPOINT } from "@/constants/endpoints";
import { getProfile, getUser } from "@/helpers/fetchData";

const { PublicKey } = anchor.web3;

function Profile() {
    const wallet = useWallet();
    const { connection } = useConnection();

    const sdk = useGumSDK();
    const { getOrCreate: getOrCreateUser, create: createUser } =
        useCreateUser(sdk);
    const {
        getOrCreate: getOrCreateProfile,
        create: createProfile,
        createProfileIxMethodBuilder,
    } = useCreateProfile(sdk);

    const [drive, setDrive] = useState<ShdwDrive>();
    const [storageAccount, setStorageAccount] =
        useState<StorageAccountResponse>();
    const [profileMetadataUrl, setProfileMetadataUrl] = useState<string | null>(
        null
    );
    const [dpUrl, setDpUrl] = useState<string | null>(null);

    // Init Drive
    useEffect(() => {
        async function initDrive() {
            // TODO: Need to have SHDW, Pre transaction convert SHD as required.
            try {
                const drive = await new ShdwDrive(connection, wallet).init();
                setDrive(drive);
            } catch (e) {
                console.log("handled");
            }
        }
        if (wallet && connection) {
            initDrive();
        }
    }, [wallet]);

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
        if (drive) {
            getAccounts();
        }
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
                    setProfileMetadataUrl(url);
                }
            }
        }
        checkForProfileMetaData();
    }, [storageAccount, drive]);

    // Check if profile_metadata is present
    useEffect(() => {
        async function checkForDp() {
            if (drive && storageAccount) {
                const fileNames =
                    (await drive.listObjects(storageAccount?.publicKey)) ?? [];
                const dpPresent =
                    fileNames.keys.filter(
                        (fileName: any) => fileName === "dp.png"
                    ).length > 0;

                let url = "";
                if (dpPresent) {
                    url =
                        SHADOW_DRIVE_ENDPOINT +
                        `${storageAccount.publicKey}/dp.png`;
                    url = new URL(url).toString();
                    setDpUrl(url);
                }
            }
        }
        checkForDp();
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
                return;
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

            console.log(
                "storage accont present",
                storageAccount?.publicKey.toString()
            );

            let avatarUrl;
            let profileUrl;
            // Check for profile metadata file in storage
            if (!profileMetadataUrl) {
                if (storageAccount) {
                    // profile metadata URI should have name, bio, username, avatar

                    // Upload a static placeholder image for now
                    console.log("Does this even work?");

                    if (!dpUrl) {
                        const r = await fetch("./dp.png");
                        const re = await r.blob();

                        let dp = new File([re], "dp.png", re);
                        console.log(dp);
                        try {
                            let upload = await drive.uploadFile(
                                storageAccount.publicKey,
                                dp
                            );
                            let url = new URL(
                                upload.finalized_locations[0]
                            ).toString();
                            avatarUrl = url;
                            setDpUrl(url);
                        } catch (e) {
                            console.log(`Image upload failed`);
                            return;
                        }
                    }

                    console.log(avatarUrl);
                    // TODO: populate data from inputs
                    const data = {
                        name: "John doe",
                        bio: "What's up there?",
                        avatar: avatarUrl, // TOOD: add minidenticons later as defaults
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
                        setProfileMetadataUrl(url);
                        profileUrl = url;
                    } catch (e) {
                        console.log("Upload failed", upload?.upload_errors);
                    }
                }
            }

            console.log(`Profile metadata file is at ${profileUrl}`);

            // Create Profile
            // This wont work cause of indexer issue - get and create separateyly
            // const profile = await getOrCreateProfile();
            let profilePDA;

            try {
                if (userPDA) {
                    profilePDA = await getProfile(userPDA, "Personal");
                    console.log(`Found profile with ${profilePDA?.toString()}`);
                }

                if (!profilePDA && profileUrl && userPDA) {
                    console.log("Creating profile with metadata");

                    const createProfile = await sdk.profile.create(
                        userPDA,
                        "Personal",
                        wallet?.publicKey
                    );
                    const profileMetadata = await sdk.profileMetadata.create(
                        profileUrl,
                        createProfile.profilePDA,
                        userPDA,
                        wallet?.publicKey
                    );
                    const profileMetadataIx =
                        await profileMetadata.instructionMethodBuilder.instruction();

                    const tx =
                        createProfile.instructionMethodBuilder.postInstructions(
                            [profileMetadataIx]
                        );

                    const result = await tx.rpc();
                    console.log();
                }
            } catch (err: any) {
                throw new Error(
                    `Error getting or creating profile: ${err.message}`
                );
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
