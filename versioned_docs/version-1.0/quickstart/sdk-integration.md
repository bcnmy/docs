---
sidebar_position: 5
---

# SDK Integration

Now let's get to work on our App.tsx file!

First lets update some of our imports. I've changed the initial imports to the following:

```js
import "./App.css";
import "@biconomy-sdk-dev/web3-auth/dist/src/style.css";
import { useState, useEffect, useRef } from "react";
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";
import SmartAccount from "@biconomy/smart-account";
```

I'm still using the supplied css given to us by the template but am also importing some css from the Web3 Auth SDK. Note that this is optional and you can build your own login UI but for now we will keep things simple.

Here is information about the rest of the imports:

- `useState`, `useEffect`, `useRef`: React hooks for managing component state and lifecycle.
- `SocialLogin` from `@biconomy/web3-auth`: A class from Biconomy SDK that allows you to leverage Web3Auth for social logins.
- ChainId from `@biconomy/core-types`: An enumeration of supported blockchain networks.
- `ethers`: A library for interacting with Ethereum.
- `SmartAccount` from `@biconomy/smart-account`: A class from Biconomy SDK that will allow us to create smart accounts and interact with our contract with them.

Let's take a look at some state variables that will help us with our implementation:

```js
const [smartAccount, setSmartAccount] =
  (useState < SmartAccount) | (null > null);
const [interval, enableInterval] = useState(false);
const sdkRef = (useRef < SocialLogin) | (null > null);
const [loading, setLoading] = useState < boolean > false;
const [provider, setProvider] = useState < any > null;
```

Here we have some state that will be used to track our smart account that will be generated with the sdk, an interval that will help us with checking for login status, a loading state, provider state to track our web3 provider and a reference to our Social login sdk.

Next let's add a `useEffect` hook:

```js
useEffect(() => {
  let configureLogin: any;
  if (interval) {
    configureLogin = setInterval(() => {
      if (!!sdkRef.current?.provider) {
        setupSmartAccount();
        clearInterval(configureLogin);
      }
    }, 1000);
  }
}, [interval]);
```

This use effect will be triggered after we open our login component, which we'll create a function for shortly. Once a user opens the component it will check if a provider is available and run the functions for setting up the smart account.

Now our login function:

```js
async function login() {
  if (!sdkRef.current) {
    const socialLoginSDK = new SocialLogin();
    const signature1 = await socialLoginSDK.whitelistUrl(
      "http://127.0.0.1:5173/"
    );
    await socialLoginSDK.init({
      chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
      network: "testnet",
      whitelistUrls: {
        "http://127.0.0.1:5173/": signature1,
      },
    });
    sdkRef.current = socialLoginSDK;
  }
  if (!sdkRef.current.provider) {
    sdkRef.current.showWallet();
    enableInterval(true);
  } else {
    setupSmartAccount();
  }
}
```

The `login` function is an asynchronous function that handles the login flow for the application. Here's a step-by-step explanation:

1. **SDK Initialization**: The function first checks if the `sdkRef` object (which is a reference to the Biconomy SDK instance) is null. If it is, it means that the SDK is not yet initialized. In this case, it creates a new instance of `SocialLogin` (a Biconomy SDK component), whitelists a local URL (`http://127.0.0.1:5173/`), and initializes the SDK with the Polygon Mumbai testnet configuration and the whitelisted URL. After initialization, it assigns the SDK instance to sdkRef.current.
2. **Provider Check**: After ensuring the SDK is initialized, the function checks if the provider of the `sdkRef` object is set. If it is not, it means the user is not yet logged in. It then shows the wallet interface for the user to login using `sdkRef.current.showWallet()`, and enables the interval by calling `enableInterval(true)`. This interval (setup in a useEffect hook elsewhere in the code) periodically checks if the provider is available and sets up the smart account once it is.
3. **Smart Account Setup**: If the provider of sdkRef is already set, it means the user is logged in. In this case, it directly sets up the smart account by calling `setupSmartAccount()`.

