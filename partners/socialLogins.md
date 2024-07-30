---
sidebar_label: "Social Login Partners"
sidebar_position: 3
---

# Social Login - Signers for your SA

Every account generated on a blockchain has a logic that allows us to cryptographically sign transactions using our private keys. Authentication services like Particle, Web3Auth, and wallet applications such as Metamask provide us with easier options to manage private keys and initiate transactions.

As you might already know, there are two types of accounts i.e. Smart Accounts and Externally Owned Accounts (EOAs). A lot of web3 users have EOAs that they manage using their Metamask and other similar self-custodial wallet services.

Similar to EOAs, Smart Accounts also have a signer vis-a-vis a validation logic which can be set to an ECDSA signature. These ECDSA signatures can be generated using an associated private key. Developers have the flexibility to choose a singer to manage these private keys for the user. Services like Web3Auth, Particle, etc provide creative and more user-friendly ways like Passkeys, Social Login, and Emails to use the said private keys which are secured using different security methods like MPC, DKG, etc.

We've rounded up the best social login options out there, all in one spot for you. The Biconomy stack works smoothly with these logins, supporting easy integration. When developers pick wallets for their apps, they should think about things like security, cost, user experience, flexibility, privacy, and recoverability. Check out the table below to get a quick look at these factors.

&nbsp;

| Signer                                         | Outlier Factors                                                             | Additional Links                                                                                        | Security Method                                                                                                                                                       |
| ---------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Particle Auth**](/Account/signers/particle) | Integrated AA Experience & free to use via Biconomy                         | [Authentication Methods](https://docs.particle.network/developers/connect-service#1.-simple-onboarding) | MPC-TSS                                                                                                                                                               |
| [**Web3Auth**](/Account/signers/web3auth)      | Pop-up less experience                                                      | [Authentication Methods](https://web3auth.io/docs/auth-provider-setup/#supported-auth-providers)        | MPC-SSS/TSS                                                                                                                                                           |
| [**Privy**](/Account/signers/privy)            | Choose between having popups for more transparency vs abstract signing away | [Authentication Methods](https://docs.privy.io/guide/configuration/#login-methods)                      | SSS                                                                                                                                                                   |
| [**Capsule**](/Account/signers/capsule)        | Policy engine for sessions                                                  | [Demo Apps](https://docs.usecapsule.com/getting-started/examples)                                       | MPC + DKG ([Link](https://docs.usecapsule.com/how-capsule-works/key-management))                                                                                      |
| [**Magic**](/Account/signers/magic)            |                                                                             | [Authentication Methods](https://magic.link/docs/authentication/overview)                               | Delegated Key Management System ([DKMS](https://magic.link/docs/home/security/product-security#private-keys-can-be-lost-or-stolen-how-do-you-protect-my-private-key)) |
| **Lit Protocol**                               | Programmable key pairs                                                      | [More about PKPs](https://developer.litprotocol.com/v2/pkp/intro/)                                      | MPC                                                                                                                                                                   |
| [**DFNS**](/Account/signers/dfns)              | Policy engine for setting limits                                            | [Policy Engine](https://www.dfns.co/product/wallets-as-a-service)                                       | MPC + TSS ([Link](https://www.dfns.co/security))                                                                                                                      |
