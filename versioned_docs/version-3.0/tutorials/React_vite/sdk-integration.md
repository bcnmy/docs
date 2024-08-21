---
sidebar_position: 5
---

# SDK Integration

Now let's get to work on our App.tsx file!

First lets update some of our imports. I've changed the initial imports to the
following:

```js
import "./App.css";
import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
import Counter from "./Components/Counter";
import { Magic } from "magic-sdk";
```

We are importing some css styles here but you can build your own login UI as
well if needed.

Here is information about the rest of the imports:

- `useState`, `useEffect`, `useRef`: React hooks for managing component state
  and lifecycle.
- `Magic` from `magic-sdk`: A class from Magic SDK that
  allows you to leverage Magic for social logins.
- ChainId from `@biconomy/core-types`: An enumeration of supported blockchain
  networks.
- `ethers`: A library for interacting with Ethereum.
- `Ibundler`and `bundler` will take UserOperations included in a mempool and
  and handle sending them to an entry point contract to be executed as a
  transaction onchain.
- `BiconomySmartAccount`,`BiconomySmartAccountConfig`,
  `DEFAULT_ENTRYPOINT_ADDRESS` from `@biconomy/account` to handle the
  configuration and methods of smart accounts
- `IPaymaster` and `Paymaster` will be used to sponsor gas fees for an
  account, provided specific predefined conditions are satisfied.
- `ECDSAOwnershipValidationModule`, and `DEFAULT_ECDSA_OWNERSHIP_MODULE,` to handle
  the ECDSA Validation Signature for generating the smart accounts.

Now, let's setup our paymaster and bundler :

```js
const bundler: IBundler = new Bundler({
    bundlerUrl:
        "https://bundler.biconomy.io/api/v2/80002/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    chainId: 80002,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl:
        "https://paymaster.biconomy.io/api/v1/80002/[YOUR_API_KEY_HERE]",
});
```

:::info
You can get your Paymaster URL and bundler URL from Biconomy Dashboard.
Follow the steps mentioned
[here](https://legacy-docs.biconomy.io/3.0/dashboard).
:::

Let's take a look at some state variables that will help us with our
implementation:

```js
const [smartAccount, setSmartAccount] = useState < any > (null);
const [loading, setLoading] = useState < boolean > (false);
const [provider, setProvider] = useState < any > (null);
const [address, setAddress] = useState <string> ("";)
```

Next, let's implement the connect function for activating magic social login and Biconomy Smart Account creation:

```js
const connect = async () => {
  try {
    await magic.wallet.connectWithUI();
    const web3Provider = new ethers.providers.Web3Provider(
      magic.rpcProvider,
      "any",
    );
    setProvider(web3Provider);
    const module = await ECDSAOwnershipValidationModule.create({
      signer: web3Provider.getSigner(),
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
    });
    setLoading(true);
    let biconomySmartAccount = await BiconomySmartAccountV2.create({
      chainId: 80002,
      bundler: bundler,
      paymaster: paymaster,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      defaultValidationModule: module,
      activeValidationModule: module,
    });

    const address = await biconomySmartAccount.getAccountAddress();
    setAddress(address);
    setLoading(false);
  } catch (error) {
    console.error(error);
  }
};
```
