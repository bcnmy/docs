---
sidebar_position: 2
---

# Sending ERC-20 Tokens

One can create a gasless transaction that transfers the amount of the ERC-20 token from a Smart Account.

Once you have the [Smart Account instance initialized](../../initialize-smart-account) with the appropriate config, check the code below.

```js
const erc20Interface = new ethers.utils.Interface([
  'function transfer(address _to, uint256 _value)'
])

// Encode an ERC-20 token transfer to the recipient of the specified amount
const data = erc20Interface.encodeFunctionData(
  'transfer', [recipientAddress, amount]
)

const tx1 = {
  to: usdcAddress,
  data
}

// Transaction subscription
smartAccount.on('txHashGenerated', (response: any) => {
  console.log('txHashGenerated event received via emitter', response);
  showSuccessMessage(`Transaction sent: ${response.hash}`);
});
smartAccount.on('txMined', (response: any) => {
  console.log('txMined event received via emitter', response);
  showSuccessMessage(`Transaction mined: ${response.hash}`);
});
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

With batching functionality, you can send multiple token transfers in a single transaction


```js
const erc20Interface = new ethers.utils.Interface([
  'function transfer(address _to, uint256 _value)'
])

// Encode two different ERC-20 token transfers
const data1 = erc20Interface.encodeFunctionData(
  'transfer', [recipient1Address, amount1]
)
const data2 = erc20Interface.encodeFunctionData(
  'transfer', [recipient2Address, amount2]
)

const txs = []

const tx1 = {
  to: usdcAddress,
  data: data1
}

txs.push(tx1)

const tx2 = {
  to: usdcAddress,
  data: data2
}

txs.push(tx2)

// Transaction subscription
smartAccount.on('txHashGenerated', (response: any) => {
  console.log('txHashGenerated event received via emitter', response);
  showSuccessMessage(`Transaction sent: ${response.hash}`);
});
smartAccount.on('txMined', (response: any) => {
  console.log('txMined event received via emitter', response);
  showSuccessMessage(`Transaction mined: ${response.hash}`);
});
smartAccount.on('error', (response: any) => {
  console.log('error event received via emitter', response);
});


// Sending transaction
const txResponse = await smartAccount.sendTransactionBatch({ transactions: txs });
console.log('UserOp Hash', txResponse);
const txReciept = await txResponse.wait();
console.log('Tx hash', txReciept.transactionHash);
```

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
