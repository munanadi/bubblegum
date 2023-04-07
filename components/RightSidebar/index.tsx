import React from "react";
import { Box, Heading, VStack, HStack, Text } from "@chakra-ui/react";

function RightSideBar() {
    return (
        <VStack
            h="full"
            w="full"
            borderLeft={"0.5px solid"}
            borderColor="gray.500"
        >
            <Text>Right Sidebar</Text>
        </VStack>
    );
}

export default RightSideBar;
