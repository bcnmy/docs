---
sidebar_label: 'Magic'
sidebar_position: 3
---

# Magic Link

Our Smart Accounts are signer agnostic, in this how to guide we'll show you how to incorporate Magic Link for creating a login experience that uses google login/email/or connect wallet all using the Magic Link UI. You can also add more features such as Social Login by building on top of these snippets, check out the official [Magic Documentation](https://magic.link/docs/dedicated/overview) for more information. 

## Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add @biconomy/account @biconomy/bundler @biconomy/common @biconomy/core-type @biconomy/modules @biconomy/paymaster magic-sdk ethers@5.7.2
```

## Imports

```typescript
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers, ethers } from 'ethers';
import { ChainId } from "@biconomy/core-types"
import { Magic } from 'magic-sdk';
```
## Magic Link Configuration 

Magic will require api keys which you can get from the [Magic Dashboard](https://dashboard.magic.link/signup).


```typescript
import { Magic } from "magic-sdk"

// Initialize the Magic instance
export const magic = new Magic("YOUR_API_KEY", {
  network: {
    rpcUrl: "",
    chainId: 11155111, // or preferred chain
  },
})
```
## Biconomy Configuration Values

Set up instances of Bundler, Paymaster. Alternativedly you can also use the Multi chain Module this way.

```typescript

const bundler: IBundler = new Bundler({
    // get from biconomy dashboard https://dashboard.biconomy.io/
    bundlerUrl: '',     
    chainId: ChainId.POLYGON_MUMBAI,// or any supported chain of your choice
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })


const paymaster: IPaymaster = new BiconomyPaymaster({
  // get from biconomy dashboard https://dashboard.biconomy.io/
  paymasterUrl: '' 
})

```

## Create the Biconomy Smart Account 

```typescript

const connect = async () => {
    try {
      await magic.wallet.connectWithUI()
      const web3Provider = new ethers.providers.Web3Provider(
        magic.rpcProvider,
        "any"
      );

      const module = await ECDSAOwnershipValidationModule.create({
      signer: web3Provider.getSigner(),
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
      })

      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler, 
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: module,
        activeValidationModule: module
      })

      const address = await biconomySmartAccount.getSmartAccountAddress()
    } catch (error) {
      console.error(error);
    }
  };

```