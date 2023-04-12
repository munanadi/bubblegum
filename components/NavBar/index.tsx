import { GUM_MAINNET_GRAPHQL, MAINNET_CLUSTER } from "@/constants/endpoints";
import { useAppState } from "@/store/AppState";
import { useGum } from "@gumhq/react-sdk";
import {
    AnchorWallet,
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { GraphQLClient } from "graphql-request";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";

const ReactUIWalletConnectButtonDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

export default function NavBar() {
    const wallet = useWallet();
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
    setGumSdk(sdk);

    useEffect(() => {
        if (wallet) {
            setWallet(wallet);
        }
        if (connection) {
            setConnection(connection);
        }
    }, [wallet.connected]);

    return (
        <div>
            <div className="bg-white sticky top-0 shadow-sm">
                <div className="mx-auto px-4 py-1">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            className="md:hidden w-10 h-10 rounded-lg -ml-2 flex justify-center items-center"
                        >
                            <svg
                                className="text-gray-500 w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <Link
                            href="/"
                            className="font-bold text-gray-700 text-2xl"
                        >
                            Bubblegum.
                        </Link>

                        <div className="hidden md:flex space-x-3 flex-1 lg:ml-8">
                            <Link
                                href="/"
                                className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                            >
                                Home
                            </Link>
                            <Link
                                href="/profile"
                                className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                            >
                                Profile
                            </Link>
                            <Link
                                href="/create"
                                className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                            >
                                Create
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative hidden md:block">
                                <input
                                    type="search"
                                    className="pl-10 pr-2 h-10 py-1 rounded-lg border border-gray-200 focus:border-gray-300 focus:outline-none focus:shadow-inner leading-none"
                                    placeholder="Search"
                                />
                                <svg
                                    className="h-6 w-6 text-gray-300 ml-2 mt-2 stroke-current absolute top-0 left-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>

                            <ReactUIWalletConnectButtonDynamic className="bg-black"></ReactUIWalletConnectButtonDynamic>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
