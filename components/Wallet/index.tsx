import React from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import {
    BackpackWalletAdapter,
    PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");

type WalletWrapperProps = {
    children: React.ReactNode;
    endpoint: string;
};

function WalletWrapper({ children, endpoint }: WalletWrapperProps) {
    const wallets = [new PhantomWalletAdapter(), new BackpackWalletAdapter()];

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default WalletWrapper;
