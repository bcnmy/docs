---
sidebar_label: "Magic"
sidebar_position: 5
---

# Magic Link

Our Smart Accounts are signer agnostic, in this how to guide we'll show you how to incorporate Magic Link for creating a login experience that uses google login/email/or connect wallet all using the Magic Link UI. You can also add more features such as Social Login by building on top of these snippets, check out the official [Magic Documentation](https://magic.link/docs/dedicated/overview) for more information.

:::tip

Check out an end-to-end integration of Magic with Biconomy on this [example app](https://aamagic.vercel.app/) and [repo](https://github.com/bcnmy/biconomy_magic_example)!

:::

## Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add @biconomy/account magic-sdk ethers@5.7.2
```

## Imports

```typescript
import { createSmartAccountClient, LightSigner } from "@biconomy/account";
import { Wallet, providers, ethers } from "ethers";
import { Magic } from "magic-sdk";
```

## Magic Link Configuration

Magic will require api keys which you can get from the [Magic Dashboard](https://dashboard.magic.link/signup).

```typescript
import { Magic } from "magic-sdk";

// Initialize the Magic instance
export const magic = new Magic("YOUR_API_KEY", {
  network: {
    rpcUrl: "",
    chainId: 11155111, // or preferred chain
  },
});
```

## Create the Biconomy Smart Account

```typescript
const connect = async () => {
  try {
    await magic.wallet.connectWithUI();
    const web3Provider = new ethers.providers.Web3Provider(
      magic.rpcProvider,
      "any"
    );

    const smartAccount = await createSmartAccountClient({
      signer: web3Provider.getSigner() as LightSigner,
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
