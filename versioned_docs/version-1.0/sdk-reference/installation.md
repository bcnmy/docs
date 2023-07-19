---
sidebar_position: 1
---

# Installation

> Biconomy SDK ships multiple development libraries as single Monorepo.

First install the main package of Biconomy SDK which is [smart-account](https://www.npmjs.com/package/@biconomy/smart-account).

```bash
yarn add @biconomy/smart-account
```

or

```bash
npm install @biconomy/smart-account 
```

You can find the source code of all shipped packages on [Github](https://github.com/bcnmy/biconomy-client-sdk).

:::info
After webpack version >=5, NodeJS polyfills are not included and user have to configure the webpack themselves. If you're facing a problem with polyfills in your front end app check out below issue

https://github.com/bcnmy/biconomy-client-sdk/issues/87
:::

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
