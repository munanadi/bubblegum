import React from "react";
import { useCreateUser, useGum } from "@gumhq/react-sdk";
import { useGumSDK } from "@/hooks/useGumSdk";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

function Profile() {
    const sdk = useGumSDK();
    const {
        create,
        getOrCreate,
        createUserError,
        createUserIxMethodBuilder,
        isCreatingUser,
    } = useCreateUser(sdk);

    const wallet = useAnchorWallet();

    const checking = async () => {
        if (wallet?.publicKey !== undefined) {
            const res = await (
                await createUserIxMethodBuilder(wallet?.publicKey)
            )?.instructionMethodBuilder?.instruction();
        }
    };

    return <div>Profile</div>;
}

export default Profile;
