import { SDK, useGum } from "@gumhq/react-sdk";
import { Namespace } from "@gumhq/sdk";
import { PublicKey } from "@solana/web3.js";
import { getProfile, getUser } from "@/helpers/fetchData";
import randomBytes from "randombytes";
import { useAppState } from "@/store/AppState";
import { useEffect } from "react";
import {
    AnchorWallet,
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import { GraphQLClient } from "graphql-request";
import { GUM_MAINNET_GRAPHQL, MAINNET_CLUSTER } from "@/constants/endpoints";

export interface GumStuff {
    sdk: SDK | undefined;
    getOrCreateUser: (ownerPubKey: PublicKey) => Promise<PublicKey | undefined>;
    getOrCreateProfile: (
        accountPDAPubkey: PublicKey,
        namespace: Namespace,
        profileMetadataUrl: string
    ) => Promise<PublicKey | undefined>;
}

export const useGumStuff = (): GumStuff => {
    const setUserPDA = useAppState(state => state.setUserPDA);
    const setProfilePDA = useAppState(state => state.setProfilePDA);
    const setTxHash = useAppState(state => state.setTxHash);
    // const wallet = useAppState(state => state.wallet);

    const wallet = useWallet();
    const publicKey = wallet?.publicKey;
    const { connection } = useConnection();
    const setWallet = useAppState(state => state.setWallet);
    const setConnection = useAppState(state => state.setConnection);
    const setGumSdk = useAppState(state => state.setGumSdk);

    const anchorWallet = wallet.wallet as any as AnchorWallet;

    const gqlClient = new GraphQLClient(GUM_MAINNET_GRAPHQL);
    const cluster = MAINNET_CLUSTER;

    const sdk = useGum(
        anchorWallet,
        connection,
        { preflightCommitment: "confirmed" },
        cluster,
        gqlClient
    );

    useEffect(() => {
        setGumSdk(sdk);

        if (wallet) {
            setWallet(wallet);
        }
        if (connection) {
            setConnection(connection);
        }
        (async () => {
            let userPDA;
            if (wallet.publicKey) {
                userPDA = await getUser(wallet.publicKey);
                if (userPDA) {
                    setUserPDA(userPDA);
                }
            }
            if (wallet.publicKey && userPDA) {
                let profilePDA = await getProfile(userPDA, "Personal");
                if (profilePDA) {
                    setProfilePDA(profilePDA);
                }
            }
        })();
    }, [wallet.connected, sdk]);

    /**
     * Function that takes a wallet address and returns its userPDA or creates one for it.
     */
    const getOrCreateUser = async (ownerPubkey: PublicKey) => {
        if (!sdk) {
            return undefined;
        }

        let userPDA;
        try {
            userPDA = await getUser(ownerPubkey);

            if (!userPDA) {
                const randomHash = randomBytes(32);
                const instructionMethodBuilder = sdk.program.methods
                    .createUser(randomHash)
                    .accounts({
                        authority: ownerPubkey,
                    });
                const pubKeys = await instructionMethodBuilder.pubkeys();
                userPDA = pubKeys.user as PublicKey;

                const txSig = await instructionMethodBuilder.rpc();
                setUserPDA(userPDA);
                setTxHash(txSig);
            }
        } catch (err: any) {
            throw new Error(`Error getting or creating user: ${err.message}`);
        }

        return userPDA;
    };

    /**
     * Function that takes userPDA and profile metadata url and returns a profile PDA under a namepsace
     */
    const getOrCreateProfile = async (
        userPDAPubkey: PublicKey,
        namespace: Namespace,
        profileMetadataUrl: string
    ) => {
        // TODO: support other namespaces too
        namespace = "Personal";

        if (!sdk || !publicKey) {
            return undefined;
        }

        let profilePDA;
        profilePDA = await getProfile(userPDAPubkey, namespace);

        if (!profilePDA) {
            const createProfile = await sdk.profile.create(
                userPDAPubkey,
                namespace,
                publicKey
            );
            profilePDA = createProfile.profilePDA as PublicKey;
            const profileMetadata = await sdk.profileMetadata.create(
                profileMetadataUrl,
                createProfile.profilePDA,
                userPDAPubkey,
                publicKey
            );

            const profileMetadataIx =
                await profileMetadata.instructionMethodBuilder.instruction();
            const tx = createProfile.instructionMethodBuilder.postInstructions([
                profileMetadataIx,
            ]);

            const result = await tx.rpc();
            setProfilePDA(profilePDA);
            setTxHash(result);
        }
        return profilePDA;
    };

    return {
        sdk,
        getOrCreateUser,
        getOrCreateProfile,
    };
};
