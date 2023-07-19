---
sidebar_position: 2
---

# Using Packages

> Biconomy SDK exports several packages which can aid your development.

## Node Client Package

This package is responsible for the communication between the Client SDK and the Backend Node. 

## Installation

```bash
yarn add @biconomy/node-client
```

or

```bash
npm install @biconomy/node-client
```

## Initialization

```js
import NodeClient from "@biconomy/node-client"
const nodeClient = new NodeClient({ txServiceUrl: 'https://sdk-backend.prod.biconomy.io/v1/' })
```

## Get all the supported Chains

```js
const supportedChainList = await nodeClient.getAllSupportedChains()
console.log(supportedChainList)
```

## Get all the supported Token

```js
const supportedTokensList = await nodeClient.getAllTokens()
console.log(supportedTokensList)
```

## Get all the Smart Accounts By Owner

```js
import { SmartAccountByOwnerDto } from "@biconomy/node-client"

const smartAccountByOwnerDto: SmartAccountByOwnerDto {
chainId: 1, // network of your choice
owner: 'abcxxx....' // eoa address from whom you want to know smart wallet address
}

const smartAccountsByOwner = await nodeClient.getSmartAccountsByOwner(smartAccountByOwnerDto)
console.log(smartAccountsByOwner)
```

## Get Smart Account Balances

```js
import { BalancesDto } from '@biconomy/node-client'

import { ChainId } from '@biconomy/core-types'

const balanceParams: BalancesDto =
      {
        // if no chainId is supplied, SDK will automatically pick active one that
        // is being supplied for initialization
        chainId: ChainId.MAINNET, // chainId of your choice
        eoaAddress: smartAccount.address,
        // If empty string you receive balances of all tokens watched by Indexer
        // you can only whitelist token addresses that are listed in token respostory
        // specified above ^
        tokenAddresses: [], 
      };


const balFromSdk = await smartAccount.getAlltokenBalances(balanceParams);
console.info(balFromSdk);

const usdBalFromSdk = await smartAccount.getTotalBalanceInUsd(balanceParams);
console.info(usdBalFromSdk);
```
