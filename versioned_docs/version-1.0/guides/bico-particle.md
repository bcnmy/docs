---
sidebar_position: 5
---

# Biconomy + Particle Auth

> Make transactions using @biconomy/particle-auth

Particle Auth provides MPC (Multi-Party Computation)-based threshold signatures. This integration provides the auth module with the smart-account package combined.

## Code example

- https://github.com/bcnmy/sdk-examples/tree/master/react-vite-particle-auth
- https://docs.particle.network/developers/account-abstraction/web-sdk
- https://github.com/Particle-Network/particle-web-demo

## Installation

Install and import the package from the Biconomy SDK

```bash
yarn add @biconomy/particle-auth
// or
npm install @biconomy/particle-auth
```

Can initiate the social login using the code snippet shared below.

:::info
You will need to get the particle keys from the Particle Dashboard.
:::

```js
import {
  ParticleAuthModule,
  ParticleProvider,
  BiconomyAccountModule,
} from "@biconomy/particle-auth";

const particle = new ParticleAuthModule.ParticleNetwork({
  projectId: "<projectId>", // get it from particle dashboard
  clientKey: "<clientKey>", // get it from particle dashboard
  appId: "<appId>", // get it from particle dashboard
  chainName: "Ethereum", //optional: current chain name, default Ethereum.
  chainId: 5, //optional: current chain id, default 1.
  wallet: {
    //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
    displayWalletEntry: true, //show wallet entry when connect particle.
    defaultWalletEntryPosition: ParticleAuthModule.WalletEntryPosition.BR, //wallet entry position
    uiMode: "dark", //optional: light or dark, if not set, the default is the same as web auth.
    supportChains: [
      { id: 1, name: "Ethereum" },
      { id: 5, name: "Ethereum Goerli" },
    ], // optional: web wallet support chains.
    customStyle: {}, //optional: custom wallet style
  },
});
```

Now can trigger the social login using

```js
const connect = async () => {
  try {
    const userInfo = await particle.auth.login();
    console.log("Logged in user:", userInfo);
    const particleProvider = new ParticleProvider(particle.auth);
    const ethersProvider = new ethers.providers.Web3Provider(
      particleProvider,
      "any"
    );
    const accounts = await ethersProvider.listAccounts();
    console.log("Logged in user:", accounts[0]);
  } catch (error) {
    console.error(error);
  }
};```

To create Biconomy smartAccount transactions.

:::info
To sponsor transactions you will need to generate the dapp api key from the [Biconomy dashboard.](https://dashboard.biconomy.io/)
:::

```js
const getSmartAccount = async () => {
  if (particle.auth === undefined) return;
  const particleProvider = new ParticleProvider(particle.auth);
  const wallet = new BiconomyAccountModule.SmartAccount(particleProvider, {
    projectId: "<projectId>", // get it from particle dashboard
    clientKey: "<clientKey>", // get it from particle dashboard
    appId: "<appId>", // get it from particle dashboard
    networkConfig: [
      {
        dappAPIKey: "<dappAPIKey>", // get it from biconomy dashboard
        chainId: 5,
      },
    ],
  });
  // AA address
  const address = await wallet.getAddress();
  setScwAddress(address);
  setSmartAccount(wallet);
  // EOA address
  const address = await smartAccount.getOwner();
  // load account more info.
  const accountInfo = await smartAccount.getAccount();
};

const doAATX = async () => {
  const nftInterface = new ethers.utils.Interface([
    "function safeMint(address _to)",
  ]);
  const data = nftInterface.encodeFunctionData("safeMint", [scwAddress]);
  const nftAddress = "0xdd526eba63ef200ed95f0f0fb8993fe3e20a23d0"; // test nft contract for goerli and mumbai
  const tx = {
    to: nftAddress,
    data: data,
    value: 0,
  };
  const wrapProvider = new BiconomyAccountModule.BiconomyWrapProvider(
    smartAccount,
    BiconomyAccountModule.SendTransactionMode.Gasless
  );
  const provider = new ethers.providers.Web3Provider(wrapProvider, "any");
  const signer = provider.getSigner();
  const txResponse = await signer.sendTransaction(tx);
  console.log("Tx Response", txResponse);
  const txReciept = await txResponse.wait();
  console.log("Tx hash", txReciept.transactionHash);
};
```

DONE! You just sent a gasless transaction with social login.

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
