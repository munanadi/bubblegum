import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/index";
import WalletWrapper from "@/components/Wallet";

export default function App({ Component, pageProps }: AppProps) {
    const endpoint = "https://api.devnet.solana.com";

    return (
        <WalletWrapper endpoint={endpoint}>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </WalletWrapper>
    );
}
