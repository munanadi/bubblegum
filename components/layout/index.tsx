import React, { FC, ReactNode } from "react";
import NavBar from "../NavBar";
import { ErrorBoundary } from "react-error-boundary";
import Footer from "../Footer";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useGumStuff } from "@/hooks/useGumStuff";
import { useShadowDrive } from "@/hooks/useShadowDrive";

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    const wallet = useWallet();
    const { connection } = useConnection();

    // TODO: Should be initialized here
    const {} = useGumStuff();
    const {} = useShadowDrive(wallet, connection);

    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <NavBar />
            {children}
            <Footer />
        </ErrorBoundary>
    );
};

export default Layout;
