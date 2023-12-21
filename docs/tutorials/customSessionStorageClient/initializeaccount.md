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

Let’s import our bundler package, and providers from the ethers package:

```typescript
import { IBundler, Bundler } from "@biconomy/bundler";
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { providers } from "ethers";
import { ChainId } from "@biconomy/core-types";
```

IBundler is the typing for the Bundler class that we will create a new instance of.

### **Initial Configuration**

```typescript
const bundler: IBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});
```

- Now we create an instance of our bundler with the following:
  - a bundler url which you can retrieve from the Biconomy Dashboard
  - chain ID, in this case we’re using Polygon Mumbai
  - and default entry point address imported from the account package

```typescript
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { Wallet, providers, ethers } from "ethers";
```

Update your import from the account package to also include BiconomySmartAccountV2 and also import Wallet, providers, and ethers from the ethers package.

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
} from "@biconomy/paymaster";
```

We'll need these to help us execute our gasless transaction. The first thing we want to do is create an instance of our paymaster:

```typescript
const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/80001/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a",
});
```

:::info
Note that using the above paymaster URL will only work on Polygon Mumbai network and will only allow sponsored transactions from the contract address mentioned at the start of this tutorial. If you would like to learn how to use our dashboard to get your own paymaster url on any of our supported chains make sure to check out our [Dashboard Documentation](/category/biconomy-dashboard/)
:::

Next step is to specify that we want the ECDSA module for our smart account. Update the imports to include the following:

```typescript
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
```

Now lets initialize the module and use the `create` method on the `BiconomySmartAccountV2` class to generate a new instance of our smart account. Additional information about this method can be found [here](https://docs.biconomy.io/Account/methods/create).

```typescript
async function createAccount() {
  const module = await ECDSAOwnershipValidationModule.create({
    signer: wallet,
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
  console.log("address: ", await biconomySmartAccount.getAccountAddress());
  return biconomySmartAccount;
}

createAccount();
```

After running this script your command prompt should then display the address of your smart account. In the next section we'll execute our first gasless transaction by minting an NFT.
