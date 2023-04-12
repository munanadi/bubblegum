import { SDK } from "@gumhq/react-sdk";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey, Connection } from "@solana/web3.js";
import { create } from "zustand";

interface AppState {
    // wallet
    wallet: WalletContextState | undefined;
    setWallet: (wallet: WalletContextState) => void;
    // Connection
    connection: Connection | undefined;
    setConnection: (connection: Connection) => void;
    // gumSDK
    gumSdk: SDK | undefined;
    setGumSdk: (sdk: SDK) => void;
    // userPDA
    userPDA: PublicKey | undefined;
    setUserPDA: (userPDA: PublicKey) => void;
    // profilePDA
    profilePDA: PublicKey | undefined;
    setProfilePDA: (profilePDA: PublicKey) => void;
    // tx Sig
    txHash: string | undefined;
    setTxHash: (txHash: string) => void;
}

export const useAppState = create<AppState>(set => ({
    // wallet
    wallet: undefined,
    setWallet: wallet => set(() => ({ wallet })),
    // connection
    connection: undefined,
    setConnection: connection => set(() => ({ connection })),
    // gumSDK
    gumSdk: undefined,
    setGumSdk: sdk => set(() => ({ gumSdk: sdk })),
    // userPDA
    userPDA: undefined,
    setUserPDA: userPDA => set(() => ({ userPDA })),
    // profilePDA
    profilePDA: undefined,
    setProfilePDA: profilePDA => set(() => ({ profilePDA })),
    // tx Sig
    txHash: undefined,
    setTxHash: (txHash: string) => set(() => ({ txHash })),
}));
