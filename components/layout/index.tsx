import React from "react";
import { Box, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import NavBar from "../NavBar";
import SideBar from "../SideBar";
import { ErrorBoundary } from "react-error-boundary";
import Footer from "../Footer";
import RightSideBar from "../RightSidebar";

function Layout() {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Grid
                templateAreas={` 
    "header header header"
    "leftSide main rightSide"
    "footer footer footer"

    `}
                gridTemplateColumns={"1fr 3fr 1fr"}
                gridTemplateRows="9vh 86vh 5vh"
            >
                <GridItem area={"header"}>
                    <NavBar />
                </GridItem>
                <GridItem area={"leftSide"}>
                    <SideBar />
                </GridItem>
                <GridItem area={"main"}>
                    <Box>main</Box>
                </GridItem>
                <GridItem area="rightSide">
                    <RightSideBar />
                </GridItem>
                <GridItem
                    justifySelf={"flex-end"}
                    area="footer"
                    position="fixed"
                    bottom={0}
                >
                    <Footer />
                </GridItem>
            </Grid>
        </ErrorBoundary>
    );
}

export default Layout;
