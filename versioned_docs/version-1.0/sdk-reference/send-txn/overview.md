---
sidebar_position: 1
---

# Overview

> Biconomy smart accounts are smart contract wallets that can batch the transactions and have different fee mechanism.

Just like [ethers.js](https://docs.ethers.io/v5/) or web3.js needs a Transaction Request (for destination contract and action on this smart contract) , Biconomy SDK allows to input single transaction or array of transactions from a Dapp developer.

Relayer then triggers this above transaction / batch on user's Smart Account to interact with multiple contracts in one-click (just a signature!)

**Fee Mechanism**

1. **Gasless (Account Abstraction Paymasters)**
2. **Make your user pay the fees ( in tokens help by the wallet)**
