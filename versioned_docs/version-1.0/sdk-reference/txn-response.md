---
sidebar_position: 6
---

# Transaction Response

```js
const myTx = await <contractInstance>.populateTransaction.<contractMethod>()
const tx = {
to: //contract address,
data: myTx.data,
}

const trxResponse = smartAccount.sendTransaction({ transaction: tx })
```

You will get a transaction response object when sending single or batched transactions. Below are the methods available from this object.

### Wait

```js
const txHash = await txResponse.wait();
```

This method returns a promise which resolves to a transaction hash once the transaction has completed on the associated chain.
