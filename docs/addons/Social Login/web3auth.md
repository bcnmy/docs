---
sidebar_position: 2
---

# Biconomy and Web3Auth

Our second Social Login example is via a pluggable auth infrastructure built on Web3Auth for dApp developers who want to integrate social login without hassle. Developers don't have to create clients or go to any dashboard to whitelist URLs.

## Steps To Enable Social Login

- Install and import the web3-auth package from the Biconomy SDK

```bash
yarn add @biconomy/web3-auth
// or
npm install @biconomy/web3-auth
```

```js
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

Next, you will need to connect the provider to the Biconomy Smart Account package. To install the smart account run the following command:

```bash
yarn add @biconomy/account
yarn add @biconomy/bundler
yarn add @biconomy/paymaster
yarn add @biconomy/modules
// or
npm install @biconomy/account
npm install @biconomy/bundler
npm install @biconomy/paymaster
npm install @biconomy/modules
```

:::info
**You'll need a dApp API key to create Smart Accounts for your users.**
You can register your dApp and get an API key for it from the **Biconomy Dashboard.**

If you have problems with using the Dashboard and configuring your dApp and Gas Tank, feel free to get in touch with us for spinning up personal test keys and gas tanks on other test networks.
:::

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
  bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44', // you can get this value from biconomy dashboard.     
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: 'https://paymaster.biconomy.io/api/v1/80001/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a' 
})

const module = await ECDSAOwnershipValidationModule.create({
    signer: wallet,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
  })


let biconomySmartAccount = await BiconomySmartAccountV2.create({
    signer: wallet,
    chainId: ChainId.POLYGON_MUMBAI,
    bundler: bundler, 
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: module,
    activeValidationModule: module
})


```

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
