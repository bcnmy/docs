---
sidebar_position: 2
---
# Installation
Using `npm` package manager

```bash
npm i @biconomy/account 
```
OR

Using `yarn` package manager

```bash
yarn add @biconomy/account
```

In the following sections, you will learn more about the Bundler and Paymaster packages individually. In order to take full advantage of the account we need to install these two packages as well:

Using `npm` package manager

```bash
npm install @biconomy/account @biconomy/bundler @biconomy/common @biconomy/core-types @biconomy/paymaster
```

OR

Using `yarn` package manager

```bash
yarn add @biconomy/account @biconomy/bundler @biconomy/common @biconomy/core-types @biconomy/paymaster
```

Let’s take a look at each of these packages.
The account package will help you create Smart Contract Accounts - (SCAs) and interface with them to create transactions.
The ```bundler``` package helps you interact with our bundler or another bundler of your choice.
The ```paymaster``` package works similarly to the bundler package in that you can use our paymaster or any other one you choose.
The ```core-types``` package will give us Enums for the proper ChainId we may want to use
The ```common``` package is needed by our accounts package as another dependency.

## Smart Account instance configuration

| Key           | Description |
| ------------- | ------------- |
| signer        | This signer will be used for signing userOps for any transactions you build. You can supply your EOA wallet as a signer|
| chainId       | This represents the network your smart wallet transactions will be conducted on. Take a look at the [following](../../supportedchains/supportedchains.md) for supported chains |
| rpcUrl        | This represents the EVM node RPC URL you'll interact with, adjustable according to your needs. We recommend using some private node url for efficient ```userOp``` building|
| paymaster     | You can pass the same paymaster instance that you have built in the previous step. Alternatively, you can skip this if you are not interested in sponsoring transactions using Paymaster |
|               | Note: if you don't pass the Paymaster instance, your Smart Contract Account will need funds to pay for transaction fees.|
| bundler       | You can pass the same bundler instance that you have built in the previous step. Alternatively, you can skip this if you are only interested in building ```userOp```|
| entryPointAddress    | Entry point address for chain, you can use the DEFAULT_ENTRYPOINT_ADDRESS here |
| defaultValidationModule    | Validation module to initialize with this should be either ECDSA or Multi chain |
| activeValidationModule   | Validation module to initialize with this should be either ECDSA or Multi chain and this can be changed later once you activate further modules |

:::info
We are utilizing Ethers to pass the signer during initialization. However, it's worth mentioning that you have the flexibility to obtain the signer from various other SDKs. Some popular options include Web3.js, Wagmi React hooks, as well as authentication providers like Particle, Web3Auth, Magic, and many others.
:::

## Example Usage

```typescript
// This is how you create BiconomySmartAccount instance in your dapp's

import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { ChainId } from "@biconomy/core-types"
import { IBundler, Bundler } from '@biconomy/bundler'
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'

// create instance of bundler
 const bundler: IBundler = new Bundler({
    //https://dashboard.biconomy.io/ get bundler urls from your dashboard
    bundlerUrl: "",    
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })


  // create instance of paymaster
  const paymaster: IPaymaster = new BiconomyPaymaster({
    //https://dashboard.biconomy.io/ get paymaster urls from your dashboard
    paymasterUrl: ""
  })

  // instance of ownership module - this can alternatively be the multi chain module
  const ownerShipModule = await ECDSAOwnershipValidationModule.create({
        signer: {}, // ethers signer object
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
      })

const biconomyAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI, //or any chain of your choice
        bundler: bundler, // instance of bundler
        paymaster: paymaster, // instance of paymaster
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, //entry point address for chain
        defaultValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
        activeValidationModule: ownerShipModule // either ECDSA or Multi chain to start
      })
const address = await biconomySmartAccount.getSmartAccountAddress()

```

