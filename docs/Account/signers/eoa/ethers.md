---
sidebar_label: "Ethers JS"
sidebar_position: 1
---

# Create Smart Accounts with Ethers JS

This section showcases two ways you can create Smart Accounts using Ethers JS. Using Private keys or using the Ethers Signer Object from a browser injected EOA. Note this is not a full implementation but a recipe to use and add to your existing projects. See our [tutorials](/tutorials) for full context on how this can be used.

## Using Private Keys

### Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add @biconomy/account ethers@5.7.2
```

### Imports

```typescript
import { createSmartAccountClient } from "@biconomy/account";
import { Wallet, providers, ethers } from "ethers";
```

### Create a Signer using a Private Key:

```typescript
const provider = new providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai"
); // or any other rpc provider link
const signer = new Wallet("<your_private_key>" || "", provider);
// we recommend using environment variables for your private keys!
```

### Create the Biconomy Smart Account

```typescript
async function createAccount() {
  const biconomySmartAccount = await createSmartAccountClient({
    signer,
    bundlerUrl: "", // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
    biconomyPaymasterApiKey: "", // <-- Read about at https://docs.biconomy.io/dashboard/paymaster
  });
  console.log("address: ", await biconomySmartAccount.getAccountAddress());
  return biconomySmartAccount;
}

createAccount();
```

## Using Ethers Signer from Browser EOA

### Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add @biconomy/account ethers@5.7.2
```

### Create the Biconomy Smart Account

```typescript
const connect = async () => {
  const { ethereum } = window;
  try {
    const provider = new ethers.providers.Web3Provider(ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const biconomySmartAccount = await createSmartAccountClient({
      signer,
      bundlerUrl: "", // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
      biconomyPaymasterApiKey: "", // <-- Read about at https://docs.biconomy.io/dashboard/paymaster
    });
    const address = await biconomySmartAccount.getAccountAddress();
    console.log(address);
  } catch (error) {
    console.error(error);
  }
};
```
