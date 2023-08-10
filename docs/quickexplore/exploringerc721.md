---
sidebar_position: 4
---

# Exploring ERC721 Minting

:::info
You should already have the node cli set up before following this guide. View those instructions [here](setupnodecli.md)
:::

In the previous tutorials we set up our Smart Accounts, created Native Transfers, and transferred ER20 tokens using the Node JS CLI tool, in this tutorial we will use the tool to start exploring minting NFTs. If you would like to view the code that powers this script, you can do so in the source code of the CLI tool in `scripts/erc20/mintNft.ts` and `scripts/gasless/mintNft.ts`.

## Mint an NFT

Before executing our first NFT Mint, now that we have our smart account address we need to fund it with some test network tokens! Since we are using the Polygon Mumbai network head over to the [Polygon Faucet](https://faucet.polygon.technology/) and paste in your smart account address and get some test tokens! 

Let's run the following command: 

```bash
yarn run smartAccount mint
```
Upon successful mint you will see several details printed to your terminal which include: the useroperation information, userop hash, and transaction detail information once confirmed.

You can view your minted NFTs from your smart contract wallet by heading to this link `https://testnets.opensea.io/"your address here"`

Replace the complete string `"your address here` with your smart account address. 

## Token Paymaster Mint

Now let's have the gas for the NFT mint be paid in an ERC20 token instead of the native Matic token. 

```bash
yarn run smartAccount mint --withTokenPaymaster
```
Now you can have the user choose to pay gas in a set number of ERC20 tokens. This is one option for how to sponsor gas payments using paymasters. Our paymasters also support allowing you to do completely gasless transactions, start diving into our docs further to learn more about how to unlock these powerful user experiences for your dApps. 
