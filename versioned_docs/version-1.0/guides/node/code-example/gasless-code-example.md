---
sidebar_position: 1
---

# Gasless Transactions Code Example

## Send Single Gasless Transaction

```js
const { ethers } = require("ethers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const SmartAccount = require("@biconomy/smart-account").default;
const { ChainId } = require("@biconomy/core-types");

const config = {
  privateKey: "0x0000000000000000000000000000000000000000000000000000000000000000",
  rpcUrl: "https://rpc-mumbai.maticvigil.com",
  dappAPIKey: "",
}

async function main() {
  let provider = new HDWalletProvider(config.privateKey, config.rpcUrl);
  const walletProvider = new ethers.providers.Web3Provider(provider);
  // create SmartAccount instance
  const wallet = new SmartAccount(walletProvider, {
    debug: false,
    activeNetworkId: ChainId.POLYGON_MUMBAI,
    supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
    networkConfig: [
      {
        chainId: ChainId.POLYGON_MUMBAI,
        dappAPIKey: config.dappAPIKey,
      }
    ]
  });
  const smartAccount = await wallet.init();

  // transfer ERC-20 tokens to recipient
  const erc20Interface = new ethers.utils.Interface([
    'function transfer(address _to, uint256 _value)'
  ])
  // Encode an ERC-20 token transfer to recipient of the specified amount
  const recipientAddress = '0x0000000000000000000000000000000000000000'
  const amount = ethers.BigNumber.from("1000000")
  const usdcAddress = '0xdA5289fCAAF71d52a80A254da614a192b693e977'
  const data = erc20Interface.encodeFunctionData(
    'transfer', [recipientAddress, amount]
  )
  const tx = {
    to: usdcAddress,
    data
  }

  // Transaction events subscription
  smartAccount.on('txHashGenerated', (response) => {
    console.log('txHashGenerated event received via emitter', response);
  });
  smartAccount.on('onHashChanged', (response: any) => {
    console.log('onHashChanged event received via emitter', response);
  });
  smartAccount.on('txMined', (response) => {
    console.log('txMined event received via emitter', response);
  });
  smartAccount.on('error', (response) => {
    console.log('error event received via emitter', response);
  });

  // Sending gasless transaction
  const txResponse = await smartAccount.sendTransaction({ transaction: tx });
  console.log('userOp hash', txResponse.hash);
  // If you do not subscribe to listener, one can also get the receipt like shown below
  const txReciept = await txResponse.wait();
  console.log('Tx hash', txReciept.transactionHash);
}

main().catch((error) => {
  console.error(error);
});
```

## Send Batched Gasless Transactions

```js
const { ethers } = require("ethers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const SmartAccount = require("@biconomy/smart-account").default;
const { ChainId } = require("@biconomy/core-types");

const config = {
  privateKey:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  rpcUrl: "https://rpc-mumbai.maticvigil.com",
  dappAPIKey: "",
};

async function main() {
  let provider = new HDWalletProvider(config.privateKey, config.rpcUrl);
  const walletProvider = new ethers.providers.Web3Provider(provider);
  // create SmartAccount instance
  const wallet = new SmartAccount(walletProvider, {
    debug: false,
    activeNetworkId: ChainId.POLYGON_MUMBAI,
    supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
    networkConfig: [
      {
        chainId: ChainId.POLYGON_MUMBAI,
        dappAPIKey: config.dappAPIKey,
      },
    ],
  });
  const smartAccount = await wallet.init();

  // transfer ERC-20 tokens to recipient
  const erc20Interface = new ethers.utils.Interface(ERC_20_ABI);

  // Encode an ERC-20 token approval to spenderAddress of the specified amount
  const approvalEncodedData = erc20Interface.encodeFunctionData("approve", [
    spenderAddress,
    amount,
  ]);
  // Encode an ERC-20 token transferFrom from an address of the specified amount
  const transferFromEncodedData = erc20Interface.encodeFunctionData(
    "transferFrom",
    [from, receipientAddress, amount],
  );

  const txs = [];
  // You need to create transaction objects of the following interface
  const tx1 = {
    to: usdcAddress, // destination smart contract address
    data: approvalEncodedData,
  };
  txs.push(tx1);
  const tx2 = {
    to: usdcAddress,
    data: transferFromEncodedData,
  };
  txs.push(tx2);

  // Transaction events subscription
  smartAccount.on("txHashGenerated", (response) => {
    console.log("txHashGenerated event received via emitter", response);
  });
  smartAccount.on("txMined", (response) => {
    console.log("txMined event received via emitter", response);
  });
  smartAccount.on("error", (response) => {
    console.log("error event received via emitter", response);
  });

  // Sending gasless transaction
  const txResponse = await smartAccount.sendTransactionBatch({
    transactions: txs,
  });
  console.log("UserOp hash", txResponse.hash);
  // If you do not subscribe to listener, one can also get the receipt like shown below
  const txReciept = await txResponse.wait();
  console.log("Tx Hash", txReciept.transactionHash);
  // DONE! You just sent a batched gasless transaction
}

main().catch((error) => {
  console.error(error);
});
```

## Code Examples

- https://github.com/bcnmy/sdk-examples/tree/master/backend-node

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
