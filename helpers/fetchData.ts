import { GUM_MAINNET_GRAPHQL } from "@/constants/endpoints";
import { useGumSDK } from "@/hooks/useGumSdk";
import * as anchor from "@coral-xyz/anchor";
import { GraphQLClient, gql } from "graphql-request";
import { Namespace } from "@gumhq/sdk";

const gqlClient = new GraphQLClient(GUM_MAINNET_GRAPHQL);

export async function getUser(
    owner: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey | null> {
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
    let user = data.gpl_core_0_1_0_decoded_user[0];

    if (user?.authority && user?.cl_pubkey && user?.randomhash) {
        const { cl_pubkey: userPDAstr } = user;
        return new anchor.web3.PublicKey(userPDAstr);
    }

    return null;
}

export async function getProfile(
    userAccount: anchor.web3.PublicKey,
    namespace: Namespace
): Promise<anchor.web3.PublicKey | null> {
    const namespaceString = JSON.stringify({ [namespace.toLowerCase()]: {} });
    const query = gql`
      query GetProfile ($namespace: String) {
        gpl_core_0_1_0_decoded_profile(
          where: {
            username: { _eq: "${userAccount}" },
            namespace: { _eq: $namespace }
          }
        ) {
          username
          namespace
          cl_pubkey
        }
      }`;
    const variables = { namespace: namespaceString };
    const data = await gqlClient.request<{
        gpl_core_0_1_0_decoded_profile: any[];
    }>(query, variables);
    const profile = data.gpl_core_0_1_0_decoded_profile[0];

    if (profile?.username && profile?.namespace && profile?.cl_pubkey) {
        const { cl_pubkey: profilePDAstr } = profile;
        return new anchor.web3.PublicKey(profilePDAstr);
    }

    return null;
}
