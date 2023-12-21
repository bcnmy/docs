---
sidebar_position: 2
---

# Gasless Single Transaction

Once the Smart Account has been setup and initialised, one can start sending gasless transactions in the following way:

```js

// One needs to prepare the transaction data
// Here we will be transferring ERC 20 tokens from the Smart Contract Wallet to an address
const erc20Interface = new ethers.utils.Interface([
  'function transfer(address _to, uint256 _value)'
])

// Encode an ERC-20 token transfer to recipientAddress of the specified amount
const encodedData = erc20Interface.encodeFunctionData(
  'transfer', [recipientAddress, amount]
)

// You need to create transaction objects of the following interface
const tx = {
  to: usdcAddress, // destination smart contract address
  data: encodedData
}

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
const txResponse = await smartAccount.sendTransaction({ transaction: tx1 });
console.log('userOp hash', txResponse.hash);
// If you do not subscribe to listener, one can also get the receipt like shown below
const txReciept = await txResponse.wait();
console.log('Tx hash', txReciept.transactionHash);

// DONE! You just sent a gasless transaction
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
