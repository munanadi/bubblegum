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

    const storageAccount = useAppState(state => state.storageAccount);

    const publickey = wallet?.publicKey;

    const { drive } = useShadowDrive(wallet, connection);

    const { getOrCreateUser, getOrCreateProfile } = useGumStuff();

    return (
        <>
            <div className="bg-white p-3 w-full">
                <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                    {!publickey && `Please Connect your Wallet`}
                    {publickey &&
                        (!profilePDA || !userPDA) &&
                        `Head to create profile to create profile`}
                    {publickey &&
                        profilePDA &&
                        userPDA &&
                        `Here is a list of your posts`}
                </h1>
            </div>
        </>
    );
};

export default Profile;
