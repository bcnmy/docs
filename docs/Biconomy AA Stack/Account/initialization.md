---
sidebar_position: 3
---
# Initialization

:::info
This guide assumes a similar set up to our quickstart guide. View those instructions [here](setupnodecli.md). This can be adopted to other JavaScript Frameworks.
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
    bundlerUrl: '', // you can get this value from biconomy dashboard.     
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })

  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: '' // you can get this value from biconomy dashboard.
  })
```

| Key           | Description |
| ------------- | ------------- |
| bundlerUrl        | Represent ERC4337 spec implemented bundler url. you can get one from biconomy dashboard. Alternatively you can supply any of your preferred|
| chainId       | This represents the network your smart wallet transactions will be conducted on. Take a look following [Link](https://shorturl.at/arETU) for supported chain id's |
| entryPointAddress        | Since entrypoints can have different addresses you can call getSupportedEntryPoints() on the bundler instance for a list of supported addresses|

Now with the paymaster and bundler instances configured let’s set up the rest of what we need for our Smart Account

```typescript
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
```

Update your import from the account package to also include `BiconomySmartAccount` and `BiconomySmartAccountConfig` and also import Wallet, providers, and ethers from the ethers package.

Now we need an object that will hold the configuration values for our Smart Account.

```typescript
const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
    signer: wallet.getSigner(),
    chainId: ChainId.POLYGON_MUMBAI, 
    rpcUrl: '',
    paymaster: paymaster, //you can skip paymaster instance if you are not interested in transaction sponsorship
    bundler: bundler,
}
```

| Key           | Description |
| ------------- | ------------- |
| signer        | This signer will be used for signing userOps for any transactions you build. You can supply your your EOA wallet signer|
| chainId       | This represents the network your smart wallet transactions will be conducted on. Take a look following [Link](https://shorturl.at/arETU) for supported chain id's |
| rpcUrl        | This represents the EVM node RPC URL you'll interact with, adjustable according to your needs. We recommend to use some private node url for efficient userOp building|
| paymaster     | you can pass same paymaster instance that you have build in previous step. Alternatively, you can skip this if you are not interested in sponsoring transaction using paymaster|
|               | Note: if you don't pass the paymaster instance, your smart account will need funds to pay for transaction fees.|
| bundler       | You can pass same bundler instance that you have build in previous step. Alternatively, you can skip this if you are only interested in building userOP|

Lets create a new instance of the account using the BiconomySmartAccount class and passing it the biconomySmartAccountConfig configuration, we created above. We then await the initialisation of the account and log out two values to out terminal: the owner of the account and the smart account address. The owner should be your signer and the smart account address will be a new address referring to the address of this wallet.

```typescript
const biconomyAccount = new BiconomySmartAccount(biconomySmartAccountConfig)
const biconomySmartAccount =  await biconomyAccount.init()
console.log("owner: ", biconomySmartAccount.owner)
console.log("address: ", biconomySmartAccount.address)
``