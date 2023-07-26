---
sidebar_position: 2
---

# Setting Up Smart Account with Social Login

Next, you will need to connect the provider to the Biconomy Smart Account package. To install the smart account run the following command:

```bash
yarn add @biconomy/account
yarn add @biconomy/bundler
yarn add @biconomy/paymaster
// or
npm install @biconomy/account
npm install @biconomy/bundler
npm install @biconomy/paymaster
```

:::info
**You'll need a dApp API key to create Smart Accounts for your users.**
You can register your dApp and get an API key for it from the **Biconomy Dashboard.**

If you have problems with using the Dashboard and configuring your dApp and Gas Tank, feel free to get in touch with us for spinning up personal test keys and gas tanks on other test networks.
:::

## Initialize Smart Account


```js
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
} from '@biconomy/paymaster'

const bundler: IBundler = new Bundler({
  bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/abc', // you can get this value from biconomy dashboard.     
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: 'https://paymaster.biconomy.io/api/v1/80001/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a' 
})

const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster
      }
      let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig)
      biconomySmartAccount =  await biconomySmartAccount.init()

// this provider is from the social login which we created in previous setup
let smartAccount = new SmartAccount(provider, options);
smartAccount = await smartAccount.init();
```


