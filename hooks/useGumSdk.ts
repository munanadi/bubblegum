import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useGum } from "@gumhq/react-sdk";
import { Cluster, ConfirmOptions, Connection } from "@solana/web3.js";
import { GraphQLClient } from "graphql-request";
import * as anchor from "@coral-xyz/anchor";

export const useGumSDK = (
    connection: Connection = new anchor.web3.Connection(
        "https://api.devnet.solana.com",
        "processed"
    ),
    opts: ConfirmOptions = { preflightCommitment: "processed" },
    cluster: Cluster = "devnet",
    gqlEndpoint: string = "https://aware-earwig-49.hasura.app/v1/graphql"
) => {
    const anchorWallet = useAnchorWallet() as AnchorWallet;
    let gqlClient: GraphQLClient | undefined;

    if (gqlEndpoint) {
        gqlClient = new GraphQLClient(gqlEndpoint);
    }

    const sdk = useGum(anchorWallet, connection, opts, cluster, gqlClient);

    return sdk;
};
