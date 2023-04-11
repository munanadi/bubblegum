import { ReactNode } from "react";
import Layout from "../layout";
import theme from "../../theme/index";
import { MAINNET_RPC } from "@/constants/endpoints";
import { ChakraProvider } from "@chakra-ui/react";
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
                    <ChakraProvider theme={theme}>
                        <Layout>{children}</Layout>
                    </ChakraProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default Providers;
