---
sidebar_position: 2
---

# Biconomy and Particle Auth

Particle Auth provides MPC (Multi-Party Computation)-based threshold signatures. This integration provides the auth module with the smart-account package combined.

## Code Examples

- [Implement Particle Auth With Biconomy SDK and React](https://github.com/bcnmy/sdk-examples/tree/master/react-vite-particle-auth)
- [Documentation for Particle Auth AA SDK](https://docs.particle.network/developers/account-abstraction/web-sdk)
- [Particle Auth Web Demo](https://github.com/Particle-Network/particle-web-demo)

## Installation 

Install and import the package from the Biconomy SDK 

```bash
yarn add @biconomy/particle-auth
// or
npm install @biconomy/particle-auth
```

:::info
Particle Auth Keys can be obtained from the [Particle Dashboard](https://dashboard.particle.network/)
:::

## Initialization

The code snippet below containes the import and initialization object needed to set up the Particle Auth Social login widget. 



```javascript
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


Once all values have been populated you can now trigger the social login:

```javascript
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
};

```

Now you can create a smart account with Biconomy and begin making transactions 

:::info
Make sure to authorize the NFT contract in your Biconomy Dashboard and retrieve the neccasary dapp API key. The NFT contract in this guide is deployed [here](https://goerli.etherscan.io/address/0xdd526eba63ef200ed95f0f0fb8993fe3e20a23d0)
:::

```javascript

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

Congratulations you have now integrated social login and created a gasless transaction. Make sure to check the full code example at the top of this doc to go over any React level configuration needed!