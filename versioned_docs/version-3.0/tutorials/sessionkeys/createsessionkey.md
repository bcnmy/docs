---
sidebar_label: "Create Session"
sidebar_position: 5
---

# Create Session

:::info
In this instance we are not sponsoring the transaction please ensure that you send mumbai matic to your smart account to pay for gas. You can get matic at any polygon faucet. Additionally you will need to send your smart account mumbai usdc from this contract address: 0xdA5289fCAAF71d52a80A254da614a192b693e977. You can swap mumbai matic for this token on Uniswap. You will not be able to execute this code unless your smart account has some mumbai matic and mumbai usdc.
:::

Let's set up the component we need to create our session!

## Setup Component

In the `src` folder create a new folder called `components`.

Create a new file called `CreateSession.tsx`

## Imports and Prop types

Let's add our imports to this file and create an interface for our props.

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { SessionKeyManagerModule, DEFAULT_SESSION_KEY_MANAGER_MODULE  } from "@biconomy-devx/modules";
import { BiconomySmartAccountV2 } from "@biconomy-devx/account"
import { defaultAbiCoder } from "ethers/lib/utils";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface props {
  smartAccount: BiconomySmartAccountV2;
  address: string;
  provider: ethers.providers.Provider;
}
```

Our component props will take the smart account instancs, the address, and provider.

The initial component should look like this:

```javascript

  const CreateSession: React.FC<props> = ({ smartAccount, address, provider }) => {

  return (
    <div>
    </div>

  )
}

export default CreateSession;

```

You can go ahead an import it into your index.tsx at this point as well and add it before the closing main tag like this:

```javascript
{
  smartAccount && provider && (
    <CreateSession
      smartAccount={smartAccount}
      address={address}
      provider={provider}
    />
  );
}
```

We only want it to render when the smartAccount and provider are both available.

Continuing with the session key component let's create our state variables:

## Check if Session is enabled

```javascript
const [isSessionKeyModuleEnabled, setIsSessionKeyModuleEnabled] =
  useState < boolean > false;
const [isSessionActive, setIsSessionActive] = useState < boolean > false;
```

We're going to be tracking if the session key module is enabled and if there is an active session.

In a `useEffect` hook let's write the following code:

```javascript

 useEffect(() => {
    let checkSessionModuleEnabled = async () => {
      if(!address || !smartAccount || !provider) {
        setIsSessionKeyModuleEnabled(false);
        return
      }
      try {
        const isEnabled = await smartAccount.isModuleEnabled(DEFAULT_SESSION_KEY_MANAGER_MODULE)
        console.log("isSessionKeyModuleEnabled", isEnabled);
        setIsSessionKeyModuleEnabled(isEnabled);
        return;
      } catch(err: any) {
        console.error(err)
        setIsSessionKeyModuleEnabled(false);
        return;
      }
    }
    checkSessionModuleEnabled()
  },[isSessionKeyModuleEnabled, address, smartAccount, provider])

