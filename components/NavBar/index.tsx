import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import Link from "next/link";

export default function NavBar() {
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
                            <>
                                {/* TODO:  Works but errors out, replace it with a custom modal later */}
                                <WalletMultiButton
                                    startIcon={undefined}
                                    endIcon={undefined}
                                    className="bg-black"
                                ></WalletMultiButton>
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
