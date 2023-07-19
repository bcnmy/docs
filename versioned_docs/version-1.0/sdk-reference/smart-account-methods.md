---
sidebar_position: 3
---

# Smart Account Methods

After initialising a smart account instance you will gain access to several useful methods. Below are the listed methods you can use.

:::info
**The address of the Smart Account address is counterfactual in nature. This means you can still retrieve the account address before it has been deployed.**\
:::

## Address

```js
let smartAccount = new SmartAccount(walletProvider, options);
smartAccount = await smartAccount.init();

const address = smartAccount.address;
console.log('address', address);
```

This returns a string representing the address of your Smart Account

```js
let smartAccount = new SmartAccount(walletProvider, options);
smartAccount = await smartAccount.init();

const anyEoaAddress = "0x048617BfD445FD1E0AC1b827AA0d00024439fe7a";
const chainId = 137;
const index = 0; // You can generate multiple smartAccount per EOA, index 0 is first/default
const address = await smartAccount.getSmartAccountAddress(anyEoaAddress, chainId, index);
console.log('address', address);
```

You can also generate an array of all Smart Account addresses owned by an EOA, the address at index 0 will be the default address.

## Owner

```js
const ownerEOA = smartAccount.owner
```

This returns a string representing the address of the EOA wallet that owns this smart account. This information is derived from the Web3 Provider passed to the smart account initialization in the previous step.

## Send Transaction

```js
const trxResponse = smartAccount.sendTransaction({ transaction: tx })
```

This method allows you to execute a gasless transaction paid by the paymaster you set up on the [Biconomy Dashboard](https://docs.biconomy.io/guides/biconomy-dashboard). It takes a transaction object as a parameter and returns a promise with the transaction response data.

Here is how you would set up your transaction object:

```js
const myTx = await <contractInstance>.populateTransaction.<contractMethod>()
const tx = {
to: //contract address,
data: myTx.data,
}
```

## Send Transaction Batch

```js
const trxResponse = smartAccount.sendTransactionBatch({ transactions: [tx1, tx2]})
```

This method allows you to execute a batch of gasless transactions paid by the paymaster you set up on the [Biconomy Dashboard](https://docs.biconomy.io/guides/biconomy-dashboard). It takes an object as a parameter with an array of transactions and works similarly to `sendTransaction`.

## Get Fee Quotes

```js
const mytrx = <contractInstance>.populateTransaction.<contractMethod>()

const tx = {
    to: //contract address,
    data: mytrx.data,
}

smartAccount.getFeeQuotes({
    transaction: tx,
})
```

Before executing a User Paid transaction we need some information about the potential gas price of the transaction. This method takes transaction data similar to Send Transaction method and will return a promise that resolves an array of fee quotes that the user can choose.

## Create User Paid Transaction

```js
const transaction = await smartAccount.createUserPaidTransaction({
        transaction: tx,
        feeQuote: quote,
      });
```

After choosing a quote for the gas price this method will create a promise that resolves to transaction data that can be passed to the Send User Paid Transaction method.

## Send User Paid Transaction

```js
smartAccount.sendUserPaidTransaction({
        tx: transaction,
        gasLimit: {
          hex: "0xC3500",
          type: "hex",
        }
      });
```

This method allows you to have the user sponsor their own transaction. It takes an object as a parameter that includes transaction information and a gas limit. 

## Get Account Balances

```js
import {BalancesDto } from '@biconomy/node-client'

import { ChainId } from '@biconomy/core-types'

const balanceParams: BalancesDto =
      {
// if no chainId is supplied, SDK will automatically pick active one that
// is being supplied for initialization
        chainId: ChainId.MAINNET, // chainId of your choice
        eoaAddress: smartAccount.address,
        // If empty string you receive balances of all tokens watched by Indexer
        // you can only whitelist token addresses that are listed in token respostory
        // specified above ^
        tokenAddresses: [], 
      };


const balFromSdk = await smartAccount.getAlltokenBalances(balanceParams);
console.info("getAlltokenBalances", balFromSdk);

const usdBalFromSdk = await smartAccount.getTotalBalanceInUsd(balanceParams);
console.info("getTotalBalanceInUsd", usdBalFromSdk);
```

The two methods here will allow you to read asset balances and their USD values across networks.

For a list of all supported token balances, please take a look at the list in the repository specified below.

https://github.com/bcnmy/token-list/blob/master/biconomy.tokenlist.json

## Deploy Wallet Using Paymaster

```js
const deployTx = smartAccount.deployWalletUsingPaymaster()
```

Using this method, you can choose to have a smart account deployed at any time. Gas fees will be deducted from your associated gas tank on your Pay master. Alternatively, you can allow for the smart account to be deployed when the user does their first transaction. This happens automatically during the first transaction.

## Smart Account is Deployed

```js
smartAccount = await smartAccount.setActiveChain(chainID)
```

This method returns a promise that resolves into the Smart Account Object and allows you to switch the active chain to the specified chain ID passed to the method.

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
