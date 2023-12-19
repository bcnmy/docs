---
sidebar_position: 5
---

# Sending a Batch of Transactions

> One Click Batching With Atomicity

With batching functionality, you can send multiple user actions in a single native transaction on Smart Account.

In this example, the user approves `amount` of USDC to the Hyphen Liquidity Pool. Then user adds liquidity to the pool by calling the `addTokenLiquidity` function that transfers part of the approved USDC from the user's Smart Account to itself.

`USDCAddress.approve` and `hyphenLiquidityPoolAddress.addTokenLiquidity` methods calls are batched together and executed as a single on-chain transaction.

In order to create a batch of transactions, just create a Transaction Request array and push individual transaction requests (destination contract and encoded data for method to be called) to it.

```js
// Init Smart account instance

const usdcAddress = <USDC TOKEN>
const hyphenLiquidityPoolAddress = <LP_ADDRESS> // spender

// create an array of txs
const txs = []

const erc20Interface = new ethers.utils.Interface([
  'function approve(address _to, uint256 _value)'
])

// Encode an ERC-20 token approval. User approves the amount of tokens to the Hyphen LP
const data = erc20Interface.encodeFunctionData(
  'approve', [hyphenLiquidityPoolAddress, amount]
)

const tx1 = {
  to: usdcAddress
  data: data
}

txs.push(tx1)

const hyphenLPTx =
    await hyphenContract.populateTransaction.addTokenLiquidity(
      usdcAddress,
      ethers.BigNumber.from("1000000") // providing liquidity for 1 USDC
  );

const tx2 = {
  to: hyphenLiquidityPoolAddress,
  data: hyphenLPTx.data,
};

txs.push(tx2);

// Fee Abstraction and Dispatching

// 1. Gasless
const txResponse = await smartAccount.sendTransactionBatch({ transactions: txs });
console.log('userOp Hash', txResponse);
const txReciept = await txResponse.wait();
console.log('Tx hash', txReciept.transactionHash);

// 2. User Self Refund (Native / ERC20)
const feeQuotes = await smartAccount.getFeeQuotesForBatch({
  transactions: txs,
});

// Choose a fee quote of your choice provided by the relayer
const transaction = await smartAccount.createUserPaidTransactionBatch({
  transactions: txnArray,
  feeQuote: feeQuotes[1],
});

// optional
let gasLimit: GasLimit = {
  hex: "0x1E8480",
  type: "hex",
};

// send transaction internally calls signTransaction and sends it to connected relayer
const txHash = await smartAccount.sendUserPaidTransaction({
  tx: transaction,
  gasLimit,
});
```

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
