import React, { FC, ReactNode } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "../NavBar";
import { ErrorBoundary } from "react-error-boundary";
import Profile from "../Profile";

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Grid
                templateAreas={` 
    "header header header"
    "leftSide main rightSide"
    `}
                gridTemplateColumns={"0.5fr 2fr 0.5fr"}
                gridTemplateRows="9vh 91vh"
            >
                <GridItem area={"header"}>
                    <NavBar />
                </GridItem>
                <GridItem area={"main"}>
                    <Profile />
                </GridItem>
            </Grid>
        </ErrorBoundary>
    );
};

export default Layout;
