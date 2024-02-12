---
sidebar_label: "User Paid Transactions"
sidebar_position: 4
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/tutorials/userpaid.md
---

# User Paid Transactions

In this guide we will look at executing a user paid transaction.

:::info
This guide assumes you have already initialized the Biconomy SDK and just need to understand how to execute a user paid transaction. See our [tutorials](/tutorials) for step by step setups.
:::

## Imports

These are the imports needed for the code snippets below:

```javascript
import { ethers } from "ethers";
import abi from "some abi location";
```

Additionally an Instance of the BiconomySmartAccount is needed as mentioned above.

## Connect to Contract

Connect to an instance of a contract, below is an example of using ethers JS to connect to an NFT contract.

```javascript
const nftAddress = "0x0a7755bDfb86109D9D403005741b415765EAf1Bc";

const contract = new ethers.Contract(nftAddress, abi, provider);
```

## Build Useroperation

Using an instance of the smart account use the buildUserOp method to create a userOp.

```javascript
// use the ethers populateTransaction method to create a raw transaction
const minTx = await contract.populateTransaction.safeMint(address);
console.log(minTx.data);
const tx1 = {
  to: nftAddress,
  data: minTx.data,
};
let userOp = await smartAccount.buildUserOp([tx1]);
```

## Send UserOperation

Send your userOp to our Bundler which will send the userOp to the entry point contract to handle executing it as a transaction on chain.

```javascript
const userOpResponse = await smartAccount.sendUserOp(userOp);
console.log("userOpHash", userOpResponse);
const { receipt } = await userOpResponse.wait(1);
console.log("txHash", receipt.transactionHash);
```

## Mint NFT Function

Here is a function putting all of this together:

```javascript

const mintNFT = () => {

const nftAddress = "0x0a7755bDfb86109D9D403005741b415765EAf1Bc"

const contract = new ethers.Contract(
      nftAddress,
      abi,
      provider,
    )

const minTx = await contract.populateTransaction.safeMint(address);
  console.log(minTx.data);
  const tx1 = {
    to: nftAddress,
    data: minTx.data,
  };
  let userOp = await smartAccount.buildUserOp([tx1]);
}

const userOpResponse = await smartAccount.sendUserOp(userOp);
console.log("userOpHash", userOpResponse);
const { receipt } = await userOpResponse.wait(1);
console.log("txHash", receipt.transactionHash);

```
