import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Box, Text } from "@chakra-ui/react";
import Layout from "@/components/layout";
import NoSSR from "react-no-ssr";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ children }: { children: ReactNode }) {
    return (
        <NoSSR>
            <Layout>{children}</Layout>
        </NoSSR>
    );
}
