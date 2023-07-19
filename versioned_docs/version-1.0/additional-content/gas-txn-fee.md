---
sidebar_position: 3
---

# Gas & Transaction Fees

Using the smart contract wallet, transaction fees can be abstracted away from users. This allows users to pay the transaction fees in multiple currencies or even have their fees paid by a third party like the dApp itself. In addition, users don't have to worry about gas limits or gas price since our relayer system automatically retries transactions to ensure prompt execution.

## Transaction Fee Payment Options

Currently, users can pay their gas fees with the following currencies:

- ETH / MATIC / BNB (native tokens of a particular chain)
- USDT
- USDC
- DAI

Users are shown a fixed fee at the time of transaction confirmation, which is used to reimburse the relayers that will execute the transaction. This fee will not increase even if the transaction is repriced by the relayer. This is a cost the relayers will bear and hence will optimize for.

> The following Endpoint can be consumed to fetch gas fees for different currencies and for different networks
>
> https://sdk-relayer.prod.biconomy.io/api/v1/relay/feeOptions?chainId=5

Later, the option of paying gas in your project's eco-system token will be available.

## How to Pay Transaction Fees for Your Users

It is possible for third parties to [sponsor the transaction fees](https://docs.biconomy.io/build-with-biconomy-sdk/gasless-transactions) of their users in a non-custodial way. You can do this using a paymaster.
