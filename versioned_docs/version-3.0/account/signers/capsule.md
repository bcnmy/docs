---
sidebar_label: "Capsule"
sidebar_position: 7
---

# Capsule

[Capsule](https://usecapsule.com/) is a signing solution that you can use to create secure, embedded MPC wallets with just an email or a social login. Capsule wallets are portable across applications, recoverable, and programmable, so your users do not need to create different signers or contract accounts for every application they use.

Read below to learn how to configure your app to create smart accounts for all your users using Capsule and Biconomy. This guide assumes you are using React or a React based web framework such as Next JS. For Capsule guides in other frameworks, check out the [Capsule developer docs](https://docs.usecapsule.com) or get in touch via hello@usecapsule.com.

## Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add @biconomy/account @biconomy/bundler @biconomy/common @biconomy/core-types @biconomy/modules @biconomy/paymaster @usecapsule/web-sdk ethers@5.7.2
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
import { ChainId } from "@biconomy/core-types";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
```

## Capsule Configuration

You will need to do some initial setup and get API keys from capsule, for additional help check out the [Capsule Starter Guide](https://docs.usecapsule.com/getting-started/initial-setup).

```typescript
import { Capsule, Environment } from "@usecapsule/web-sdk";
const capsule = new Capsule(Environment.BETA, YOUR_API_KEY);
```

After setup we now need to get a signer from capsule update the import statement to get the Capusule ethers signer and pass the capsule instance we created above.

```typescript
import Capsule, { Environment, CapsuleEthersSigner } from "@usecapsule/web-sdk";

const provider = new ethers.JsonRpcProvider(CHAIN_PROVIDER, CHAIN);

const ethersSigner = new CapsuleEthersSigner(capsule, provider);
```

## Biconomy Configuration Values

Set up instances of Bundler and Paymaster.

```typescript
const bundler: IBundler = new Bundler({
  // get from biconomy dashboard https://dashboard.biconomy.io/
  bundlerUrl: "",
  chainId: ChainId.POLYGON_MUMBAI, // or any supported chain of your choice
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
    const module = await ECDSAOwnershipValidationModule.create({
      signer: ethersSigner, // signer value we got from capsule
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
    });

    let biconomySmartAccount = await BiconomySmartAccountV2.create({
      chainId: ChainId.POLYGON_MUMBAI,
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
