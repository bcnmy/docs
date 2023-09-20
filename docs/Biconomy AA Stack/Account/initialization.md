---
sidebar_position: 3
---
# Initialization

:::info
This guide assumes a similar set up to our quickstart guide. View those instructions [here](quickstart.md). This can be adopted to other JavaScript Frameworks.
:::

Let’s import our account package, bundler package, paymaster package, and providers from the ethers package

```typescript
import { IBundler, Bundler } from '@biconomy/bundler'
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
```
IBundler and IPaymaster are typings for Bundler and BiconomyPaymaster classes that we will create new instances of.

Let’s start with the initial configuration here

```typescript
 const bundler: IBundler = new Bundler({
    //https://dashboard.biconomy.io/ get bundler urls from your dashboard
    bundlerUrl: "",    
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })

  const paymaster: IPaymaster = new BiconomyPaymaster({
    //https://dashboard.biconomy.io/ get paymaster urls from your dashboard
    paymasterUrl: ""
  })
```

| Key           | Description |
| ------------- | ------------- |
| bundlerUrl        | Represent ERC4337 spec implemented bundler url. you can get one from biconomy dashboard. Alternatively you can supply any of your preferred|
| chainId       | This represents the network your smart wallet transactions will be conducted on. Take a look following [Link](https://shorturl.at/arETU) for supported chain id's |
| entryPointAddress        | Since entrypoints can have different addresses you can call getSupportedEntryPoints() on the bundler instance for a list of supported addresses|

Now with the paymaster and bundler instances configured let’s set up the rest of what we need for our Smart Account

```typescript
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS  } from "@biconomy/account"
```

Update your import from the account package to also include `BiconomySmartAccountV2` and also import Wallet, providers, and ethers from the ethers package.

Lets create a new instance of the account using the create method on the BiconomySmartAccount class. See a detailed explanation of each argument supplied below. We then await the initialisation of the account and log out two values to out terminal: the owner of the account and the smart account address. The owner should be your signer and the smart account address will be a new address referring to the address of this wallet.

```typescript
let biconomySmartAccount = await BiconomySmartAccountV2.create({
        signer: {}, //ethers signer object
        chainId: ChainId.POLYGON_MUMBAI, //or any chain of your choice
        bundler: bundler, // instance of bundler
        paymaster: paymaster, // instance of paymaster
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, //entry point address for chain
        defaultValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
        activeValidationModule: ownerShipModule // either ECDSA or Multi chain to start
})
biconomySmartAccount =  await biconomySmartAccount.init()
const address = await biconomySmartAccount.getSmartAccountAddress()
console.log("address", address)
```

Account Create method takes the following: 

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