```

This will check if a session module is enabled - it will return if we do not have an address, smart Account, or provider and will then enable the module for our smartAccount if needed.

## Creating Session

Now let's set up the function for creating the session:

```javascript

  const createSession = async (enableSessionKeyModule: boolean) => {
    toast.info('Creating Session...', {
      position: "top-right",
      autoClose: 15000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
    if (!address || !smartAccount || !provider) {
      alert("Please connect wallet first")
    }
    try {
      const erc20ModuleAddr = "0x000000D50C68705bd6897B2d17c7de32FB519fDA"
      // -----> setMerkle tree tx flow
      // create dapp side session key
      const sessionSigner = ethers.Wallet.createRandom();
      const sessionKeyEOA = await sessionSigner.getAddress();
      console.log("sessionKeyEOA", sessionKeyEOA);
      // BREWARE JUST FOR DEMO: update local storage with session key
      window.localStorage.setItem("sessionPKey", sessionSigner.privateKey);

      // generate sessionModule
      const sessionModule = await SessionKeyManagerModule.create({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: address,
      });

      // cretae session key data
      const sessionKeyData = defaultAbiCoder.encode(
        ["address", "address", "address", "uint256"],
        [
          sessionKeyEOA,
          "0xdA5289fCAAF71d52a80A254da614a192b693e977", // erc20 token address
          "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD", // receiver address
          ethers.utils.parseUnits("50".toString(), 6).toHexString(), // 50 usdc amount
        ]
      );

      const sessionTxData = await sessionModule.createSessionData([
        {
          validUntil: 0,
          validAfter: 0,
          sessionValidationModule: erc20ModuleAddr,
          sessionPublicKey: sessionKeyEOA,
          sessionKeyData: sessionKeyData,
        },
      ]);
      console.log("sessionTxData", sessionTxData);

      // tx to set session key
      const setSessiontrx = {
        to: DEFAULT_SESSION_KEY_MANAGER_MODULE, // session manager module address
        data: sessionTxData.data,
      };

      const transactionArray = [];

      if (enableSessionKeyModule) {
        // -----> enableModule session manager module
        const enableModuleTrx = await smartAccount.getEnableModuleData(
          DEFAULT_SESSION_KEY_MANAGER_MODULE
        );
        transactionArray.push(enableModuleTrx);
      }

      transactionArray.push(setSessiontrx)

      let partialUserOp = await smartAccount.buildUserOp(transactionArray);

      const userOpResponse = await smartAccount.sendUserOp(
        partialUserOp
      );
      console.log(`userOp Hash: ${userOpResponse.userOpHash}`);
      const transactionDetails = await userOpResponse.wait();
      console.log("txHash", transactionDetails.receipt.transactionHash);
      setIsSessionActive(true)
      toast.success(`Success! Session created succesfully`, {
        position: "top-right",
        autoClose: 18000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    } catch(err: any) {
      console.error(err)
    }
  }

```

Let's break down this function:

We're using the react-toastify package for a little bit of UX feedback to the user letting them know that a session is being created and doing our checks to make sure that address, smart account, and provider are defined.

Next we specify the erc20ModuleAddr - this is the deployed contract we went over in the second part of this tutorial. Next we use the ethers npm package to generate a random wallet and get its address - this is the session key EOA which will have permission to sign on our behalf so we won't have to in the future.

```javascript
// BREWARE JUST FOR DEMO: update local storage with session key
window.localStorage.setItem("sessionPKey", sessionSigner.privateKey);
```

Now just for the sake of this demo we will save the private key of the session to local storage. You will need to consider the trade offs of doing this in different ways. Saving to local storage leaves the responsibility to the user to not install any malicious packages or extensions that could read the private key from storage. If you encrypt and save it to a database you will have access to the private key. You will need to consider what the best course of action is for your use case.

```javascript
// generate sessionModule
const sessionModule = await SessionKeyManagerModule.create({
  moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
  smartAccountAddress: address,
});
```

We will now use the Session Key Manager Module to create a session module using the module address and smart account address. This is an important relationship to establish - the module provided by the SDK gives you an easy way to interact with modules you write on a smart contract with whatever arbitrary validation logic you need.

```javascript
// create session key data
const sessionKeyData = defaultAbiCoder.encode(
  ["address", "address", "address", "uint256"],
  [
    sessionKeyEOA,
    "0xdA5289fCAAF71d52a80A254da614a192b693e977", // erc20 token address
    "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD", // receiver address
    ethers.utils.parseUnits("50".toString(), 6).toHexString(), // 50 usdc amount
  ],
);
```

Next we create the session key data - if you recall from the smart contract it needs four pieces of data - the session key address, the token address (in this case we are using USDC on Polygon Mumbai), specifying a reciever address that needs to be the one we send funds to, and specifying a maximum amount of funds we can send. In this case that is no more than 50 usdc.

```javascript
const sessionTxData = await sessionModule.createSessionData([
  {
    validUntil: 0,
    validAfter: 0,
    sessionValidationModule: erc20ModuleAddr,
    sessionPublicKey: sessionKeyEOA,
    sessionKeyData: sessionKeyData,
  },
]);
console.log("sessionTxData", sessionTxData);
```

Now we create the session data itself. We specify how long this should be valid until or how long it is valid after. This should be a unix timestamp to represent the time. Passing 0 on both makes this session never expire, do not do this in production. Next we pass the module address, session key address, and pass the session key data we just created.

```javascript
// tx to set session key
const setSessiontrx = {
  to: DEFAULT_SESSION_KEY_MANAGER_MODULE, // session manager module address
  data: sessionTxData.data,
};

const transactionArray = [];
```

Now we construct the transaction to actually set the session key and create an array where our transactions will be placed.

```javascript
if (enableSessionKeyModule) {
  // -----> enableModule session manager module
  const enableModuleTrx = await smartAccount.getEnableModuleData(
    DEFAULT_SESSION_KEY_MANAGER_MODULE,
  );
  transactionArray.push(enableModuleTrx);
}

transactionArray.push(setSessiontrx);

let partialUserOp = await smartAccount.buildUserOp(transactionArray);

const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
console.log(`userOp Hash: ${userOpResponse.userOpHash}`);
const transactionDetails = await userOpResponse.wait();
console.log("txHash", transactionDetails.receipt.transactionHash);
setIsSessionActive(true);
toast.success(`Success! Session created succesfully`, {
  position: "top-right",
  autoClose: 18000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
});
```

Finally if we need to enable session key module we create a transactione here as well using the getEnableModuleData and pass the session key manager module address and push this to the array. Additionally we push the session transaction to the array as well, we will be batching these transactions together.

Next we will build a userOp and use the smart account to send it to Bundler. Don't forget to check the Info box at the top of this page before executing this code!

On success we'll show a nice toast to the user letting them know all is well.

Update your jsx to now look like this:

```javascript
<div>
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
  />
  {isSessionKeyModuleEnabled ? (
    <button onClick={() => createSession(false)}>Create Session</button>
  ) : (
    <button onClick={() => createSession(true)}>
      Enable and Create Session
    </button>
  )}
</div>
```

Now with this implemented let's take a look at executing the ERC20 token transfer with a session in the next section.
