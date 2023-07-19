---
sidebar_position: 3
---

# Sending ERC-1155 Tokens

Create a transaction on smart account that transfers single ERC-1155 token similar to sending an ERC20 or ERC721 token.

Once you have the [Smart Account instance initialized](../../initialize-smart-account) with the appropriate config, check the code below.

```js
const erc1155Interface = new ethers.utils.Interface([
  'function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data)'
])

// Encode the transfer of the collectible to recipient
const address = await smartAccount.address;
const data = erc1155Interface.encodeFunctionData(
  'safeTransferFrom', [address, recipientAddress, tokenId, amount, '0x']
)

const tx1 = {
  to: nftAddress,
  data
}

// Transaction events subscription
smartAccount.on('txHashGenerated', (response) => {
  console.log('txHashGenerated event received via emitter', response);
});
smartAccount.on('txMined', (response) => {
  console.log('txMined event received via emitter', response);
});
smartAccount.on('error', (response) => {
  console.log('error event received via emitter', JSON.stringify(response));
});
// Sending transaction
const txResponse = await smartAccount.sendTransaction({ transaction: tx });
console.log('UserOp Hash', txResponse);
const txReciept = await txResponse.wait();
console.log('Tx hash', txReciept.transactionHash);
```

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
