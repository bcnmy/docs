---
sidebar_position: 1
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/Bundler/description.md
---

# Description

The Bundler is a service that tracks userOps that exist in an alternative mem pool and as the name suggests, bundles them together to send to an Entry Point Contract for eventual execution onchain. This is the final piece of the flow where after constructing your userOp and then potentially signing it with data from a paymaster, you send the userOp on chain to be handled and executed as a transaction on the EVM. You can start using our Bundlers right now in your dApps; each of our [tutorials](/category/tutorials) will walk you through how to use them in different scenarios.

In short the Bundler is responsible for the following:

- Aggregating userOps in an alternative mempool to normal Ethereum Transactions
- Submitting to the Network: Bundlers EOA will send the userOp to the Entry Point Contract as a transaction

In the context of the Biconomy solution you can access our Bundler infrastrucure either through the packages of our SDK or via API requests. This section will cover both approaches in detail.
