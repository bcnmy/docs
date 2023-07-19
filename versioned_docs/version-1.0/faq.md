---
sidebar_position: 11
---

# Frequently Asked Questions

**Q. Will the SC Wallet (Smart Account) creation add extra steps for users before interacting with the dApp?**

Wallet addresses are counterfactual in nature. Thus SCW address can be generated without actually deploying the smart contract on-chain and can be shown immediately. The smart contract is deployed along with sending the first user's transaction.

<br></br>

**Q. Who is in control of the wallet?**

The owner of the wallet is the only signatory to authorize transactions. No transactions of value can be done via the Smart Account without the owner’s signature. Modules added by the owner are in control of the wallet within their defined specific logic.

<br></br>

**Q. What will the SCW integration look like on dApp’s front end? How much effort will apps need to put to integrate?**

Besides the WalletConnect method, Biconomy SDK will provide a customizable widget that makes interactions for end users easy and in place.

<br></br>

**Q. What does wallet creation cost?**

All wallets are copies of the implementation contract with their own states and are created as proxies. That means Smart Account creation consumes only a small amount of gas thus it is cheap. The actual cost varies depending on the chain.

<br></br>

**Q. Which ERC20 Tokens are supported as payments?**

Biconomy relayers will initially support payments in stablecoins. In the future, dApps can also participate in a relayer network and collect fees in tokens of their choice.
