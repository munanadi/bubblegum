import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useGum } from "@gumhq/react-sdk";
import { GraphQLClient } from "graphql-request";
import * as anchor from "@coral-xyz/anchor";
import { MAINNET_CLUSTER, MAINNET_RPC } from "@/constants/endpoints";

export const useGumSDK = (
    connection: anchor.web3.Connection = new anchor.web3.Connection(
        MAINNET_RPC,
        "confirmed"
    ),
    opts: anchor.web3.ConfirmOptions = { preflightCommitment: "confirmed" },
    cluster: anchor.web3.Cluster = MAINNET_CLUSTER,
    gqlEndpoint: string = "https://light-pelican-32.hasura.app/v1/graphql"
) => {
    const anchorWallet = useAnchorWallet() as AnchorWallet;
    let gqlClient: GraphQLClient | undefined;

    if (gqlEndpoint) {
        gqlClient = new GraphQLClient(gqlEndpoint);
    }

    const sdk = useGum(anchorWallet, connection, opts, cluster, gqlClient);

    return sdk;
};
