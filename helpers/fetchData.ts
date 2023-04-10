import { GUM_MAINNET_GRAPHQL } from "@/constants/endpoints";
import { useGumSDK } from "@/hooks/useGumSdk";
import * as anchor from "@coral-xyz/anchor";
import { GraphQLClient, gql } from "graphql-request";

export async function getUser(
    owner: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey | null> {
    const gqlClient = new GraphQLClient(GUM_MAINNET_GRAPHQL);

    const query = gql`
        query GetUser($owner: String!) {
            gpl_core_0_1_0_decoded_user(where: { authority: { _eq: $owner } }) {
                authority
                cl_pubkey
                randomhash
            }
        }
    `;
    const variables = {
        owner: owner.toBase58(),
    };
    const data = await gqlClient.request<{
        gpl_core_0_1_0_decoded_user: any[];
    }>(query, variables);
    console.log(data);
    let user = data.gpl_core_0_1_0_decoded_user[0];

    if (user?.authority && user?.cl_pubkey && user?.randomhash) {
        const { cl_pubkey: userPDAstr } = user;
        return new anchor.web3.PublicKey(userPDAstr);
    }

    return null;
}
