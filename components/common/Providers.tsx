import { ReactNode } from "react";
import Layout from "../layout";
import { MAINNET_RPC } from "@/constants/endpoints";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
    BackpackWalletAdapter,
    PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const Providers = ({ children }: { children: ReactNode }) => {
    const endpoint = MAINNET_RPC;
    const wallets = [new PhantomWalletAdapter(), new BackpackWalletAdapter()];

    return (
        <ConnectionProvider
            endpoint={endpoint}
            config={{ commitment: "confirmed" }}
        >
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    <Layout>{children}</Layout>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default Providers;
