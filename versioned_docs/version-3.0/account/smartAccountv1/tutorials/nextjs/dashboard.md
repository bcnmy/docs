---
sidebar_position: 3
---

# Paymaster, Bundler, And The Biconomy Dashboard

Now, let's setup our biconomy dashboard. Follow the instructions
[on this page](https://docs.biconomy.io/docs/dashboard).

Before continuing onto the the next step be sure that you have completed the
following:

- Created an account on the Biconomy Dashboard.
- Register a new paymaster on the Dashboard.
- Get the [Paymaster URL](https://docs.biconomy.io/docs/dashboard/) and
  bundler URL from dashboard.
- Set up a Gas tank with some Base Goerli Eth. We recommend around .02 Eth to
  start.
- Whitelist the `safeMint` method of the NFT smart contract under
  [Paymaster Rules](https://docs.biconomy.io/docs/dashboard/paymasterRules)
  on the dashboard.

:::info Missing any of the above steps causes a lot of
[common errors](docs/troubleshooting/commonerrors.md) to occur. This is a good
checklist to have when building new dApps utilizing the Biconomy SDK. :::

Now with our smart contracts ready to go along with our Paymaster and Bundler
URLs let's get started with our frontend.
