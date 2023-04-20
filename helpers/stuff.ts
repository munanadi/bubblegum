import { PublicKey, Connection } from "@solana/web3.js";

export const getShortAddress = (add: PublicKey, slice: number = 4): string => {
    let address = add.toString();

    return `${address.slice(0, slice + 2)}…${address.slice(
        address.length - slice
    )}`;
};

/**
 * function to check if SHD exists in a wallet address
 */
export const checkForShadowATA = async (
    walletAddress: PublicKey,
    connection: Connection
): Promise<boolean> => {
    const tokenAta = (
        await connection?.getTokenAccountsByOwner(walletAddress, {
            mint: new PublicKey("SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y"),
        })
    )?.value[0];

    if (tokenAta?.pubkey.toString()) {
        return true;
    }

    return false;
};

export const getExplorerUrl = (type: "address" | "tx", data: string) => {
    return `https://explorer.solana.com/${type}/${data}`;
};
