---
sidebar_position: 7
---

# Helpers
Set of helper contracts used by the Smart Account

***Multisend***

**MultiSend.sol**

Allows to batch multiple transactions into one and reverts all if one fails. Relayer -> Smart Wallet - > MultiSend -> Dapp contract / contracts

(https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-contract-wallet/libs/MultiSend.sol)

**MultiSendCallOnly.sol**

MultiSend functionality but reverts if a transaction tries to do `delegatecall`.

(https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-contract-wallet/libs/MultiSendCallOnly.sol)

***Executor***

Executor.sol contract is a helper contract that is used by a [Module Manager](https://www.notion.so/Biconomy-Contracts-only-for-docs-purpose-138e3e989ecc42619a532f2045a89b48?pvs=21). It makes `calls` and `delegatecalls` to Dapp contracts on behalf of Smart Account Modules.

(https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-contract-wallet/base/Executor.sol)

***SecuredTokenTransfer***

A Secured Token Transfer contract is used to transfer ERC20 tokens from Smart Account to the Refund Receiver whenever the user pays gas from their assets.

(https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-contract-wallet/common/SecuredTokenTransfer.sol)