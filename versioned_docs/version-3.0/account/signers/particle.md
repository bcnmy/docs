---
sidebar_label: "Particle Network"
sidebar_position: 3
---

# Particle Network

One way to utilize Social Logins is via Particle Network. This section will give you code snippets for creating Biconomy Smart Accounts with Particle Network. Particle Network allows you to introduce familiar Web2 experiences, with the following code snippets you can unlock: authentication with email to create a smart account as well as authentication with different social providers to create a Smart Account.

:::tip

Check out an end-to-end integration of Particle with Biconomy on this [example app](https://aaparticle.vercel.app/) and [repo](https://github.com/bcnmy/biconomy_particle_example)!

:::

## Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add @biconomy/account @biconomy/bundler @biconomy/common @biconomy/modules @biconomy/paymaster @biconomy/particle-auth ethers@5.7.2
```

## Imports

```typescript
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { Wallet, providers, ethers } from "ethers";
import { ParticleAuthModule, ParticleProvider } from "@biconomy/particle-auth";
```

## Particle Auth Configuration

Particle auth will require api keys which you can get from the [Particle Dashboard](https://docs.particle.network/getting-started/dashboard).

```typescript
const particle = new ParticleAuthModule.ParticleNetwork({
  projectId: "",
  clientKey: "",
  appId: "",
  wallet: {
    displayWalletEntry: true,
    defaultWalletEntryPosition: ParticleAuthModule.WalletEntryPosition.BR,
  },
});
```

## Biconomy Configuration Values

Set up instances of Bundler and Paymaster.

```typescript
const bundler: IBundler = new Bundler({
  // get from biconomy dashboard https://dashboard.biconomy.io/
  bundlerUrl: "",
  chainId: 80002, // or any supported chain of your choice
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  // get from biconomy dashboard https://dashboard.biconomy.io/
  paymasterUrl: "",
});
```

## Create the Biconomy Smart Account

```typescript
const connect = async () => {
  try {
    const userInfo = await particle.auth.login();
    console.log("Logged in user:", userInfo);
    const particleProvider = new ParticleProvider(particle.auth);
    const web3Provider = new ethers.providers.Web3Provider(
      particleProvider,
      "any",
    );

    const module = await ECDSAOwnershipValidationModule.create({
      signer: web3Provider.getSigner(),
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
    });

    let biconomySmartAccount = await BiconomySmartAccountV2.create({
      chainId: 80002,
      bundler: bundler,
      paymaster: paymaster,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      defaultValidationModule: module,
      activeValidationModule: module,
    });

    const address = await biconomySmartAccount.getAccountAddress();
  } catch (error) {
    console.error(error);
  }
};
```
