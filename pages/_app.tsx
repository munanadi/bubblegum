import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/index";
import WalletWrapper from "@/components/Wallet";
import { DEVNET_RPC, MAINNET_RPC } from "@/constants/endpoints";

export default function App({ Component, pageProps }: AppProps) {
    const endpoint = MAINNET_RPC;

    return (
        <WalletWrapper endpoint={endpoint}>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </WalletWrapper>
    );
}
