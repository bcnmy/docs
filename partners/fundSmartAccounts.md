---
sidebar_label: "Fund Smart Accounts"
sidebar_position: 4
---

# Aarc - Fund Migration SDK

## Introduction

The Aarc SDK is a TypeScript library designed to facilitate the transfer of assets from Externally Owned Accounts (EOA) to Biconomy Smart Wallets. It supports various token standards like ERC20 and ERC721 and offers advanced features such as batched transactions, gasless transactions, and the ability to pay gas fees with the transferred asset. The SDK also allows custom contract interactions within the same transaction using permit2(), enabling direct swaps and bridge functionalities.

:::tip

Check out an end-to-end integration of AARC on this [example repo](https://github.com/bcnmy/biconomy_aarc_example)!

:::

## Prerequisites

### Dependencies

To use the Aarc SDK, you need to install the following dependencies:

```javascript
npm install @aarc-xyz/migrator ethers@5.7.2
```

### API Key

Get the Aarc API Key (you can learn how to get it from [here](https://docs.aarc.xyz/developer-docs/getting-started/quick-start-guide/get-the-api-key)), your EOA private key and the RPC URL.

## Setup and Configuration

### Importing and Initializing the SDK

First, import and initialize the Aarc SDK in your project:

```javascript
import { ethers, BigNumber } from "ethers";
import { Migrator, WALLET_TYPE } from "@aarc-xyz/migrator";

let provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_URL");
let signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
let eoaAddress = signer.address;

let aarcSDK = new Migrator({
  rpcUrl: "YOUR_RPC_URL",
  chainId: 80002,
  apiKey: "YOUR_AARC_API_KEY",
});
```

### Fetching Smart Accounts

To retrieve the smart account addresses of the associated EOA.

```javascript
async function main() {
  try {
    const smartWalletAddresses = await aarcSDK.getSmartWalletAddresses(
      WALLET_TYPE.BICONOMY, // WALLET_TYPE imported from @aarc-xyz/migrator
      eoaAddress
    );
    console.log(" smartWalletAddresses ", smartWalletAddresses);
  } catch (error) {
    console.error(" error ", error);
  }
}
```

Here, we provide the WALLET_TYPE.BICONOMY to fetch the Smart Account addresses associated with the EOA.
In the response, we will see the addresses associated with the EOA for Biconomy's Smart Accounts. No Smart Account may be deployed so it will only generate and return the Smart Account address, mentioning its deployment status and the walletIndex.

### Deploy the Smart Account

To deploy the smart account, use aarcSDK.transferNativeAndDeploy this will take a few parameters, as shown below.

:::info

- **deploymentWalletIndex** and **receiver** can be fetched from the above response.
- **amount** should be in hex string, which can be easily done by usingBigNumbers from ethers.
  :::

```javascript
async function main() {
  // ... Previous Code ...
  try {
    const response = await aarcSDK.transferNativeAndDeploy({
      walletType: WALLET_TYPE.BICONOMY,
      owner: eoaAddress,
      receiver: "0xcba2d1f7522757f4f1b2e1f7ce54612c61fbd366",
      signer: signer,
      deploymentWalletIndex: 0,
      amount: BigNumber.from("10000")._hex,
    });
    console.log("Transfer and Deploy Response: ", response);
  } catch (error) {
    console.error(" error ", error);
  }
}
```

Go through the [AARC SDK Documentation](https://docs.aarc.xyz/) for more functionalities and integration details.