In summary, the `login` function handles the SDK initialization and login flow. It initializes the SDK if it's not already initialized, shows the wallet interface for the user to login if they're not logged in, and sets up the smart account if the user is logged in.

:::caution
It is important to make sure that you update the whitelist URL with your production url when you are ready to go live!
:::

Now lets actually set up the smart account:

```solidity
 async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return
    sdkRef.current.hideWallet()
    setLoading(true)
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    )
    setProvider(web3Provider)
    try {
      const smartAccount = new SmartAccount(web3Provider, {
        activeNetworkId: ChainId.POLYGON_MUMBAI,
        supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
        networkConfig: [
          {
            chainId: ChainId.POLYGON_MUMBAI,
            dappAPIKey: "your dapp api key from biconomy dashboard",
          },
        ],
      })
      await smartAccount.init()
      setSmartAccount(smartAccount)
      setLoading(false)
    } catch (err) {
      console.log('error setting up smart account... ', err)
    }
  }
```

The `setupSmartAccount` function is an asynchronous function used to initialize a smart account with Biconomy and connect it with the Web3 provider. Here's a step-by-step explanation of what it does:

1. **Check Provider Availability**: The function first checks if the provider of the `sdkRef` object is available. If not, it immediately returns and the rest of the function is not executed. The `sdkRef` object refers to the Biconomy SDK instance that was stored using the `useRef` React Hook.
2. **Hide Wallet**: If the provider is available, it hides the wallet interface using `sdkRef.current.hideWallet()`.
3. **Set Loading Status**: It then sets the loading state to `true` by calling `setLoading(true)`. This could be used in the UI to show a loading spinner or other loading indicators.
4. **Create Web3 Provider**: It creates a new Web3 provider using the `ethers` library and the provider from `sdkRef`. This provider is then saved in the state by calling `setProvider(web3Provider)`.
5. **Create and Initialize Smart Account**: It then creates a new `SmartAccount` object using the Web3 provider and a configuration object. This configuration object sets the active network to Polygon Mumbai, the supported networks, and the network configuration, including the chain ID and the Biconomy API key. After creating the smart account, it initializes it by calling `smartAccount.init()`. This is an asynchronous operation, hence the `await` keyword.
6. **Save Smart Account and Update Loading Status**: After the smart account is initialized, it is saved in the state by calling `setSmartAccount(smartAccount)`. The loading status is then set to `false` by calling `setLoading(false)`.
7. **Error Handling**: If any error occurs during the creation or initialization of the smart account, it is caught in the `catch` block and logged to the console.

So, in summary, the `setupSmartAccount` function checks the availability of the Biconomy provider, hides the wallet interface, sets up a Web3 provider, creates and initializes a smart account, and then saves this account and the Web3 provider in the state. If any error occurs during this process, it is logged to the console.

Finally our last function will be a logout function:

```js
const logout = async () => {
    if (!sdkRef.current) {
      console.error('Web3Modal not initialized.')
      return
    }
    await sdkRef.current.logout()
    sdkRef.current.hideWallet()
    setSmartAccount(null)
    enableInterval(false)
  }
```

The `logout` function is an asynchronous function that handles the logout flow for the application. Here's a breakdown of its functionality:

1. **Check SDK Initialization**: The function first checks if the `sdkRef` object (which is a reference to the Biconomy SDK instance) is null. If it is, it means that the SDK is not yet initialized. In this case, it logs an error message and returns immediately without executing the rest of the function.
2. **Logout and Hide Wallet**: If the SDK is initialized, it logs the user out by calling `sdkRef.current.logout()`. This is an asynchronous operation, hence the await keyword. It then hides the wallet interface by calling `sdkRef.current.hideWallet()`.
3. **Clear Smart Account and Interval**: After logging the user out and hiding the wallet, it clears the smart account by calling `setSmartAccount(null)`, and disables the interval by calling `enableInterval(false)`.

In summary, the logout function checks if the SDK is initialized, logs the user out and hides the wallet if it is, and then clears the smart account and disables the interval. If the SDK is not initialized, it logs an error message and does not execute the rest of the function.
