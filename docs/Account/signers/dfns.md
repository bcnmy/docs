---
sidebar_label: 'DFNS'
sidebar_position: 6
---


# DFNS

Dfns provides wallet-as-a-service infrastructure that enables crypto developers to forget about private key management so they can focus on building what matters most — their applications. This guide will show you how to create a smart account using DFNS as a signer.

:::tip

Check out an end-to-end integration of DFNS with Biconomy on this [repo](https://github.com/dfnsext/typescript-sdk/tree/m/examples/ethersjs/v5/biconomy-aa-gasless)!

:::

Before using the code in this guide you will need to onboard onto DFNS, check out their onboarding guide [here](https://docs.dfns.co/dfns-docs/getting-started/gettingstarted). 

Code snippets below will be taken from the repository mentioned above and include some environment variables you will be able to fill in. The example will follow a node js script but can be adopted for frontend frameworks as well. 


The first thing we need to do is generate a DFNS wallet. Let's take a look at the imports and then the code for generating the wallet.

## Imports 

```typescript

import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from '@biconomy/account'
import { Bundler } from '@biconomy/bundler'
import { ChainId } from '@biconomy/core-types'
import { DEFAULT_ECDSA_OWNERSHIP_MODULE, ECDSAOwnershipValidationModule } from '@biconomy/modules'
import { BiconomyPaymaster, PaymasterMode } from '@biconomy/paymaster'
import { DfnsWallet } from '@dfns/lib-ethersjs5'
import { DfnsApiClient } from '@dfns/sdk'
import { AsymmetricKeySigner } from '@dfns/sdk-keysigner'
import { Interface } from '@ethersproject/abi'
import { JsonRpcProvider } from '@ethersproject/providers'
import dotenv from 'dotenv'

dotenv.config()

```

## Generate DFNS Wallet 

```typescript 

const provider = new JsonRpcProvider(process.env.POLYGON_PROVIDER_URL)

const initDfnsWallet = (walletId: string, provider: JsonRpcProvider) => {
  const signer = new AsymmetricKeySigner({
    privateKey: process.env.DFNS_PRIVATE_KEY!,
    credId: process.env.DFNS_CRED_ID!,
    appOrigin: process.env.DFNS_APP_ORIGIN!,
  })

  const dfnsClient = new DfnsApiClient({
    appId: process.env.DFNS_APP_ID!,
    authToken: process.env.DFNS_AUTH_TOKEN!,
    baseUrl: process.env.DFNS_API_URL!,
    signer,
  })

  return new DfnsWallet({
    walletId,
    dfnsClient,
    maxRetries: 10,
  }).connect(provider)
}

const mumbaiWallet = initDfnsWallet(process.env.POLYGON_WALLET_ID!, provider)

```
Remember to get your API keys from the DFNS dashboard and follow their [getting started](https://docs.dfns.co/dfns-docs/getting-started/gettingstarted) guides for this part of the process. 

## Create Smart Account 

```typescript

const bundler = new Bundler({
  bundlerUrl: '',
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const paymaster = new BiconomyPaymaster({
  paymasterUrl: '',
})

const createAccount = async (): Promise<BiconomySmartAccountV2> => {
  const module = await ECDSAOwnershipValidationModule.create({
    signer: mumbaiWallet,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
  })

  return BiconomySmartAccountV2.create({
    chainId: ChainId.POLYGON_MUMBAI,
    bundler: bundler,
    paymaster: paymaster,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: module,
    activeValidationModule: module,
  })
}


```

You can get all paymaster and bundler URLs from your [Biconomy Dashboard](https://dashboard.biconomy.io/) for this step. 

With this integration you will have everything you need to begin using the Biconomy Smart Account with DFNS. Remember to check out the [full integration here](https://github.com/dfnsext/typescript-sdk/tree/m/examples/ethersjs/v5/biconomy-aa-gasless) to see this in action with an example that includes executing a gasless transaction as well. 