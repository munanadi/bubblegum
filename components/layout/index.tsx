import React, { FC, ReactNode } from "react";
import NavBar from "../NavBar";
import { ErrorBoundary } from "react-error-boundary";
import Footer from "../Footer";

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <NavBar />
            {children}
            <Footer />
        </ErrorBoundary>
    );
};

export default Layout;
