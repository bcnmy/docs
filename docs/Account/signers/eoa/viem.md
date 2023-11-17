---
sidebar_label: 'Viem'
sidebar_position: 2
---

# Create Smart Accounts with Viem

This section shows how to use Viem to create a Smart Account with Biconomy. If you would like to simply see a code implementation, one is available [here](https://github.com/bcnmy/biconomy_viem_example) which showcases how to create a smart account as well as execute a gasless transaction with Viem. 

## Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add viem @alchemy/aa-core @biconomy/account @biconomy/bundler @biconomy/common @biconomy/modules @biconomy/paymaster
```

## Imports

```typescript
import { useState } from 'react'
import { Address, createWalletClient, custom, WalletClient, encodeFunctionData } from 'viem'
import { baseGoerli } from 'viem/chains'
import 'viem/window'
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { ChainId } from "@biconomy/core-types"
import { IPaymaster, BiconomyPaymaster, IHybridPaymaster, SponsorUserOperationDto, PaymasterMode } from '@biconomy/paymaster'
import { WalletClientSigner } from "@alchemy/aa-core";
```

## Create Bundler and Paymaster Instance

To set up the smart account lets instances of our bundler and Paymaster set up. These opitonal values in creating the smart account will be helpful in accessing the full stack of Account Abstraction made available by the Biconomy SDK. 

```typescript
 const bundler: IBundler = new Bundler({
    bundlerUrl: "",    
    chainId: ChainId.BASE_GOERLI_TESTNET,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: ""
  })
```

## Connect to Users EOA 

Let's get connected to the users EOA using Viem so we can prompt the user to sign when needed. In practice you should ensure this is done in an async function, potentially called from the click handler of a button. 

```typescript

const connect = async () => {
    if(!window.ethereum) return
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })

    const client = createWalletClient({
    account,
    chain: baseGoerli,
    transport: custom(window.ethereum)
  })
  }

```

## Create the Biconomy Smart Account

In the previous function we got the wallet Client - this should be saved in some sort of state variable depending on your frontend framework. 

```typescript
const createSmartAccount = async () => {
    if(!walletClient) return
    const signer = new WalletClientSigner(walletClient,"json-rpc" )
    const ownerShipModule = await ECDSAOwnershipValidationModule.create({
      signer: signer,
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
    })

    let biconomySmartAccount = await BiconomySmartAccountV2.create({
      chainId: ChainId.BASE_GOERLI_TESTNET,
      bundler: bundler,
      paymaster: paymaster,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      defaultValidationModule: ownerShipModule,
      activeValidationModule: ownerShipModule
    })

    const address = await biconomySmartAccount.getAccountAddress();
    setSaAddress(address)
    setSmartAccount(biconomySmartAccount)
  }
```

You are now ready to get started using Viem with Biconomy. For a full code implementation check out [this example repo](https://github.com/bcnmy/biconomy_viem_example). 