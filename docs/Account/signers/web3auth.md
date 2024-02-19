---
sidebar_label: "Web3Auth"
sidebar_position: 8
---

# Web3Auth

One way to utilize Social Logins is via Web3Auth. This section will illustrate you to create Biconomy Smart Accounts with the help of Web3Auth Signer. Web3Auth allows you to introduce familiar Web2 experiences, with the following code snippets you can unlock authentication with email to create a smart account as well as authentication with different social providers to create a Smart Account.

:::tip

Check out an end-to-end integration of Web3Auth with Biconomy on this [example app](https://aaweb3auth.vercel.app/) and [repo](https://github.com/bcnmy/biconomy_web3auth_example)!

:::

## Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add @biconomy/account @web3auth/modal @walletconnect/sign-client ethers@5.7.2
```

## Imports

```typescript
import {
  createSmartAccountClient,
  BiconomySmartAccountV2,
  PaymasterMode,
} from "@biconomy/account";
import { ethers } from "ethers";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
```

### Initialising Web3Auth

You will have to get the client ID from the [Web3Auth dashboard](https://dashboard.web3auth.io/login). You can use the following code snippet to initialize the Web3Auth.

Initialize the social login SDK

```typescript
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x13881",
  rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
  displayName: "Polygon Mumbai",
  blockExplorer: "https://mumbai.polygonscan.com/",
  ticker: "MATIC",
  tickerName: "Polygon Matic",
};

//Creating web3auth instance
const web3auth = new Web3Auth({
  clientId:
    "BExrkk4gXp86e9VCrpxpjQYvmojRSKHstPRczQA10UQM94S5FtsZcxx4Cg5zk58F7W1cAGNVx1-NPJCTFIzqdbs", // Get your Client ID from the Web3Auth Dashboard https://dashboard.web3auth.io/
  web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
  chainConfig,
  // You can visit web3auth.io/docs for more configuration options
  uiConfig: {
    appName: "Biconomy X Web3Auth",
    mode: "dark", // light, dark or auto
    loginMethodsOrder: ["apple", "google", "twitter"],
    logoLight: "https://web3auth.io/images/web3auth-logo.svg",
    logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
    defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
    loginGridCol: 3,
    primaryButton: "socialLogin", // "externalLogin" | "socialLogin" | "emailLogin"
  },
});
```

### Creating Web3Auth Signer

```typescript
await web3auth.initModal();
const web3authProvider = await web3auth.connect();
const ethersProvider = new ethers.providers.Web3Provider(
  web3authProvider as any
);
const web3AuthSigner = ethersProvider.getSigner();
```

### Creating Biconomy Smart Account

```typescript
const connect = async () => {
  try {
    const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x13881",
      rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
      displayName: "Polygon Mumbai",
      blockExplorer: "https://mumbai.polygonscan.com/",
      ticker: "MATIC",
      tickerName: "Polygon Matic",
    };

    //Creating web3auth instance
    const web3auth = new Web3Auth({
      clientId:
        "BExrkk4gXp86e9VCrpxpjQYvmojRSKHstPRczQA10UQM94S5FtsZcxx4Cg5zk58F7W1cAGNVx1-NPJCTFIzqdbs", // Get your Client ID from the Web3Auth Dashboard https://dashboard.web3auth.io/
      web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
      chainConfig,
      uiConfig: {
        appName: "Biconomy X Web3Auth",
        mode: "dark", // light, dark or auto
        loginMethodsOrder: ["apple", "google", "twitter"],
        logoLight: "https://web3auth.io/images/web3auth-logo.svg",
        logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
        defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
        loginGridCol: 3,
        primaryButton: "socialLogin", // "externalLogin" | "socialLogin" | "emailLogin"
      },
    });

    await web3auth.initModal();
    const web3authProvider = await web3auth.connect();
    const ethersProvider = new ethers.providers.Web3Provider(
      web3authProvider as any
    );
    const web3AuthSigner = ethersProvider.getSigner();

    const config = {
      biconomyPaymasterApiKey: "", // <-- Get your paymaster API key from https://dashboard.biconomy.io/paymaster
      bundlerUrl: "", // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
    };

    const smartWallet = await createSmartAccountClient({
      signer: web3AuthSigner,
      biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
      bundlerUrl: config.bundlerUrl,
      rpcUrl: "",
    });

    const address = await smartWallet.getAccountAddress();
  } catch (error) {
    console.error(error);
  }
};
```
