---
sidebar_position: 1
---
# Description

The Bundler is a service that tracks userOps that exist in an alternative mem pool and as the name suggests, bundles them together to send to an Entry Point Contract for eventual execution onchain. This is the final piece of the flow where after constructing your userOp and then potentially signing it with data from a paymaster, you send the userOp on chain to be handled and executed as a transaction on the EVM. You can start using our Bundlers right now in your dApps; each of our [tutorials](/docs/category/tutorials) will walk you through how to use them in different scenarios.