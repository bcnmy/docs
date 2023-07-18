---
sidebar_position: 1
---

# Overview

The Biconomy Modular SDK is a comprehensive software development kit designed specifically for decentralized applications (dApps). Built on top of the ERC4337 solution, it offers a wide range of solutions, from user onboarding to sustained engagement, enhancing the overall user experience within your dApp. By leveraging modularity, the SDK offers enhanced customization, security, and functionality. This SDK operates in a non-custodial manner, providing a unified solution that combines simplicity and functionality in the realm of decentralized applications.


## What’s Possible?

Biconomy SDK brings blockchain-agnostic, web2-like experiences to your dApp in a non-custodial manner. Here's what you can enable today:

- Easy User Onboarding: Simplifies the onboarding process for new users throufh social login, account creation, and recovery options, seamlessly integrating web2 users into your dApp.
- Fiat On Ramp: Allows your users to easily and reliably buy or sell cryptocurrencies within your dApp, facilitating the transition between traditional and blockchain-based assets
- Gasless Transactions: Sponsors gas fees for user interactions, making them as simple as web2 transactions, and improving the overall user experience.
- Paying Gas Fees In ERC20 Tokens: Enable users to utilize any ERC20 asset in their wallet to pay for gas fees, offering flexibility and convenience. 
- Custom Transaction Bundling: Empower developers to build methods for transaction batching, allowing users to execute multiple actions in a single transaction, even across multiple chains. For example, users can approve and deposit in the same transaction without altering anything in the dApp smart contracts.

## How Does It Work?

In the Biconomy SDK, the Smart Contract Wallet (SCW) is the foundation of the system and is created for every new user who joins a dApp. The SCW address is generated instantly when the user logs in, without needing any on-chain deployment. The actual smart contract is deployed along with the user's first transaction.

The Smart Contract Wallet, also known as Smart Account, is associated with the user's Externally Owned Account (EOA), like a traditional MetaMask account or an account generated via Social Login. It provides enhanced security compared to EOAs by allowing users to deposit and withdraw funds securely at any time.

One notable feature is that the SCW address remains consistent across different blockchain chains, enabling a chainless experience for users within the dApp. By leveraging transaction bundling with Smart Contract Wallets using the Biconomy SDK, dApps can offer seamless and efficient interactions for their users.

## How Smart Contract Wallets Work

- The Biconomy Modular SDK introduces Smart Contract Wallets (SCW) that serve as a fundamental component of the system. Each SC Wallet is associated with an Externally Owned Account (EOA), acting as its owner.

- The SC Wallet offers extensibility through support for various modules, such as MultiSig, Social Recovery Module, Recurring Transaction Module, Transaction Automation, Session Key Module, among others. These modules enhance wallet functionality without necessitating upgrades, enabling developers to tailor the user experience based on specific requirements.

- Transactions executed through the SC Wallet are initiated by the EOA using a cryptographic signature. The transaction data, along with the signature, is then relayed by a Relayer, ensuring secure and efficient transaction processing.

- Notably, the user's SC Wallet address is counterfactual, meaning it can be generated without deploying smart contract code on-chain, thanks to the CREATE2 opcode. This characteristic allows the SC Wallet address to remain consistent across different EVM chains, providing a seamless and chain-agnostic user experience within the dApp. 

- All interactions within a dApp, both on a single chain and across multiple chains, occur through the SC Wallet. This unified approach streamlines user interactions and fosters efficient cross-chain functionality.

- the SC Wallet doubles as a Gas Tank for users, allowing them to use any token held in the wallet (accepted by the Paymaster) to pay gas fees during the same transaction. This capability enables dApps to implement transaction batching, empowering users to execute multiple actions in a single transaction, simplifying processes like approving and depositing.

