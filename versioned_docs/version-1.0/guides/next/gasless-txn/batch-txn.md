---
sidebar_position: 3
---

# Gasless Batched Transaction

One needs to prepare the transaction data. Here we will be transferring ERC 20 tokens from the Smart Contract Wallet to an address

```js
const erc20Interface = new ethers.utils.Interface(ERC_20_ABI)

// Encode an ERC-20 token approval to spenderAddress of the specified amount
const approvalEncodedData = erc20Interface.encodeFunctionData(
  'approve', [spenderAddress, amount]
)

// Encode an ERC-20 token transferFrom from an address of the specified amount
const transferFromEncodedData = erc20Interface.encodeFunctionData(
  'transferFrom', [from, receipientAddress, amount]
)

const txs = [];

// You need to create transaction objects of the following interface
const tx1 = {
  to: usdcAddress, // destination smart contract address
  data: approvalEncodedData
}

txs.push(tx1);

const tx2 = {
  to: usdcAddress,
  data: transferFromEncodedData
};

txs.push(tx2);

// Optional: Transaction subscription. One can subscribe to various transaction states
// Event listener that gets triggered once a hash is generetaed
smartAccount.on('txHashGenerated', (response: any) => {
  console.log('txHashGenerated event received via emitter', response);
});
smartAccount.on('onHashChanged', (response: any) => {
  console.log('onHashChanged event received via emitter', response);
});
// Event listener that gets triggered once a transaction is mined
smartAccount.on('txMined', (response: any) => {
  console.log('txMined event received via emitter', response);
});
// Event listener that gets triggered on any error
smartAccount.on('error', (response: any) => {
  console.log('error event received via emitter', response);
});

// Sending gasless transaction
const txResponse = await smartAccount.sendTransactionBatch({ transactions: txs });
console.log('UserOp hash', txResponse.hash);
// If you do not subscribe to listener, one can also get the receipt like shown below 
const txReciept = await txResponse.wait();
console.log('Tx Hash', txReciept.transactionHash);
// DONE! You just sent a batched gasless transaction
```

:::caution
For common errors check [this](https://docs.biconomy.io/references/common-errors).
:::

## Code Examples

- https://github.com/bcnmy/sdk-examples/tree/master/react-biconomy-web3Auth
- https://github.com/bcnmy/sdk-demo
- https://github.com/bcnmy/hyphen-ui/tree/demo-sdk

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
