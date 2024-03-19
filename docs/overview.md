---
sidebar_position: 1
slug: /
---

# Overview

The Biconomy SDK is an Account Abstraction toolkit that enables the simplest UX on your dApp, wallet, or appchain.
Built on top of [ERC 4337](https://eips.ethereum.org/EIPS/eip-4337), we offer a full-stack solution for tapping into the power of our Smart Accounts Platform, Paymasters, and Bundlers.

<details>
  <summary>Introduction to Account Abstraction</summary>

Account Abstraction aims to enhance user experience by making user accounts more flexible and functional. Instead of using an Externally Owned Account, a Smart Contract that can act as your account, powered by code instead of the Elliptic Curve Digital Signature Algorithm (ECDSA). 

### UserOp
A userOperation or a userOp is a data structure that describes a transaction to be sent on behalf of a user. It is not an actual Blockchain Transaction but has all the necessary fields to become one. These are fields like “sender,” “to,” “calldata,” “nonce,” and more. You can find the userOp structure [here](https://eips.ethereum.org/EIPS/eip-4337#useroperation).

### Entry Point Contract
The [Entry Point contract](https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/core/EntryPoint.sol) is the singleton smart contract, the core of the Account Abstraction Flow. This singleton contract is used as an entry point to execute bundles of userOps. Refer to this [blog series](https://www.biconomy.io/post/decoding-entrypoint-and-useroperation-with-erc-4337-part1) series  for a comprehensive understanding of the Entry Point.

### Smart Account
This smart contract acts as a user wallet where all user assets are stored. You can program it to validate transactions before executing them. Unlike a traditional wallet, the Smart Account cannot initiate a transaction independently and will need a signer to help it do so.

### Bundler
The Bundler collects, bundles, and submits userOps to an EVM network. One can make a JSON RPC call to a bundler client to have a userOp added to an ERC 4337 mempool.

### Paymaster
The Paymaster is a smart contract that acts as a gas tank and is used to sponsor transactions where the dApp or another third party pays the transaction fee on behalf of the user. The userOp contains a field for adding data about a Paymaster and if it should sponsor the userOp when pushed onchain to become a transaction.

Smart account sends a userOp to execute a transaction. Bundlers then watch the mempool for userOps and send them onchain by calling the Entry Point contract.

Now, you have a basic understanding of the ERC 4337 flow for account abstraction.

</details>
## [Smart Accounts Platform](/account)

The Biconomy Smart Account is an ERC 4337-compliant solution that works with any Paymaster and Bundler service. Biconomy Smart Accounts are signer agnostic, which means you can use any authorization package as long as a signer is passed to our SDK during Smart Account creation. Explore different methods for creating Smart Accounts [here](/Account/signers).

### [Modules](/modules)

Smart Accounts are further enhanced by different modules that allow you to execute arbitrary logic before validating a userOp. This allows you, as a developer, to build modules for session keys, multi-chain validation, passkeys, and more.

View the audit reports for smart accounts and Modules [here](audits).

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

**Next:** Checkout the [quickstart](quickstart) guide to start the integration.

