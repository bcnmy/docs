---
sidebar_position: 6
---

# Enable Fiat On-Ramp & Off-Ramp

BiconomySDK's Transak library is made for developers who just want on-ramp and off-ramp solutions and don't want to go through with all steps to integrate the SDK.

It is a typescript wrapper on `transak.js` SDK which abstracts a few steps for the developers and users.

## Steps to Enable Fiat On-Ramp & Off-Ramp

- Import the `@biconomy-sdk/transak` package into your project.

```js
import Transak from "@biconomy/transak";
```

- Initialize the project without going to any dashboard

```js
// init the widget
const transak = new Transak('STAGING');
transak.init();
```

- If you are using Fiat On Ramp then you can directly pass in the email like so:

```js
import Transak from '@biconomy/transak';

// use this info for transak package
const transak = new Transak('STAGING', {
  walletAddress: userAddress,
  userData: {
    firstName: userInfo?.name || '',
    email: userInfo?.email || '',
  },
});
transak.init();
```

- On `transak.init()` Transak widget opens and users can buy on-ramp.
![Fiat-1](img/fiat-1.png)

## Code Examples

- https://github.com/bcnmy/sdk-demo
- https://github.com/bcnmy/hyphen-ui/tree/demo-sdk

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
