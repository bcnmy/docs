---
sidebar_position: 5
---

# SDK Integration

Now let's get to work on our App.tsx file!

First lets update some of our imports. I've changed the initial imports to the
following:

```js
import "./App.css";
import "@biconomy/web3-auth/dist/src/style.css";
import { useState, useEffect, useRef } from "react";
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { ethers } from 'ethers'
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { IPaymaster, BiconomyPaymaster,} from '@biconomy/paymaster'
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE, } from "@biconomy/modules";
import Counter from './Components/Counter';
```

We are importing some css styles here but you can build your own login UI as
well if needed.

Here is information about the rest of the imports:

-   `useState`, `useEffect`, `useRef`: React hooks for managing component state
    and lifecycle.
-   `SocialLogin` from `@biconomy/web3-auth`: A class from Biconomy SDK that
    allows you to leverage Web3Auth for social logins.
-   ChainId from `@biconomy/core-types`: An enumeration of supported blockchain
    networks.
-   `ethers`: A library for interacting with Ethereum.
-   `Ibundler`and `bundler` will take UserOperations included in a mempool and
    and handle sending them to an entry point contract to be executed as a
    transaction onchain.
-   `BiconomySmartAccount`,`BiconomySmartAccountConfig`,
    `DEFAULT_ENTRYPOINT_ADDRESS` from `@biconomy/account` to handle the
    configuration and methods of smart accounts
-   `IPaymaster` and `Paymaster` will be used to sponsor gas fees for an
    account, provided specific predefined conditions are satisfied.
-   `ECDSAOwnershipValidationModule`, and `DEFAULT_ECDSA_OWNERSHIP_MODULE,` to handle
    the ECDSA Validation Signature for generating the smart accounts.  

Now, let's setup our paymaster and bundler :

```js
const bundler: IBundler = new Bundler({
    bundlerUrl:
        "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl:
        "https://paymaster.biconomy.io/api/v1/80001/[YOUR_API_KEY_HERE]",
});
```

