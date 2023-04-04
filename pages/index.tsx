import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Box, Text } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <Box>
            <Text>Web3Social build on Gum</Text>
        </Box>
    );
}
