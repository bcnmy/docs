---
sidebar_label: 'Ethers JS'
sidebar_position: 1
---

# Create Smart Accounts with Ethers JS

This section showcases two ways you can create Smart Accounts using Ethers JS. Using Private keys or using the Ethers Signer Object from a browser injected EOA. Note this is not a full implementation but a recipe to use and add to your existing projects. See our [tutorials](/category/tutorials) for full context on how this can be used. 

## Using Private Keys

### Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add @biconomy/account @biconomy/bundler @biconomy/common @biconomy/core-types @biconomy/modules @biconomy/paymaster ethers@5.7.2
```

### Imports

```typescript
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers, ethers } from 'ethers';
import { ChainId } from "@biconomy/core-types"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from '@biconomy/modules'
```

### Create a Signer using a Private Key:

```typescript
const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai")  // or any other rpc provider link
const signer = new Wallet("private key" || "", provider);
// we recommend using environment variables for your private keys!
```

### Configuration Values

Set up instances of Bundler, Paymaster, and ECDSA Module. Alternativedly you can also use the Multi chain Module this way.

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

### Create the Biconomy Smart Account

```typescript
async function createAccount() {
  
  const module = await ECDSAOwnershipValidationModule.create({
  signer: wallet,
  moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
  })

  let biconomySmartAccount = await BiconomySmartAccountV2.create({
    chainId: ChainId.POLYGON_MUMBAI,// or any supported chain of your choice
    bundler: bundler,
    paymaster: paymaster, 
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: module,
    activeValidationModule: module
})
  console.log("address: ", await biconomySmartAccount.getAccountAddress())
  return biconomySmartAccount;
}

createAccount()
```

## Using Ethers Signer from Browser EOA

### Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add @biconomy/account @biconomy/bundler @biconomy/common @biconomy/core-types @biconomy/modules @biconomy/paymaster ethers@5.7.2
```
### Imports

```typescript
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers, ethers } from 'ethers';
import { ChainId } from "@biconomy/core-types"
```

### Configuration Values

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

### Create the Biconomy Smart Account

```typescript

const connect = async () => {
    const { ethereum } = window;
    try {
      const provider = new ethers.providers.Web3Provider(ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const ownerShipModule = await ECDSAOwnershipValidationModule.create({
        signer: signer,
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
      })
      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: ownerShipModule,
        activeValidationModule: ownerShipModule
      })
      const address = await biconomySmartAccount.getAccountAddress()
      console.log(address)
    } catch (error) {
      console.error(error);
    }
  };

```