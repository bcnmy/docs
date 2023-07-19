---
sidebar_position: 1
---

# Overview

Smart Account instance has been created and initialized.

:::info
Smart account address that SDK spins up are counterfactual in nature and remains the same address on all EVM chains. You can securely transfer funds to this counterfactual address using a transfer from a Centralised exchange or via Fiat on-ramps.  
:::

These smart accounts are only deployed when users initiate a first transaction. Optionally as a Dapp you can just deploy the wallets and sponsor gas for it. Please check the below flows.

## Wallet Deployment flow

:::info
"Wallet deployment only" is supported using only gasless transactions where gas is sponsored via dApps using Paymasters (Gas Tanks). Users do not need to hold any assets to pay fees for this deployment.
:::

Initialize Smart Account with appropriate config as mentioned here in the gasless section.

```js
// Assuming smart account has already been initialised

const tx = await smartAccount.deployWalletUsingPaymaster();
```

:::note
Note: above deploy wallet uses createSenderIfNeeded() from the Entry point which merely calls the Wallet Factory contract for deployment. One can also plug in a local relayer to make this transaction directly on wallet factory.
:::

## Wallet Deployment batched with a transaction

Any gasless or user paid transaction will check whether the wallet is deployed or not. If the wallet is not deployed, the SDK will batch the wallet deployment with the intended transaction/batch transactions. This behaviour is handled within the SDK itself & would require no changes in your code to enable this.

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
