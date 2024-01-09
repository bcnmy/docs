---
sidebar_label: "Aarc"
sidebar_position: 4
---

# Aarc x Biconomy Documentation

## Introduction

The Aarc SDK is a TypeScript library designed to facilitate the transfer of assets from Externally Owned Accounts (EOA) to Biconomy Smart Wallets. It supports various token standards like ERC20 and ERC721 and offers advanced features such as batched transactions, gasless transactions, and the ability to pay gas fees with the transferred asset. The SDK also allows custom contract interactions within the same transaction using permit2(), enabling direct swaps and bridge functionalities.

## Prerequisites

### Dependencies

To use the Aarc SDK, you need to install the following dependencies:

```javascript
npm install ethers@5.7.2 aarc-sdk
```

### API Key

An API key is required to use the Aarc SDK. Obtain your API key by filling out this form, and you will receive it via email.

## Setup and Configuration

### Importing and Initializing the SDK

First, import and initialize the Aarc SDK in your project:

```javascript
import { AarcSDK } from "aarc-sdk";

let aarcSDK = new AarcSDK({
  rpcUrl: rpcUrl,
  chainId: chainId,
  apiKey: "YOUR_API_KEY",
});
```

## Core Functionalities

### Fetching Token Balances

To retrieve the balances of all tokens in an EOA wallet:

```javascript
let balances = await aarcSDK.fetchBalances({
  eoaAddress: string,
  fetchBalancesOnly: true,
  tokenAddress: string[] // Optional: Array of specific token addresses
});
```

### Moving Assets

To transfer tokens from EOA to Biconomy Smart Wallet:

```javascript
let response = await aarcSDK.executeMigration({
  senderSigner: signer, // ethers.signer object
  receiverAddress: 'RECEIVER_WALLET_ADDRESS',
  transferTokenDetails: [
    {
      tokenAddress: TOKEN1_ADDRESS,
      amount: TOKEN1_AMOUNT, // Optional: ethers.BigNumber for ERC20 and native tokens
      tokenIds: string[] // Optional: tokenIds for NFTs
    },
    // ... Additional tokens
  ]
});

// Output format
[
  {
    tokenAddress,
    amount,
    message,
    txHash,
    tokenId
  },
  // ... Additional responses
]
```

### Gasless Asset Transfers

For transferring tokens without incurring gas fees, refer to the [Aarc SDK documentation](https://github.com/aarc-xyz/aarc-sdk).

### Moving Native Tokens and Wallet Deployment

This functionality allows transferring native tokens while deploying a wallet:

```javascript

import { WALLET_TYPE } from "aarc-sdk/dist/utils/AarcTypes";

let deployResponse = await aarcSDK.transferNativeAndDeploy({
  owner: EOA_ADDRESS,
  walletType: WALLET_TYPE.BICONOMY,
  signer: signer, // ethers.signer object
  receiverAddress: RECEIVER_WALLET_ADDRESS,
  amount: BigNumber, // Optional: Amount of native tokens to transfer
  deploymentWalletIndex: 0 // Optional: Index for deploying multiple wallets under the same EOA
});

// Note: If a wallet for the given EOA_ADDRESS and deploymentWalletIndex exists, only the token transfer will occur.
```

## Biconomy Wallet Integration

### Fetching Existing Wallets

Retrieve all Biconomy smart wallets linked to a user's EOA:

```javascript
const biconomySWs = await aarcSDK.getAllBiconomySCWs(owner: string); // owner's eoaAddress
```

### Creating a New Wallet

Generate a counterfactual address for a new Biconomy wallet:

```javascript
const newBiconomySCWAddress = await aarcSDK.generateBiconomySCW(
  signer // wallet owner's ethers.signer object
);
```

### Deploying the Wallet

Deploy a Biconomy wallet:

```javascript
import { WALLET_TYPE } from "aarc-sdk/dist/utils/AarcTypes";

await aarcSDK.deployWallet({
  owner: EOA_ADDRESS,
  walletType: WALLET_TYPE.BICONOMY,
  signer: signer, // ethers.signer object
  deploymentWalletIndex: 0 // Optional: Index for deploying multiple wallets under the same EOA
});
```