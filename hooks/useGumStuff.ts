import { SDK, useGum } from "@gumhq/react-sdk";
import { Namespace } from "@gumhq/sdk";
import { PublicKey } from "@solana/web3.js";
// TODO: Fetchers were out of sync, need to build an indexer
import { getProfile, getUser } from "@/helpers/fetchData";
import randomBytes from "randombytes";
import { useAppState } from "@/store/AppState";
import { useEffect, useMemo } from "react";
import {
    AnchorWallet,
    useAnchorWallet,
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
    deleteProfile: (
        profileAccount: PublicKey,
        userAccount: PublicKey,
        owner: PublicKey
    ) => Promise<string | undefined>;
    deleteUser: (
        userAccont: PublicKey,
        owner: PublicKey
    ) => Promise<string | undefined>;
    getUser: () => Promise<PublicKey | undefined>;
    getProfile: (
        userPDA: PublicKey,
        namespace: Namespace
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

    const anchorWallet = useAnchorWallet() as AnchorWallet;

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
                userPDA = await getUser();
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

    const userAccounts = useMemo(async () => {
        if (!sdk || !publicKey) {
            return undefined;
        }
        const allAccounts = await sdk.program.account.user.all();
        const accounts: any[] = [];
        for (const acc of allAccounts) {
            if (acc.account.authority.toString() === publicKey.toString()) {
                accounts.push(acc);
            }
        }
        return accounts;
    }, [publicKey]);

    /**
     * Returns the first user accounts found
     */
    const getUser = async () => {
        const accs = await userAccounts;

        if (!accs) return null;

        // console.log(accs[0].publicKey);
        return accs[0].publicKey;
    };

    const profileAccounts = useMemo(async () => {
        if (!sdk || !publicKey) {
            return undefined;
        }

        const userPDA = await getUser();

        const allAccounts = await sdk.program.account.profile.all();
        const accounts: any[] = [];

        for (const acc of allAccounts) {
            if (acc.account.user.toString() === userPDA.toString()) {
                accounts.push(acc);
            }
        }
        return accounts;
    }, [publicKey]);

    /**
     * Returns the first user accounts found
     */
    const getProfile = async (userPDA: PublicKey, namepsace: Namespace) => {
        const accs = await profileAccounts;

        if (!accs) return null;

        for (const acc of accs) {
            if (
                Object.keys(acc.account.namespace)[0] ===
                namepsace.toString().toLowerCase()
            ) {
                return acc.publicKey;
            }
        }

        return null;
    };

    /**
     * Function that takes a wallet address and returns its userPDA or creates one for it.
     */
    const getOrCreateUser = async (ownerPubkey: PublicKey) => {
        if (!sdk) {
            return undefined;
        }

        let userPDA;
        try {
            userPDA = await getUser();

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

    const deleteProfile = async (
        profileAccount: PublicKey,
        userAccount: PublicKey,
        owner: PublicKey
    ): Promise<string | undefined> => {
        if (!sdk) return;

        const res = await sdk.profile
            .delete(profileAccount, userAccount, owner)
            .rpc();

        setProfilePDA(undefined);

        return res;
    };

    const deleteUser = async (userAccount: PublicKey, owner: PublicKey) => {
        if (!sdk) return;

        const res = await sdk.user.delete(userAccount, owner).rpc();

        setUserPDA(undefined);
        return res;
    };

    return {
        sdk,
        getOrCreateUser,
        getOrCreateProfile,
        deleteProfile,
        deleteUser,
        getUser,
        getProfile,
    };
};
