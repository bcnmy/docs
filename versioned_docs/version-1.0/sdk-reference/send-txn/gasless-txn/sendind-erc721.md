---
sidebar_position: 3
---

# Sending ERC-721 (NFT) Tokens

Create a transaction on a smart account that transfers a single ERC-721 token similar to sending an ERC20 token.

Once you have the [Smart Account instance initialized](../../initialize-smart-account) with the appropriate config, check the code below.

```js
const erc721Interface = new ethers.utils.Interface([
  "function safeTransferFrom(address _from, address _to, uint256 _tokenId)",
]);

// Encode an ERC-721 token transfer to recipient of the specified amount
const address = await smartAccount.address;
const data = erc721Interface.encodeFunctionData("safeTransferFrom", [
  address,
  recipientAddress,
  tokenId,
]);

const tx = {
  to: nftAddress,
  data,
};

// Transaction events subscription
smartAccount.on("txHashGenerated", (response) => {
  console.log("txHashGenerated event received via emitter", response);
});
smartAccount.on("txMined", (response) => {
  console.log("txMined event received via emitter", response);
});
smartAccount.on("error", (response) => {
  console.log("error event received via emitter", JSON.stringify(response));
});
// Sending transaction
const txResponse = await smartAccount.sendTransaction({ transaction: tx });
console.log("UserOp Hash", txResponse);
const txReciept = await txResponse.wait();
console.log("Tx hash", txReciept.transactionHash);
```

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
