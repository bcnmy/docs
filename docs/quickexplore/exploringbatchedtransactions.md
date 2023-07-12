---
sidebar_position: 5
---

# Exploring Batched Transactions

:::info
You should already have the node cli set up before following this guide. View those instructions [here](setupnodecli.md)
:::

In the previous tutorials we set up our Smart Accounts, created Native Transfers, transfered ER20 tokens, and mintend NFTS using the Node JS CLI tool, in this tutorial we will use the tool to start exploring batching transactions with batch minting . If you would like to view the code that powers this script, you can do so in the source code of the CLI tool in `scripts/batchMintNft.ts`.

Before executing our first batch NFT Mint, now that we have our smart account address we need to fund it with some test network tokens! Since we are using the Polygon Mumbai network head over to the [Polygon Faucet](https://faucet.polygon.technology/) and paste in your smart account address and get some test tokens! 

Let's run the following command: 

```bash
yarn run smartAccount batchMint
```
Upon succesful mint you will see several details printed to your terminal which include: the useroperation information, userop hash, and transaction detail information once confirmed.This mints two NFTs for you in one transaction. You can mix and match different types of transactions for seamless 1 click experiences with this feature. 

## Token Paymaster Mint

Now let's have the gas for the NFT mint be paid in an ERC20 token instead of the native Matic token. 

```bash
yarn run smartAccount batchMint --withTokenPaymaster
```

Now you can have the user choose to pay gas in a set number of ERC20 tokens. This is one option for how to sponsor gas payments using paymasters. Our paymasters also support allowing you to do completely gasless transactions, start diving into our docs further to learn more about how to unlock these powerful user experiences for your dApps. 