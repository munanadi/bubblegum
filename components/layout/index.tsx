import React from "react";
import { Box, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import NavBar from "../NavBar";
import SideBar from "../SideBar";
import { ErrorBoundary } from "react-error-boundary";

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
                    <Box>Right Side</Box>
                </GridItem>
                <GridItem
                    justifySelf={"flex-end"}
                    area="footer"
                    position="fixed"
                    bottom={0}
                >
                    <Box>Footer</Box>
                </GridItem>
            </Grid>
        </ErrorBoundary>
    );
}

export default Layout;
