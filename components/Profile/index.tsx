import React from "react";
import { useCreateUser, useGum, useCreateProfile } from "@gumhq/react-sdk";
import { useGumSDK } from "@/hooks/useGumSdk";
import {
    useAnchorWallet,
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import { ShdwDrive } from "@shadow-drive/sdk";
import * as anchor from "@coral-xyz/anchor";
import randomBytes from "randombytes";

const { PublicKey } = anchor.web3;

function Profile() {
    const sdk = useGumSDK();

    const wallet = useWallet();
    const anchorWallet = useAnchorWallet();

    const { connection } = useConnection();

    const handleClick = async () => {
        if (wallet?.publicKey && wallet) {
            // TODO: Their indexer is only in the Devnet right now
            // save the PDAs that is created.

            // Create User
            let gumKeys = {
                userPDA: "J7KvdtXZMV2bNHLoHH3ZQ4d82gA3277vDuwUr2BmEgzQ",
                shadowPDA: "2KMaSNZhEdW3dffPjuG25uEVBKyTkxafEZvTKgzTCwHM",
            };

            if (localStorage.getItem("gumKeys")) {
                const lsKeys = localStorage.getItem("gumKeys")!;
                const gum = JSON.parse(lsKeys);
                const userPDA = new anchor.web3.PublicKey(gum.userPDA);

                console.log(
                    userPDA.toString(),
                    "is the user that was created from this wallet"
                );
                // TODO: Add better checking if accounts are present, after mainnet indexer is done
                // const userAccount = await sdk.program.account.user.fetch(
                //     new PublicKey(userPDA)
                // );
                // console.log(userAccount);
            } else {
                const randomHash = randomBytes(32);
                const instructionMethodBuilder = sdk.program.methods
                    .createUser(randomHash)
                    .accounts({
                        authority: wallet?.publicKey,
                    });
                const pubKeys = await instructionMethodBuilder.pubkeys();
                const userPDA = pubKeys.user as anchor.web3.PublicKey;

                await instructionMethodBuilder.rpc();

                console.log("User created", userPDA.toString());

                gumKeys = {
                    ...gumKeys,
                    userPDA: userPDA.toString(),
                };
                localStorage.setItem("gum", JSON.stringify(gumKeys));
            }

            try {
                if (localStorage.getItem("gumKeys")) {
                    const g = JSON.parse(localStorage.getItem("gumKeys")!);
                    gumKeys.shadowPDA = g.shadowPDA;
                }

                //  Shadow Drive
                // TODO: Need to have SHDW, Pre transaction convert SHD as required.
                const drive = await new ShdwDrive(connection, wallet).init();

                let acctPubKey;

                if (!gumKeys.shadowPDA) {
                    // Creating an account
                    const newAcct = await drive.createStorageAccount(
                        "firstBucket",
                        "5MB",
                        "v2"
                    );
                    console.log(newAcct, "is created for us");
                    const accts = await drive.getStorageAccounts("v2");
                    acctPubKey = accts[0].publicKey;
                    console.log(
                        acctPubKey.toString(),
                        "is the buckets address"
                    );

                    gumKeys = {
                        ...gumKeys,
                        shadowPDA: acctPubKey.toString(),
                    };
                    localStorage.setItem("gumKeys", JSON.stringify(gumKeys));
                }

                acctPubKey = new anchor.web3.PublicKey(gumKeys.shadowPDA);
                // const acct = await drive.getStorageAccount(acctPubKey);
                // console.log(acct);

                // profile metadata URI should have name, bio, username, avatar
                const data = {
                    name: "John doe",
                    bio: "What's up there?",
                    avatar: "",
                    username: "jondoe",
                };

                // Construct the file to upload
                let file = new File(
                    [JSON.stringify(data)],
                    "profile_metadata.json",
                    {
                        type: "application/json",
                    }
                );

                const upload = await drive.uploadFile(acctPubKey, file);
                console.log(upload);
            } catch (e) {
                console.log(e);
            }

            // Create Profile
            // const profile = await getOrCreateProfile();
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
