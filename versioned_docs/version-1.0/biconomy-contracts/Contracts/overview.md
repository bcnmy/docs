---
sidebar_position: 1
---
# Overview

Welcome to the Contracts section, where you'll find explanations and deep dives into the core contracts that power Biconomy's Smart Accounts. These contracts are at the heart of the magic that happens under the hood!

All Biconomy Smart Accounts are proxies that delegate calls to a common implementation contract.

The address of the implementation that is used by the proxy is stored in a storage slot with a location that matches the proxy address.

The core contracts related to Smart Accounts are:

1. **BaseSmartAccount.sol:** This abstract contract implements the `IAccount` Interface.

2. **SmartAccountFactory.sol:** This contract is responsible for deploying smart wallets using `CREATE2` and `CREATE`. It has a method to compute the counterfactual address of the Smart Account before deploying.

3. **SmartAccount.sol:** This contract inherits from `BaseSmartAccount.sol` and implements all the required functionality. It supports Account Abstraction (EIP-4337) flow and simple forward flow (Gnosis Safe style).

4. **ModuleManager.sol:** This Gnosis Safe style module manager allows the activation and deactivation of modules and handles the transactions sent by modules.

5. **DefaultCallbackHandler.sol:** This contract manages hooks to react to receiving tokens.