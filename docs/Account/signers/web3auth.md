---
sidebar_label: 'Web3Auth'
sidebar_position: 6
---


# Web3Auth

:::caution

The package @biconomy/web3-auth has been deprecated. It is highly recommended that if you integrate web3auth you should use their packages directly.

:::

One way to utilize Social Logins is via Web3Auth. This section will give you code snippets for creating Biconomy Smart Accounts with Web3Auth. Web3Auth allows you to introduce familiar Web2 experiences, with the following code snippets you can unlock: authentication with email to create a smart account as well as authentication with different social providers to create a Smart Account

## Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add @biconomy/account @biconomy/bundler @biconomy/common @biconomy/core-type @biconomy/modules @biconomy/paymaster @biconomy/web3-auth ethers@5.7.2
```

## Imports

```typescript
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers, ethers } from 'ethers';
import { ChainId } from "@biconomy/core-types"
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css"
```

:::info
By installing this package you might get an error like
"Module not found: Error: Can't resolve 'crypto'."
These are polyfills errors that can be resolved by configuring the webpack properly. As mentioned [here](https://github.com/bcnmy/biconomy-client-sdk/issues/87#issuecomment-1329798362).
:::

### SocialLogin Module Functions

If you check the SocialLogin class you will find different methods which we've got to help you integrate social login

1. `init()` - is required after initializing. It makes important calls and makes the web3auth ready for you.
2. `showWallet()` - it will show the widget in your UI.
3. `hideWallet()` - it will hide the wallet widget from the UI.
4. `logout()` - Logs out of the wallet, also clears the cache.
5. `getUserInfo()` - This method returns the object of email, name, profileImage, and idToken.
6. `whitelistUrl()` - If you are deploying your site, you must whitelist your deployment URL. It returns signatures that you can pass to init functions. You can also pass the array of URLs to signatures. The signature in init is not required for localhost.

Initialize the social login SDK

```js
// create an instance of SocialLogin 
const socialLogin = new SocialLogin()
// init social login SDK, all params are optional
await socialLogin.init(); 

// pops up the UI widget
socialLogin.showWallet();
```

For whitelisting your domain, please use the following code snippet. When deploying on prod it is required to whitelist your domain. In init, you can pass the domain and signature.

```js
// get signature that corresponds to your website domains
const signature1 = await socialLogin.whitelistUrl('https://yourdomain1.com');
const signature2 = await socialLogin.whitelistUrl('https://yourdomain2.com');
// pass the signatures, you can pass one or many signatures you want to whitelist
await socialLogin.init({
  whitelistUrls: {
    'https://yourdomain1.com': signature1,
    'https://yourdomain2.com': signature2,
  }
});
```

- Access to web3Auth provider after the wallet is connected

```js
if (!socialLogin?.provider) return;
// create a provider from the social login provider that 
// will be used by the smart account package of the Biconomy SDK
const provider = new ethers.providers.Web3Provider(
    socialLogin.provider,
);
// get a list of accounts available with the provider
const accounts = await provider.listAccounts();
console.log("EOA address", accounts)
```

## Setting Up Smart Account with Social Login


## Initialize Smart Account


```js
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
} from '@biconomy/paymaster'
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";

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

const module = await ECDSAOwnershipValidationModule.create({
    signer: wallet,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
  })


let biconomySmartAccount = await BiconomySmartAccountV2.create({
    chainId: ChainId.POLYGON_MUMBAI,
    bundler: bundler, 
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: module,
    activeValidationModule: module
})


```