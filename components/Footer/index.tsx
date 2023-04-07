import React from "react";
import { HStack, VStack, Text } from "@chakra-ui/react";

function Footer() {
    return (
        <HStack
            w="full"
            h="full"
            bg="blackAlpha.800"
            borderRadius={"md"}
            px={2}
            py={2}
        >
            <Text size="lg" fontWeight={"bold"} color="white">
                Build with ❤️ by Builder&rsquo;s
            </Text>
        </HStack>
    );
}

export default Footer;
