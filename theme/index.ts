import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";

const theme = extendTheme({
    colors: {
        brand: {
            500: "#d45afe",
        },
    },
    styles: {
        global: (props: StyleFunctionProps) => ({
            body: {
                bg: mode("blackAlpha.900", "white")(props),
                color: mode("white", "blackAlpha.900")(props),
            },
        }),
    },
});

export default theme;
