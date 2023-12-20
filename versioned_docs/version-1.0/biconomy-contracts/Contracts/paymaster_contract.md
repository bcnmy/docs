---
sidebar_position: 6
---

# Paymaster Contract

Manages gas payment on behalf of users

A paymaster is a special contract in [Account Abstraction Flow](https://github.com/eth-infinitism/account-abstraction/blob/develop/eip/assets/eip-4337/image2.png) that acts like a Gas tank. **Paymasters** can sponsor transactions for other users.

This feature can be used to allow application developers to subsidize fees for their users, allow users to pay fees with EIP-20 tokens, and many other use cases. When the paymaster is not equal to the zero address, the entry point implements a different [flow](https://github.com/eth-infinitism/account-abstraction/blob/develop/eip/assets/eip-4337/image2.png).

## **_Types of Paymasters_**

**_TokenPaymaster_**

A Token-based paymaster. Each request is paid for by the caller in ERC20 tokens.

**_VerifyingPaymaster_**

Paymaster uses an external service to decide whether to pay for the UserOp. The paymaster trusts an external signer to sign the transaction. The calling user must pass the UserOp to that external signer first, which performs whatever off-chain verification before signing the UserOp.

💡 The wallet owner still signs the user operation.

- the paymaster signs to agree to PAY for GAS.
- the wallet signs to prove identity and wallet ownership.

**_DepositPaymaster_**

A token-based paymaster that accepts token deposits. The deposit is only a safeguard: the user pays with his token balance. A bundler can whitelist this type of Paymaster.

💡 Biconomy currently supports VerifyingPaymaster through Paymasters-As-A-Service Dashboard. This is a Singleton Paymaster which implements the IPaymaster interface and manages gas tank accounting using depositor's paymasterIds.

**_Biconomy Verifying Singleton Paymaster_**

Derives from a Base Abstract Contract called [BasePaymaster](https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-contract-wallet/paymasters/BasePaymaster.sol) which implements the IPaymaster interface mentioned below.

**[scw-contracts/VerifyingSingletonPaymaster.sol at master · bcnmy/scw-contracts**GitHub](https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-contract-wallet/paymasters/verifying/singleton/VerifyingSingletonPaymaster.sol)
