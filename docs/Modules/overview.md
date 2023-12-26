---
sidebar_position: 1
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/Modules/overview.md
---
# Overview

A modular approach to smart contract accounts increases flexibility for deploying and managing contracts. Unlike "static" accounts, which can only be modified by a developer and require redeployment, Modular accounts are smart accounts that users can easily and securely extend on their own.

Biconomy MSCA (Modular smart contract account) has two types of modules:
- **Validation modules** - These modules define different signature schemes or authorisation mechanisms to validate who is allowed to perform what action on the account, by implementing standard interfaces.
- **Execution modules** - These modules define custom execution functions to facilitate the actions allowed by the account.

Many new features of accounts can be built by customizing the logic that goes into the validation and execution steps. ERC-6900 extends the objectives of ERC 4337, specifically the goal of abstracting logic for execution and validation for each smart contract wallet. It also enables developers to standardise these modules, in order to integrate new features for smart contract wallets, rather than building an entire account.

**How to enable modules**

Biconomy MSCA doesn’t store ownership information in its own storage and has no default algorithm for validating signatures. Hence, to ensure every account is able to validate userOps,  Biconomy [SmartAccountFactory](https://github.com/bcnmy/scw-contracts/blob/main/contracts/smart-account/factory/SmartAccountFactory.sol#L73) requires a module to use as primary enabled module. 

In addition to enabling the module, It also mandates the **moduleSetupData** to setup the module by the smart account during initialisation. It only stores a reference to the module address, thus making it possible for multiple modules to use the same function selector.

Each account must have a default validation module which gets used when no is enabled. All validation modules can act as active validation modules, but the ones with following functionality can act as default validattion module.

## Validation Modules
![validationModule.png](../images/modules/validationModule.png)

Validation Module is a module that extends abstract contract **BaseAuthorizationModule** - which implements **IBaseAuthorizationModule** interface. This interface requires the implementation of the following methods:

- `validateUserOp`: this method validates userOperation. It expects userOp callData to execute method calls of the Smart account and userOp signature being the ABI-encoded signature and module address.
- `isValidSignature`: this method validates an EIP-1271 signature.
- `isValidSignatureUnsafe`: this method validates an EIP-1271 signature but expects the data Hash to already include smart account address information.

Validation modules are invoked with a “call”. It has it’s own storage and doesn’t share storage with Biconomy Smart Account. Since validation module storage is accessed during the validation phase, ERC-4337 [storage rules](https://github.com/eth-infinitism/account-abstraction/blob/abff2aca61a8f0934e533d0d352978055fddbd96/eip/EIPS/eip-4337.md#storage-associated-with-an-address) apply to this.

Following is the list of Validation Modules:

- [**ECDSA Ownership Module**](ecdsa.mdx): This module is widely adopted as a validation module for Biconomy smart accounts. It seamlessly integrates with MPC providers such as Web3Auth, abstracting EOA Private Key storage and enabling a web2-like experience for eg. email login.
- [**Multichain ECDSA Validator Module**](multichain.mdx): This module significantly improves UX for deploying and setting up Smart Accounts on several chains. It is an extension of ECDSA Module enabling used to dispatch multiple userOps on different chains using a single signature.
- [**Session key Manager Validation Module**](sessionvalidationmodule.mdx): This module enables the use of sessions to execute  transactions. It verifies whether a given user operation adheres to the permissions defined within the session key and confirms that the operation has been signed by that session key. This can only be used as an active validation module.
- **MultiOwnedECDSAModule**: This is alteration of ECDSA Module which allows multiple signers to be set up, and any one of n enabled owners can authorise a transaction using ECDSA signature. 

**How to create custom Validation Module**

Developers have the flexibility to create a custom validation module implementation according to their specific requirements. This validation module class should extend the BaseValidationModule, which implements the IValidationModule interface. After thorough testing and auditing, a pull request (PR) can be submitted to integrate the module with the SDK. A detailed walkthru of the same is linked [here](/tutorials/customValidationModule).

## Execution Modules

**Execution functions** execute any custom logic allowed by the account.

There are two default execution functions - called execute and executeBatch which allow for open-ended execution that is required for AA-flow. Custom execution module needs to call back into Smart Account to initialize a function call from within the context of the account. 
Diagram below illustrates the execution flow for Modular Smart Accounts.

![executionModule.png](../images/modules/executionModule.png)
