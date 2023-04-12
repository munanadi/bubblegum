// import { Inter } from "next/font/google";
// import NoSSR from "react-no-ssr";
import { ReactNode } from "react";
import Profile from "@/components/Profile";

// const inter = Inter({ subsets: ["latin"] });

export default function Home({ children }: { children: ReactNode }) {
    return <Profile />;
}
