import type { AppProps } from "next/app";
import { Suspense } from "react";
import Providers from "@/components/common/Providers";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Suspense>
            <Providers>
                <Component {...pageProps} />
            </Providers>
        </Suspense>
    );
}
