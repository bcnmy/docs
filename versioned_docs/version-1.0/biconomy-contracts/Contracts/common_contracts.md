---
sidebar_position: 5
---

# Common Contracts

Smart contracts that extend Smart Account functionality

**_Module Manager_**

(https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-contract-wallet/base/ModuleManager.sol)

Module Manager allows to enable and disable modules.
Module Manager is also in charge of executing transactions coming from Modules on behalf of the Smart Account.

#### What are modules?

Modules add additional functionalities to the Smart Accounts. They are smart contracts that implement the Smart Account’s functionality while separating module logic from the core contract. Depending on the use case, modules could for instance allow the execution of transactions without requiring a signature confirmation.

Modules can allow for Multisig access control, alternative signing schemes, such as passkeys, Social recovery, etc.

**_FallbackManager_**

(https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-contract-wallet/base/FallbackManager.sol)

A contract that manages fallback calls made to the Smart Account

Fallback calls are handled by a `handler` contract that is stored at `FALLBACK_HANDLER_STORAGE_SLOT.`

Fallback calls are not delegated to the `handler` so they can not directly change Smart Account storage.
