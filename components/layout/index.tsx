import React from "react";
import { Box, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import NavBar from "../NavBar";
import SideBar from "../SideBar";
import { ErrorBoundary } from "react-error-boundary";
import Footer from "../Footer";
import RightSideBar from "../RightSidebar";
import Profile from "../Profile";

function Layout() {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Grid
                //             templateAreas={`
                // "header header header"
                // "leftSide main rightSide"
                // "footer footer footer"

                // `}
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
                <GridItem area={"leftSide"}>
                    <SideBar />
                </GridItem>
                <GridItem area={"main"}>
                    <Profile />
                </GridItem>
                <GridItem area="rightSide">
                    <RightSideBar />
                </GridItem>
                {/* <GridItem
                    justifySelf={"flex-end"}
                    area="footer"
                    position="fixed"
                    bottom={0}
                >
                    <Footer />
                </GridItem> */}
            </Grid>
        </ErrorBoundary>
    );
}

export default Layout;
