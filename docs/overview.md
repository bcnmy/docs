---
sidebar_position: 1
slug: /
---

# Overview

The Biconomy SDK is an Account Abstraction toolkit that enables the simplest UX on your dApp, wallet, or appchain.
Built on top of [ERC 4337](https://eips.ethereum.org/EIPS/eip-4337), we offer a full-stack solution for tapping into the power of our Smart Accounts Platform, Paymasters, and Bundlers.

## [Smart Accounts Platform](/account)

The Biconomy Smart Account is an ERC 4337-compliant solution that works with any Paymaster and Bundler service. Smart Accounts are governed by code, allowing other types of signature algorithms to be used with the Smart Account.

Biconomy Smart Accounts are signer agnostic, which means you can use any authorization package as long as a signer is passed to our SDK during Smart Account creation. Explore different methods for creating Smart Accounts [here](/Account/signers).

### [Modules](/modules)

Smart Accounts are further enhanced by validation modules that allow you to execute arbitrary logic before validating a userOp. This allows you, as a developer, to build modules that allow for session keys, multi-chain validation, passkeys, and other modules.

If you want to start diving into Smart Accounts you can do so [here](/account). If you already understand Smart Accounts and prefer to start working with modules, start learning about them [here](/modules) or follow this step-by-step [tutorial](/tutorials/sessionkeys) on how to build a dApp that utilizes session key modules.

![FullStakAA](./images/overview/fullstackaa.png)

## [Bundler](/bundler)

The Bundler is a service that tracks userOps that exist in an alternative mem pool and as the name suggests, bundles them together to send to an Entry Point Contract for eventual execution onchain.

This is the final piece of the flow where after constructing your userOp and then potentially signing it with data from a paymaster, you send the userOp on chain to be handled and executed as a transaction on the EVM. You can start using our Bundlers right now in your dApps. Each of our [tutorials](/tutorials) will walk you through how to use them in different scenarios.

View the list of supported networks by Biconomy bundler [here](/Bundler/supportedNetworks).

If you are looking to integrate account abstraction using APIs, checkout the [bundler APIs](/Bundler/api) and [tutorials](/tutorials/apiIntegration/).

## [Paymaster](paymaster)

Biconomy's paymaster service enables Dapps to either sponsor transactions or accept ERC-20 tokens as payment for gas. Login to the [Biconomy dashboard](/dashboard) to get the paymaster URL and switch modes between our sponsorship and token Paymaster. Make use of different [Spending limits](/dashboard/spendingLimits) to customize the paymaster usage.

### Sponsorship Paymaster

Enabling the Sponsored mode facilitates gasless transactions, eliminating the necessity for users to have native tokens to cover gas fees. Learn how to set up your paymaster [here](/dashboard/paymaster).

### Token Paymaster

Switching your Paymaster mode to ERC20 enables users to pay gas fees with ERC20 tokens across networks See the latest supported networks tokens [here](/Paymaster/supportedNetworks).

Learn how to utilize either of these Paymasters by checking out our How To Guide on [Executing transactions](/tutorials)

