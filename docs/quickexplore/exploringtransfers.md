---
sidebar_position: 2
---

# Exploring Native Transfers

:::info
You should already have the node CLI set up before following this guide. View those instructions [here](setupnodecli.md)
:::

In the previous tutorial we set up our Smart Accounts using the Node JS CLI tool, in this tutorial we will use the tool to start exploring how transfers will look. If you would like to view the code that powers this script, you can do so in the source code of the CLI tool in `scripts/erc20/nativeTransfer.ts` and `scripts/gasless/nativeTransfer.ts`

## Native Transfers

If you would like to learn how to build out a script for a Native transfer yourself our [quickstart guide](quickstart.md) has you covered.

Before executing our first Native transfer, now that we have our smart account address we need to fund it with some test network tokens! Since we are using the Polygon Mumbai network head over to the [Polygon Faucet](https://faucet.polygon.technology/) and paste in your **smart account address** and get some test tokens! 

With the smart account funded let's run the script below:

```bash
yarn run smartAccount transfer --to=0x322Af0da66D00be980C7aa006377FCaaEee3BDFD --amount=0.001
```
Please feel free of course to transfer to any wallet of your choice. The `--to` flag in the script will be the recipient of the transfer you decide to make. 

Upon successful transfer you will see several details printed to your terminal which include: the userOp information, userOp hash, and transaction detail information once confirmed.

## Token Paymaster transfers

Biconomy Paymasters support gas payments in ERC20 tokens. Let's do the same transfer but this time we can pay for gas using an ERC20 token. 

```bash
yarn run smartAccount transfer --to=0x322Af0da66D00be980C7aa006377FCaaEee3BDFD --amount=0.001 --withTokenPaymaster
```

With the addition of the `--withTokenPaymaster` flag we will now see a list of fee quotes for paying for the gas in the following tokens: USDT, USDC, DAI, and SAND. You will of course need to make sure your smart account is funded with test tokens for any one of these. 
