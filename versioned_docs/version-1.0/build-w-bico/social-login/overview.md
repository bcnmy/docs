---
sidebar_position: 1
---

# Overview

Web3 applications often necessitate a Web3 wallet for authentication or login. However, this requirement can pose a barrier to new users who are unfamiliar with wallets. Therefore, the integration of traditional social sign-in with Web3 login can significantly enhance user onboarding and experience.

We collaborate with Web3 authentication providers like Web3Auth and Particle Network to offer social login via our SDK. Our non-custodial social login flow greatly improves user experience and onboarding. Users always maintain control over ownership and access to their cryptographic key pair. If you have an existing user base, it's easy to plug in and use. No migration is necessary.

## Social Logins in General

Social logins have become a popular method for user authentication due to their convenience and ease of use. They allow users to authenticate themselves using their existing social media accounts, eliminating the need to remember another username and password. This not only simplifies the login process but also speeds up the registration process, as users don't need to fill out a registration form.

In the context of Web3 applications, social logins can be used to generate a unique private key for each user. This private key can then be used to sign transactions, allowing users to interact with the blockchain without needing to understand the complexities of managing a blockchain wallet.

## Flow Explained

Users can log in to your dApp either via social login or by connecting their external wallet. In social login, they may sign in via Google, Facebook, or email. A unique private key is generated for each user via the Web3 authentication provider. Using this key, users can sign transactions without wallet pop-ups or context switching. As long as the email is the same, the same account will be generated for all social accounts.

:::note
**Please Note**: We do not store any private keys.
:::

## Modular SDK

Our SDK is designed to be highly modular and versatile. It can be easily integrated with any social login provider, giving you the flexibility to choose the provider that best suits your needs. However, we recommend using either Particle Network or Web3Auth, as these providers offer robust and secure solutions for Web3 authentication. By using our SDK, you can leverage the benefits of social logins to provide a seamless and user-friendly experience for your users.
