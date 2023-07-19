---
sidebar_position: 2
---

# Smart Contract Wallets

A smart contract wallet is an Ethereum wallet managed by a smart contract instead of a private key. In this paradigm, the object holding your tokens (the account) is decoupled from the object authorized to move these tokens (the signer).

Ethereum platform supports two types of accounts:

- Externally owned accounts (EOAs) like Metamask, which can be accessed using a private key or seed phrase with just limited functionality.
- Smart Contract Accounts require a smart contract with a deployed arbitrary logic for providing functionalities like multi-sig transactions, daily transfer limit, emergency account freezing, and secure account recovery.

The recent standardized proposal [EIP-4337 for Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337) presents the standard for creating smart contract wallets. This simplifies the creation and operations of SCWs on Ethereum, and offers a rich user chainless experience. The smart contract wallets created by using Biconomy's SDK are compliant with this EIP. Thus, with account abstraction and SCWs coming together, users will be able to pay gas fees in ERC-20 Tokens and accept meta transactions.

SCWs can enable the following features:

- Allowing Multi-signature authorization - More than one user to approve the transaction for improved security.
- Setting daily transaction amount limit -  Setting up a transaction amount limit for reducing the chances of the occurrence of expensive user transaction errors or manipulation done by hackers.
- Batching transactions - Batched transactions allow users of the wallet to perform multiple transactions in one single on-chain transaction

Most Ethereum wallets manage EOA accounts and, therefore, have limited functionality. Smart wallets, however, take advantage of Contract Account functionality—they manage funds via coded instructions that establish who can access them, under what conditions, and more.

Thanks to the versatility of smart contracts, in addition to breaking user reliance on private keys, smart wallets offer advantageous new features and provide a seamless user experience similar to traditional Web2 apps.
