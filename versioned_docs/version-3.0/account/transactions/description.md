---
sidebar_position: 1
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/tutorials/description.md
---

# Description

In the context of ERC 4337 transactions are called `userOperations` or `userOps` for short. The Biconomy SDK abstracts away the process of creating `userOps` with various methods that will build and send the `userOps` for you to our bundler service. The `userOp` when constructed by the Biconomy SDK will be similar to the object below:

```json
{
  "sender": "0x0000000000000000000000000000000000000000",
  "nonce": "0x",
  "initCode": "0x",
  "callData": "0x",
  "signature": "0x",
  "maxFeePerGas": "0x",
  "maxPriorityFeePerGas": "0x",
  "verificationGasLimit": "0x",
  "callGasLimit": "0x",
  "preVerificationGas": "0x",
  "paymasterAndData": "0x"
}
```

The following sections will show you how to build `userOps` and execute transactions in four different ways.
