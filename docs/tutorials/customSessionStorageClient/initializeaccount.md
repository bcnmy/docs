---
sidebar_label: "Initialize Smart Account"
sidebar_position: 3
---

# Initialize Smart Account

In this step we'll set up our node js script to create or display a smart account in our command prompt.

:::info
This tutorial has a setup step in the previous section: [Environment Setup](environmentsetup)
:::

## Initialization

```typescript
import {
  createSmartAccountClient,
} from "@biconomy/account";
import { Wallet, providers, ethers } from "ethers";
```

```typescript
const provider = new providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai",
);
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);
```

- We create a provider using a public RPC provider endpoint from ankr, feel free to use any service here such as Infura or Alchemy if you wish. We encourage you to use a private RPC endpoint for better efficiency in userOp creation.
- Next we create an instance of the wallet associated to our Private key.

Now lets sup our paymaster. Update your imports to contain the following values:

```typescript
import {
  IPaymaster,
  BiconomyPaymaster,
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
  createSmartAccountClient,
} from "@biconomy/account";
```

We'll need these to help us execute our gasless transaction. The first thing we want to do is get a paymaster api key.
```typescript
  const paymasterApiKey = "apiKey";
```

Now lets generate a new instance of our smart account. Additional information about this method can be found [here](https://docs.biconomy.io/Account/methods#createSmartAccountClient).

```typescript
async function createAccount() {
  let biconomySmartAccount = await createSmartAccountClient({
    signer: wallet,
    bundlerUrl,
    biconomyPaymasterApiKey: paymasterApiKey,
  });
  console.log("address: ", await biconomySmartAccount.getAccountAddress());
  return biconomySmartAccount;
}

createAccount();
```

After running this script your command prompt should then display the address of your smart account. In the next section we'll execute our first gasless transaction by minting an NFT.
