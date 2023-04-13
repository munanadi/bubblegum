import { useGumStuff } from "@/hooks/useGumStuff";
import { useShadowDrive } from "@/hooks/useShadowDrive";
import { useAppState } from "@/store/AppState";
import { StorageAccountResponse } from "@shadow-drive/sdk";
import { FC, ReactNode, useEffect, useState } from "react";

const Profile: FC<{ children: ReactNode }> = ({ children }) => {
    const wallet = useAppState(state => state.wallet);
    const connected = useAppState(state => state.wallet?.connected);
    const connection = useAppState(state => state.connection);
    const sdk = useAppState(state => state.gumSdk);

    const userPDA = useAppState(state => state.userPDA);
    const profilePDA = useAppState(state => state.profilePDA);

    console.log({ userPDA, profilePDA, sdk, connection, wallet, connected });

    const [storageAccount, setStorageAccount] =
        useState<StorageAccountResponse>();
    const [profileMetadataUrl, setProfileMetadataUrl] = useState<string | null>(
        null
    );
    const [dpUrl, setDpUrl] = useState<string | null>(null);

    const {
        findUrlByFileName,
        getOrCreateStorageAccountByName,
        drive,
        getStorageAccounts,
    } = useShadowDrive(wallet, connection);

    const { getOrCreateUser, getOrCreateProfile } = useGumStuff();

    useEffect(() => {
        async function getStorage() {
            const acc = await getStorageAccounts();
            if (acc) {
                setStorageAccount(acc[0]);
            }
        }
        getStorage();
    }, [drive]);

    // Check if profile_metadata is present
    useEffect(() => {
        async function checkForFiles() {
            if (drive && storageAccount) {
                const metadataUrl = await findUrlByFileName(
                    "metadata.json",
                    storageAccount.publicKey
                );

                setProfileMetadataUrl(metadataUrl ?? "");
            }
        }
        checkForFiles();
    }, [storageAccount, drive]);

    // Check if dp.png is present
    useEffect(() => {
        async function checkForDp() {
            if (drive && storageAccount) {
                const dpUrl = await findUrlByFileName(
                    "dp.png",
                    storageAccount.publicKey
                );

                setProfileMetadataUrl(dpUrl ?? "");
            }
        }
        checkForDp();
    }, [storageAccount, drive]);

    const handleClick = async () => {
        if (connected && drive && wallet?.publicKey && sdk) {
            // Get or Create User
            // This doesnt work at the moment, cause mainnet indexers need updation
            // let userPDA = await getOrCreateUser(wallet?.publicKey);
            const userPDA = await getOrCreateUser(wallet.publicKey);
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

            if (userPDA && profileUrl) {
                let profilePDA = await getOrCreateProfile(
                    userPDA,
                    "Personal",
                    profileUrl
                );
            }
        }
    };

    return (
        <>
            <div className="bg-white p-3 w-full">
                <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                    {wallet?.publicKey
                        ? `Hello ${wallet?.publicKey.toString()}`
                        : `Please Connect your wallet`}
                </h1>
                <>
                    {wallet?.publicKey ? (
                        <>
                            <button
                                onClick={handleClick}
                                className="bg-black rounded-sm text-white p-2"
                            >
                                Create Account
                            </button>
                            <ul className="bg-gray-100 text-gray-600py-2 px-3 mt-3 divide-y rounded shadow-sm">
                                <li className="flex items-center py-3">
                                    <span>User Account</span>
                                    <span className="ml-auto">
                                        <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                                            Active
                                        </span>
                                    </span>
                                </li>

                                <li className="flex items-center py-3">
                                    <span>Profile Account</span>
                                    <span className="ml-auto">
                                        <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                                            Active
                                        </span>
                                    </span>
                                </li>
                            </ul>
                        </>
                    ) : null}
                </>
            </div>
        </>
    );
};

export default Profile;
