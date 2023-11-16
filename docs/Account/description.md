---
sidebar_position: 1
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/Account/description.md
---
# Description

## What is a Smart Account?

In the context ERC 4337 a smart account is a smart contract account used to manage assets and create `userOperations` or `userOps`. These are pseudo-transaction objects that eventually execute as a transaction on the EVM. They replace traditional Externally Owned Accounts(Wallets).

## The Biconomy Smart Account

The Biconomy Smart Account is an ERC 4337-compliant solution that works with any Paymaster and Bundler service.

The Biconomy Smart Accounts are signer agnostic, which allows you to use any authorization package of your choice as long as you can pass a signer to our SDK upon the creation of a Smart Account. Check out different ways you can create a Biconomy Smart Account [here](/category/signers).


Smart Accounts are further enhanced by validation modules that allow you to execute arbitrary logic before validating a userOp. This allows you, as a developer, to build modules that allow for session keys, multi-chain validation modules, pass keys, and more. Learn more about Modules [here](/category/modules)
