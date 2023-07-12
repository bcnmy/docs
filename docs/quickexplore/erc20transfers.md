---
sidebar_position: 3
---

# Exploring ERC20 Transfers

:::info
You should already have the node cli set up before following this guide. View those instructions [here](setupnodecli.md)
:::

In the previous tutorials we set up our Smart Accounts and created Native Transfers using the Node JS CLI tool, in this tutorial we will use the tool to start exploring ERC20 token transfers. If you would like to view the code that powers this script, you can do so in the source code of the CLI tool in `scripts/erc20Transfer.ts`

This tutorial uses USDC on Polygon Mumbai from this contract Address: 0xdA5289fCAAF71d52a80A254da614a192b693e977. You can swap matic test tokens for USDC via [uniswap](https://app.uniswap.org/#/swap) just connect with your EOA while on the mumbai testnet and swap with this address. At the time of writing this I was able to swap 1 test matic for 75 test USDC tokens. Make sure to fund your smart account with some test USDC. 

## Initiating a transfer

Before executing our first ERC20 transfer, now that we have our smart account address we need to fund it with some test network tokens! Since we are using the Polygon Mumbai network head over to the [Polygon Faucet](https://faucet.polygon.technology/) and paste in your smart account address and get some test tokens! 

```bash
yarn run smartAccount erc20Transfer --to=0x322Af0da66D00be980C7aa006377FCaaEee3BDFD --amount=0.1 --token=0xdA5289fCAAF71d52a80A254da614a192b693e977
```

Please feel free of course to transfer to any wallet of your choice. The `--to` flag in the script will be the recipient of the transfer you decide to make. The `--token` flag will be the contract of the token you want to transfer. In this case we are using the USDC POS contract on Polygon Mumbai. 

Upon succesful transfer you will see several details printed to your terminal which include: the useroperation information, userop hash, and transaction detail information once confirmed.

## Token Paymaster transfers

What if we wanted to skip having to load up on native tokens for gas entirely? Let's execute this same transaction but we will pay gas fees using only our USDC tokens. 

```bash
yarn run smartAccount erc20Transfer --to=0x322Af0da66D00be980C7aa006377FCaaEee3BDFD --amount=0.1 --token=0xdA5289fCAAF71d52a80A254da614a192b693e977 --withTokenPaymaster
```
If you take a look at your token balances on [Polygonscan](https://mumbai.polygonscan.com/) you will notice that no gas was deducted in matic from your account! This unlocks a lot of powerful user experiences for your dApps. 