:::info You can get your Paymaster URL and bundler URL from Biconomy Dashboard.
Follow the steps mentioned
[here](https://docs.biconomy.io/docs/category/biconomy-dashboard). :::

Let's take a look at some state variables that will help us with our
implementation:

```js
const [smartAccount, setSmartAccount] = useState < any > null;
const [interval, enableInterval] = useState(false);
const sdkRef = (useRef < SocialLogin) | (null > null);
const [loading, setLoading] = useState < boolean > false;
const [provider, setProvider] = useState < any > null;
```

Here we have some state that will be used to track our smart account that will
be generated with the sdk, an interval that will help us with checking for login
status, a loading state, provider state to track our web3 provider and a
reference to our Social login sdk.

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

This use effect will be triggered after we open our login component, which we'll
create a function for shortly. Once a user opens the component it will check if
a provider is available and run the functions for setting up the smart account.

Now let's build our login function:

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

The `login` function is an asynchronous function that handles the login flow for
the application. Here's a step-by-step explanation:

1. **SDK Initialization**: The function first checks if the `sdkRef` object
   (which is a reference to the Biconomy SDK instance) is null. If it is, it
   means that the SDK is not yet initialized. In this case, it creates a new
   instance of `SocialLogin` (a Biconomy SDK component), whitelists a local URL
   (`http://127.0.0.1:5173/`), and initializes the SDK with the Polygon Mumbai
   testnet configuration and the whitelisted URL. After initialization, it
   assigns the SDK instance to sdkRef.current.
2. **Provider Check**: After ensuring the SDK is initialized, the function
   checks if the provider of the `sdkRef` object is set. If it is not, it means
   the user is not yet logged in. It then shows the wallet interface for the
   user to login using `sdkRef.current.showWallet()`, and enables the interval
   by calling `enableInterval(true)`. This interval (setup in a useEffect hook
   elsewhere in the code) periodically checks if the provider is available and
   sets up the smart account once it is.
3. **Smart Account Setup**: If the provider of sdkRef is already set, it means
   the user is logged in. In this case, it directly sets up the smart account by
   calling `setupSmartAccount()`.

In summary, the `login` function handles the SDK initialization and login flow.
It initializes the SDK if it's not already initialized, shows the wallet
interface for the user to login if they're not logged in, and sets up the smart
account if the user is logged in.

:::

:::caution

It is important to make sure that you update the whitelist URL with your
production url when you are ready to go live!

:::

Now lets actually set up the smart account:

```js
async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return;
    sdkRef.current.hideWallet();
    setLoading(true);
    const web3Provider = new ethers.providers.Web3Provider(
        sdkRef.current.provider
    );
    setProvider(web3Provider);

     const module = await ECDSAOwnershipValidationModule.create({
        signer: web3Provider.getSigner(),
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
    });

    try {
      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler, 
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: module,
        activeValidationModule: module
      })
      console.log("address: ", await biconomySmartAccount.getAccountAddress())
      console.log("deployed: ", await biconomySmartAccount.isAccountDeployed(smartAccount.accountAddress))

      setSmartAccount(biconomySmartAccount)
      setLoading(false)
    } catch (err) {
        console.log("error setting up smart account... ", err);
    }
}
```

The `setupSmartAccount` function is an asynchronous function used to initialize
a smart account with Biconomy and connect it with the Web3 provider. Here's a
step-by-step explanation of what it does:

1. **if `(!sdkRef?.current?.provider) return:`** Checks if the sdkRef object
   exists, and if it does, whether it has a provider property. If either of
   these conditions is not met, the function returns early and does not proceed
   further.

2. **`sdkRef.current.hideWallet():`** Line calls the hideWallet() method on the
   sdkRef.current object. It appears to be a method provided by the sdkRef
   object, and it is likely used to hide the wallet or authentication interface
   for the user.

3. **`setLoading(true):`** Sets the state variable loading to true. It seems
   like loading is used to indicate that some asynchronous operation is in
   progress, and the UI might display a loading indicator during this time.

4. **`const web3Provider `= new
   ethers.providers.Web3Provider(sdkRef.current.provider):** Creates a new
   Web3Provider instance using the sdkRef.current.provider as the Web3 provider.
   It assumes that sdkRef.current.provider is a valid Web3 provider, possibly
   obtained from Biconomy's SDK.

5. **`setProvider(web3Provider):`** Sets the web3Provider created in the
   previous step as the state variable provider. This step likely enables other
   parts of the application to access the Web3 provider.

**Setting up BiconomySmartAccount:**

6. **`BiconomySmartAccountV2.create()`**
   Creates an instance of the BiconomySmartAccount. The configuration includes the following properties:

-   `signer:` The signer (wallet) associated with the web3Provider.
-   `chainId:` The chain ID, which is set to ChainId.POLYGON_MUMBAI. This
    specifies the blockchain network where the BiconomySmartAccount is being
    used (Polygon Mumbai, in this case).
-   `bundler:` The bundler used for optimizing and bundling smart contracts. It
    is expected that the bundler variable is defined elsewhere in the code.
-   `paymaster:` The paymaster used for handling payment processing. It is
    expected that the paymaster variable is defined elsewhere in the code.

7. Logging `BiconomySmartAccount` information:

-   **console.log("owner: ", biconomySmartAccount.owner):** Logs the owner of
    the BiconomySmartAccount. The owner property might represent the Ethereum
    address of the smart account owner.

-   **console.log("address: ", await
    biconomySmartAccount.getAccountAddress()):** Logs the Ethereum address
    of the BiconomySmartAccount using the getAccountAddress() method. This
    address is the entrypoint address mentioned earlier, and it serves as the
    point of entry for interacting with the smart account through Biconomy.

-   **`console.log("deployed: ", await biconomySmartAccount.isAccountDeployed(await biconomySmartAccount.getAccountAddress()))`:**
    Logs whether the smart account has been deployed or not. It calls the
    isAccountDeployed() method on the BiconomySmartAccount instance, passing the
    entrypoint address as an argument.

8. **`setSmartAccount(biconomySmartAccount)`:** Sets the biconomySmartAccount as
   the state variable smartAccount. This step makes the BiconomySmartAccount
   instance available to other parts of the application.

9. **`setLoading(false):`** Sets the state variable loading to false, indicating
   that the asynchronous operation is complete.

10. **Error handling:** If any errors occur during the execution of the
    function, the catch block will catch the error, and it will be logged to the
    console.

So, in summary, the `setupSmartAccount` function checks the availability of the
Biconomy provider, hides the wallet interface, sets up a Web3 provider, creates
and initializes a smart account, and then saves this account and the Web3
provider in the state. If any error occurs during this process, it is logged to
the console.

Finally our last function will be a logout function:

```js
const logout = async () => {
    if (!sdkRef.current) {
        console.error("Web3Modal not initialized.");
        return;
    }
    await sdkRef.current.logout();
    sdkRef.current.hideWallet();
    setSmartAccount(null);
    enableInterval(false);
};
```

The `logout` function is an asynchronous function that handles the logout flow
for the application. Here's a breakdown of its functionality:

1. **Check SDK Initialization**: The function first checks if the `sdkRef`
   object (which is a reference to the Biconomy SDK instance) is null. If it is,
   it means that the SDK is not yet initialized. In this case, it logs an error
   message and returns immediately without executing the rest of the function.
2. **Logout and Hide Wallet**: If the SDK is initialized, it logs the user out
   by calling `sdkRef.current.logout()`. This is an asynchronous operation,
   hence the await keyword. It then hides the wallet interface by calling
   `sdkRef.current.hideWallet()`.
3. **Clear Smart Account and Interval**: After logging the user out and hiding
   the wallet, it clears the smart account by calling `setSmartAccount(null)`,
   and disables the interval by calling `enableInterval(false)`.

In summary, the logout function checks if the SDK is initialized, logs the user
out and hides the wallet if it is, and then clears the smart account and
disables the interval. If the SDK is not initialized, it logs an error message
and does not execute the rest of the function.

