import {graphql} from "@reef-chain/util-lib";
import { firstValueFrom } from "rxjs";

export const nftTxAbi = [
    {
      "name": "safeTransferFrom",
      "type": "function",
      "inputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "amount",
          "type": "uint256"
        },
        {
          "name": "data",
          "type": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    }
]

export const fetchNFTinfo = (
    httpClient: any,
    nftId: string,
    ownerAddress: string,
  ): Promise<any> => {
    const query = {
        query: FETCH_NFT_INFO,
        variables: {nftId, ownerAddress}
      }
    return firstValueFrom(graphql.queryGql$(
                        httpClient, query))
    .then((verContracts: any)=> {
        const vContract = verContracts.data.tokenHolders[0];
        if (!vContract) return null;

        const nftInfo: any = {
         contractAddress:vContract.token.contract.id,
        } as any;
        return nftInfo;
    })};

const FETCH_NFT_INFO = `
query FETCH_NFT_INFO($nftId: BigInt!,$ownerAddress: String!) {
    tokenHolders(where: {nftId_eq: $nftId , AND: { id_contains:$ownerAddress }}, limit: 1) {
        token {
          contract {
            id
          }
        }
      }
  }  
`