import { PublicKey } from "@solana/web3.js";

export const getShortAddress = (add: PublicKey, slice: number = 4): string => {
    let address = add.toString();

    return `${address.slice(0, slice + 2)}…${address.slice(
        address.length - slice
    )}`;
};
