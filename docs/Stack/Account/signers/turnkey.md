---
sidebar_label: "Turnkey"
sidebar_position: 8
---

# Turnkey

Turnkey is a simple way to manage your private keys using its APIs. This section will give you code snippets for creating Biconomy Smart Accounts with Turnkey. Turnkey lets you generate private keys and wallets using which you can create Biconomy Smart Account. The following code snippet will show you how you can pass Turnkey signer to create Biconomy Smart Account to reap the benefits of Account Abstraction.

:::tip

Check out an end-to-end integration of Turnkey with Biconomy in this [repo](https://github.com/bcnmy/biconomy_turnkey_example)!

:::

## Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add @biconomy/account @turnkey/ethers @turnkey/http @turnkey/api-key-stamper ethers@5.7.2
```

## Imports

```typescript
import { createSmartAccountClient, LightSigner } from "@biconomy/account";
import { Wallet, providers, ethers } from "ethers";
import { TurnkeySigner } from "@turnkey/ethers";
import { TurnkeyClient } from "@turnkey/http";
import { ApiKeyStamper } from "@turnkey/api-key-stamper";
```

## Turnkey Configuration

Turnkey will require api public and private keys which you can get from the [Turnkey Dashboard](https://app.turnkey.com/dashboard/auth/initial).

Once you generate a pair of public and private key from the dashboard, replace those keys with **_*apiPublicKey*_** and **_*apiPrivateKey*_**.You will also get the **_*organizationId*_** from the dashboard, and for **_*signWith*_**, you will have to generate a private key from [Turnkey Wallet](https://app.turnkey.com/dashboard/wallets) which will have an Account Address in it.

```typescript
// Initialise Turnkey Client
const turnkeyClient = new TurnkeyClient(
  {
    baseUrl: "https://api.turnkey.com",
  },
  new ApiKeyStamper({
    apiPublicKey: "", // <Turnkey API Public Key (that starts with 02 or 03)>
    apiPrivateKey: "". // <Turnkey API Private Key>
  })
);

// Initialize Turnkey Signer
const turnkeySigner = new TurnkeySigner({
    client: turnkeyClient,
    organizationId: "", // <Turnkey organization ID>
    signWith: "", // <Turnkey Wallet Account Address, Private Key Address, or Private Key ID>
});

const connectedSigner = turnkeySigner.connect(provider) // Pass an ethers Provider
```

## Create the Biconomy Smart Account

```typescript
const connect = async () => {
  try {
    const smartAccount = await createSmartAccountClient({
      signer: connectedSigner as LightSigner,
      bundlerUrl:
        "https://bundler.biconomy.io/api/v2/{chain-id-here}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
      biconomyPaymasterApiKey: "https://docs.biconomy.io/dashboard/paymaster", // <-- Read about this here
    });

    const address = await smartAccount.getAccountAddress();
  } catch (error) {
    console.error(error);
  }
};
```
