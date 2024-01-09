---
sidebar_label: "Dynamic"
sidebar_position: 2
---

Dynamic.xyz is a web3 login solution for everyone, offering straightforward onboarding and embedded wallet options for newcomers and elegant and smart login flows for crypto-native users. We aim to abstract away the complexities of user management, offering powerful developer tools around authentication, authorization and onboarding.

## 1. Install Dynamic and Biconomy

In your app's repository, install `@dynamic-labs/sdk-react-core`, `@dynamic-labs/ethereum` and `@biconomy/{account, bundler, common, core-types, paymaster}`:

```bash

yarn add @dynamic-labs/sdk-react-core @biconomy/account @biconomy/bundler @biconomy/common @biconomy/core-types @biconomy/paymaster

```

:::tip
@dynamic-labs/ethereum will help you to enable all EVM compatible chains including layer 2’s i.e. Base as well as Dynamic Embedded Wallets. Learn more about WalletConnectors [here](https://docs.dynamic.xyz/react-sdk/components/dynamiccontextprovider#walletconnectors).
:::

## 2. Initialize & configure Dynamic

### 2a. Add the DynamicContextProvider

All you need to get started is [the DynamicContextProvider](https://docs.dynamic.xyz/react-sdk/components/dynamiccontextprovider) - you will want to wrap your app with this component at the highest possible level, like so:

```tsx
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { EthersExtension } from "@dynamic-labs/ethers-v6";

<DynamicContextProvider
  settings={{
    // Find your environment id at https://app.dynamic.xyz/dashboard/developer
    environmentId: "REPLACE-WITH-YOUR-ENVIRONMENT-ID",
    walletConnectors: [EthereumWalletConnectors],
    walletConnectorExtensions: [EthersExtension],
  }}
>
  {/* Your app's components */}
</DynamicContextProvider>;
```

:::tip
We are using Ethers here instead of the default Viem, as Biconomy requires an Ethers signer object. Learn more about switching between Viem and Ethers [here](https://docs.dynamic.xyz/react-sdk/viem-ethers).

:::tip
To enable embedded wallets for your users, toggle it on along with email/social auth [in the dashboard](https://app.dynamic.xyz/dashboard/configurations#emailsocialsignin).
:::

### 2b. Access the wallet

Inside any component which is wrapped by DynamicContextProvider, you can access any of [the provided hooks](https://docs.dynamic.xyz/react-sdk/hooks/hooks-introduction). While you can access the full context via [usedynamiccontext](https://docs.dynamic.xyz/react-sdk/hooks/usedynamiccontext), we are most interested in the users currently connected wallets which we can easily access via [useuserwallets](https://docs.dynamic.xyz/react-sdk/hooks/useuserwallets).

:::tip
A user can have branded wallets connected as well as Dynamic embedded wallets, so here we will filter for a users embedded wallet, assuming they had one created when they signed up.
:::

```tsx
import { useUserWallets } from "@dynamic-labs/sdk-react-core";

const userWallets = useUserWallets();

const embeddedWallet = userWallets.find(
  (wallet) => wallet.connector?.isEmbeddedWallet === true
);
```

## 3. Configure your Biconomy bundler and paymaster

Go to the [Biconomy Dashboard](https://dashboard.biconomy.io/) and configure a Paymaster and a Bundler for your app. Make sure these correspond to the desired network for your user's smart accounts. You can learn more about the dashboard [here](/category/biconomy-dashboard)

## 4. Configure Biconomy to create the smart accounts

Once a user signs up through Dynamic, you can create a Biconomy smart account and use their Dynamic wallet as a signer for that new smart account. This means that the user will be able to user Biconomy's account abstraction features out of the box! Just before you do that though, you need to follow two more steps:

### 4a. Initialize a bundler and paymaster

You will need to initialize instances of a Biconomy `bundler` and `paymaster` for the user, like so:

```tsx

import { IBundler, Bundler } from '@biconomy/bundler';
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster';
import { ChainId } from "@biconomy/core-types";
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";

...

// Initialize your bundler
const bundler: IBundler = new Bundler({
    bundlerUrl: 'your-bundler-url-from-the-biconomy-dashboard',
    chainId: ChainId.POLYGON_MUMBAI, // Replace this with your desired network
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // This is a Biconomy constant
});

// Initialize your paymaster
const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: 'your-paymaster-url-from-the-biconomy-dashboard',
});

```

### 4b. Initialize a ECDSAOwnershipValidationModule

Now you're ready to allow the user to authorize actions from their Biconomy smart account by signing messages with their Dynamic wallet. This is done by initializing a `ECDSAOwnershipValidationModule` for the user's smart account and passing in a signer from the users wallet.

```tsx
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";

...

// Get a provider and signer for the user's embedded wallet
const provider = await embeddedWallet.connector?.getPublicClient();

// Note that we are using the ethers signer here rather than Viem
const signer = await embeddedWallet.connector?.ethers?.getSigner();

// Initialize Biconomy's validation module with the ethers signer
const validationModule = await ECDSAOwnershipValidationModule.create({
    signer: signer,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE // This is a Biconomy constant
});
```

## 5. Create the smart account

Lastly, using the user's paymaster, bundler, and validation module instances from above, initialize the user's smart account using Biconomy's `BiconomySmartAccountV2.create` method:

```tsx

import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS  } from "@biconomy/account";

...

const smartAccount = await BiconomySmartAccountV2.create({
    provider: provider, // This can be any ethers JsonRpcProvider connected to your app's network
    chainId: ChainId.POLYGON_MUMBAI, // Replace this with your target network
    bundler: bundler, // Use the `bundler` we initialized above
    paymaster: paymaster, // Use the `paymaster` we initialized above
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // This is a Biconomy constant
    defaultValidationModule: validationModule, // Use the `validationModule` we initialized above
    activeValidationModule: validationModule // Use the `validationModule` we initialized above
});

```

## End to end flow

```tsx
import { Bundler } from "@biconomy/bundler";
import { BiconomyPaymaster } from "@biconomy/paymaster";
import { ChainId } from "@biconomy/core-types";

import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";

import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";

const bundler = new Bundler({
  bundlerUrl: `https://bundler.biconomy.io/api/v2/${ChainId.GOERLI}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
  chainId: ChainId.GOERLI, // Replace this with your desired network
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // This is a Biconomy constant
});

const paymaster = new BiconomyPaymaster({
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/5/7u7kBsiwC.af995c1f-4e25-4eb6-ac07-edb7a84aabda",
});

const createValidationModule = async (signer) => {
  return await ECDSAOwnershipValidationModule.create({
    signer: signer,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE, // This is a Biconomy constant
  });
};

export const createSmartAccount = async (provider, signer) => {
  const validationModule = await createValidationModule(signer);

  return await BiconomySmartAccountV2.create({
    provider: provider, // This can be any ethers JsonRpcProvider connected to your app's network
    chainId: ChainId.GOERLI, // Replace this with your target network
    bundler: bundler, // Use the `bundler` we initialized above
    paymaster: paymaster, // Use the `paymaster` we initialized above
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // This is a Biconomy constant
    defaultValidationModule: validationModule, // Use the `validationModule` we initialized above
    activeValidationModule: validationModule, // Use the `validationModule` we initialized above
  });
};
```
