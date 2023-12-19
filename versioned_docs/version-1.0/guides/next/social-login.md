---
sidebar_position: 1
---

# Setting Up Social Login

Social Login is a pluggable auth infrastructure built on Web3Auth for dApp developers who want to integrate social login without hassle. Developers don't have to create clients or go to any dashboard to whitelist URLs.

## Steps To Enable Social Login

- Install and import the web3-auth package from the Biconomy SDK

```bash
yarn add @biconomy/web3-auth
// or
npm install @biconomy/web3-auth
```

```js
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css";
```

:::info
By installing this package you might get an error like
"Module not found: Error: Can't resolve 'crypto'."
These are polyfills errors that can be resolved by configuring the webpack properly. As mentioned [here](https://github.com/bcnmy/biconomy-client-sdk/issues/87#issuecomment-1329798362).
:::

:::info
If you're using a biconomy/web3-auth package version below 0.0.4 then you don't need to import the CSS in the project root.
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
const socialLogin = new SocialLogin();
// init social login SDK, all params are optional
await socialLogin.init();

// pops up the UI widget
socialLogin.showWallet();
```

For whitelisting your domain, please use the following code snippet. When deploying on prod it is required to whitelist your domain. In init, you can pass the domain and signature.

```js
// get signature that corresponds to your website domains
const signature1 = await socialLogin.whitelistUrl("https://yourdomain1.com");
const signature2 = await socialLogin.whitelistUrl("https://yourdomain2.com");
// pass the signatures, you can pass one or many signatures you want to whitelist
await socialLogin.init({
  whitelistUrls: {
    "https://yourdomain1.com": signature1,
    "https://yourdomain2.com": signature2,
  },
});
```

- Access to web3Auth provider after the wallet is connected

```js
if (!socialLogin?.provider) return;
// create a provider from the social login provider that
// will be used by the smart account package of the Biconomy SDK
const provider = new ethers.providers.Web3Provider(socialLogin.provider);
// get a list of accounts available with the provider
const accounts = await provider.listAccounts();
console.log("EOA address", accounts);
```

As the SocialLogin SDK is trying to access the DOM this might give error for document not found by next.js.

We need to wrap this file inside next/dynamic from next.js. Move all the logic in to new component and import it like this. [Here is all the files.](https://github.com/bcnmy/sdk-examples/tree/master/nextjs-biconomy-web3Auth)

```js
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Index = () => {
  const SocialLoginDynamic = dynamic(
    () => import("../components/scw").then((res) => res.default),
    {
      ssr: false,
    },
  );

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SocialLoginDynamic />
      </Suspense>
    </div>
  );
};

export default Index;
```

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
