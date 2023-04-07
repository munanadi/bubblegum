import React from "react";
import { Box, Heading, HStack, VStack, Text, Icon } from "@chakra-ui/react";
import {
    BiHomeCircle,
    BiUser,
    BiHash,
    BiMessage,
    BiDiamond,
} from "react-icons/bi";

// TODO: Create a List and make the sidebar

function SideBar() {
    return (
        <VStack
            pl={8}
            pr={6}
            align={"center"}
            color="whiteAlpha.900"
            spacing={4}
            borderRight="0.5px solid"
            h="100vh"
            borderColor="gray.500"
        >
            <HStack
                _hover={{ bg: "gray.700" }}
                borderRadius={"md"}
                w="full"
                py={2}
                px={2}
            >
                <Icon as={BiHomeCircle} boxSize={"24px"} />
                <Text size={"lg"} fontWeight={"bold"}>
                    Home
                </Text>
            </HStack>
            <HStack
                _hover={{ bg: "gray.700" }}
                borderRadius={"md"}
                w="full"
                py={2}
                px={2}
            >
                <Icon as={BiHash} boxSize={"24px"} />
                <Text size={"lg"} fontWeight={"bold"}>
                    Explore
                </Text>
            </HStack>
            <HStack
                _hover={{ bg: "gray.700" }}
                borderRadius={"md"}
                w="full"
                py={2}
                px={2}
            >
                <Icon as={BiUser} boxSize={"24px"} />
                <Text size={"lg"} fontWeight={"bold"}>
                    Profile
                </Text>
            </HStack>
            <HStack
                _hover={{ bg: "gray.700" }}
                borderRadius={"md"}
                w="full"
                py={2}
                px={2}
            >
                <Icon as={BiMessage} boxSize={"24px"} />
                <Text size={"lg"} fontWeight={"bold"}>
                    Messages
                </Text>
            </HStack>
            <HStack
                _hover={{ bg: "gray.700" }}
                borderRadius={"md"}
                w="full"
                py={2}
                px={2}
            >
                <Icon as={BiDiamond} boxSize={"24px"} />
                <Text size={"lg"} fontWeight={"bold"}>
                    More
                </Text>
            </HStack>
        </VStack>
    );
}

export default SideBar;
