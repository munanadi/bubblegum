import type { AppProps } from "next/app";
import { Suspense } from "react";
import Providers from "@/components/common/Providers";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        // <Suspense fallback={<div>loading...</div>}>
        <Providers>
            <Component {...pageProps} />
        </Providers>
        // </Suspense>
    );
}
