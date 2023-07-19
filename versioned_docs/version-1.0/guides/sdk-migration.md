---
sidebar_position: 8
---

# SDK Migration Guide

> If you were previously using SDK version v1.0.0 and are now switching to v2.0.0, please note the following changes.

## SmartAccount address

Your SmartAccount address from the previous version will change in v2.0.0. This is because we have deployed new, audited contracts as we launch on mainnet. Going forward, your SmartAccount address will remain the same across all SDK versions.

## Method Names

We have updated the method names, to make it more simpler for devs, here we have documented the changes, all the docs code section is updated with the new method names.

- Gasless Transaction
  - sendGaslessTransaction -> sendTransaction
  - sendGaslessTransactionBatch -> sendTransactionBatch
- User Pay in ERC20 tokens
  - prepareRefundTransaction -> getFeeQuotes
  - createRefundTransaction -> createUserPaidTransaction
  - sendTransaction -> sendUserPaidTransaction
  - prepareRefundTransactionBatch -> getFeeQuotesForBatch
  - createRefundTransactionBatch -> createUserPaidTransactionBatch
  - sendTransaction -> sendUserPaidTransaction
