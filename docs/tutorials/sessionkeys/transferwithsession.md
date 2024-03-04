---
sidebar_label: "Transfer ERC20 With Session"
sidebar_position: 6
---

# Transfer ERC20 With Session

:::info
In this instance we are not sponsoring the transaction please ensure that you send mumbai matic to your smart account to pay for gas. You can get matic at any polygon faucet. Additionally you will need to send your smart account mumbai usdc from this contract address: 0xdA5289fCAAF71d52a80A254da614a192b693e977. You can swap mumbai matic for this token on Uniswap. You will not be able to execute this code unless your smart account has some mumbai matic and mumbai usdc.
:::

Now the final part of this tutorial. Executing a transfer using a session!

## Create new component

Let's Create a new component called `ERC20Transfer.tsx` and place it in the components folder.

The imports and props will be as follows:

```typescript

import React from "react";
import { ethers } from "ethers";
import { BiconomySmartAccountV2, DEFAULT_SESSION_KEY_MANAGER_MODULE, createSessionKeyManagerModule } from "@biconomy/account"
import usdcAbi from "@/utils/usdcAbi.json"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface props {
  smartAccount: BiconomySmartAccountV2;
  provider: ethers.providers.Provider;
  address: string;
}

```

Let's create the inital component:

```typescript

const ERC20Transfer: React.FC<props> = ({ smartAccount, provider, address}) => {
  return(
    <button>Transfer 1 USDC</button>
  )
}

export default ERC20Transfer;

```

This is going to be a basic button that simply transfers 1 USDC to a recipient. You can go ahead and import this component now into your Create Session component. It should look like this at the bottom of your Create Session component:

```typescript
{
  isSessionActive && (
    <ERC20Transfer
      smartAccount={smartAccount}
      provider={provider}
      address={address}
    />
  );
}
```

## Create transfer function

Let's create the function now to handle the transfer:

```typescript

 const erc20Transfer = async () => {
    if (!address || !smartAccount || !address) {
      alert("Please connect wallet first");
      return;
    }
    try {
      toast.info('Transferring 1 USDC to recipient...', {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      const erc20ModuleAddr = "0x000000D50C68705bd6897B2d17c7de32FB519fDA";
      // get session key from local storage
      const sessionKeyPrivKey = window.localStorage.getItem("sessionPKey");
      console.log("sessionKeyPrivKey", sessionKeyPrivKey);
      if (!sessionKeyPrivKey) {
        alert("Session key not found please create session");
        return;
      }
      const sessionSigner = new ethers.Wallet(sessionKeyPrivKey);
      console.log("sessionSigner", sessionSigner);

      // generate sessionModule
      const sessionModule = await createSessionKeyManagerModule({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: address,
      });

      // set active module to sessionModule
      smartAccount = smartAccount.setActiveValidationModule(sessionModule);

      const tokenContract = new ethers.Contract(
        // polygon mumbai usdc address
        "0xdA5289fCAAF71d52a80A254da614a192b693e977",
        usdcAbi,
        provider
      );
      let decimals = 18;

      try {
        decimals = await tokenContract.decimals();
      } catch (error) {
        throw new Error("invalid token address supplied");
      }

      const { data } = await tokenContract.populateTransaction.transfer(
        "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD", // receiver address
        ethers.utils.parseUnits("1".toString(), decimals)
      );

      // generate tx data to erc20 transfer
      const tx1 = {
        to: "0xdA5289fCAAF71d52a80A254da614a192b693e977", //erc20 token address
        data: data,
        value: "0",
      };

      // This will build the tx into a user op and send it.
      let userOpResponse = await smartAccount.sendTransaction(tx1, {
        params: {
          sessionSigner: sessionSigner,
          sessionValidationModule: erc20ModuleAddr,
        },
      });

      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
      const polygonScanlink = `https://mumbai.polygonscan.com/tx/${receipt.transactionHash}`
      toast.success(<a target="_blank" href={polygonScanlink}>Success Click to view transaction</a>, {
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
      console.error(err);
    }
  }

```

Now simply add this method to the onClick event ofour button 

```
return(
    <button onClick={() => erc20Transfer}>Batch Transfer 1 USDC</button>
  )
```

Let's break down this code:

```typescript
if (!address || !smartAccount || !address) {
  alert("Please connect wallet first");
  return;
}
```

First we check to make sure our props all exist.

```typescript
toast.info("Transferring 1 USDC to recipient...", {
  position: "top-right",
  autoClose: 15000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
});
```

We update the user that a transfer is about to start

```typescript
const erc20ModuleAddr = "0x000000D50C68705bd6897B2d17c7de32FB519fDA";
// get session key from local storage
const sessionKeyPrivKey = window.localStorage.getItem("sessionPKey");
console.log("sessionKeyPrivKey", sessionKeyPrivKey);
if (!sessionKeyPrivKey) {
  alert("Session key not found please create session");
  return;
}
const sessionSigner = new ethers.Wallet(sessionKeyPrivKey);
console.log("sessionSigner", sessionSigner);
```

We specify the erc20 module address and get the private key we stored in local storage and create a new session signer from it.

```typescript
// generate sessionModule
const sessionModule = await createSessionKeyManagerModule({
  moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
  smartAccountAddress: address,
});

// set active module to sessionModule
smartAccount = smartAccount.setActiveValidationModule(sessionModule);
```

Now we'll generate a session module using the Session Key Manager Module and then set the active validation module to be the session module. This updates the original configureation on the smart account.

```typescript
const tokenContract = new ethers.Contract(
  // polygon mumbai usdc address
  "0xdA5289fCAAF71d52a80A254da614a192b693e977",
  usdcAbi,
  provider,
);
let decimals = 18;

try {
  decimals = await tokenContract.decimals();
} catch (error) {
  throw new Error("invalid token address supplied");
}
```

We now create an instance of the contract. Note that USDC does not have 18 decimals so we update the decimals based on the USDC contract.

```typescript
const { data } = await tokenContract.populateTransaction.transfer(
  "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD", // receiver address
  ethers.utils.parseUnits("1".toString(), decimals),
);
```

Now we will get raw transaction data for a transfer of 1 usdc to the receiver address we specified. Using any other reciever other than the one registered on the session key will result in an error. We are sending 1 USDC in this case but can send up to 50 with this transaction as that is the maximum amount that we specified.

```typescript
// generate tx data to erc20 transfer
const tx1 = {
  to: "0xdA5289fCAAF71d52a80A254da614a192b693e977", //erc20 token address
  data: data,
  value: "0",
};

// This will build the tx into a user op and send it.
let userOpResponse = await smartAccount.sendTransaction(tx1, {
  params: {
    sessionSigner: sessionSigner,
    sessionValidationModule: erc20ModuleAddr,
  },
});
```

Now we build the user op and send it for execution. Note the additional arguments you can add in the `buildUserOp` method such as overrides if needed, ability to skip bundler gas estimations, and most importantly params object that will contain information about the session signer and session validation module.

```typescript
console.log("userOpHash", userOpResponse);
const { receipt } = await userOpResponse.wait(1);
console.log("txHash", receipt.transactionHash);
const polygonScanlink = `https://mumbai.polygonscan.com/tx/${receipt.transactionHash}`;
toast.success(
  <a target="_blank" href={polygonScanlink}>
    Success Click to view transaction
  </a>,
  {
    position: "top-right",
    autoClose: 18000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  },
);
```

Congrats! you have successfully integrated the session module. Expand the code below to see the entire code:
<details>
```typescript
import React from "react";
import { ethers } from "ethers";
import { BiconomySmartAccountV2, DEFAULT_SESSION_KEY_MANAGER_MODULE, createSessionKeyManagerModule } from "@biconomy/account"
import usdcAbi from "@/utils/usdcAbi.json"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface props {
  smartAccount: BiconomySmartAccountV2;
  provider: ethers.providers.Provider;
  address: string;
}

const ERC20Transfer: React.FC<props> = ({ smartAccount, provider, address}) => {


 const erc20Transfer = async () => {
  if (!address || !smartAccount || !address) {
    alert("Please connect wallet first");
    return;
  }
  try {
    toast.info('Transferring 1 USDC to recipient...', {
      position: "top-right",
      autoClose: 15000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
    const erc20ModuleAddr = "0x000000D50C68705bd6897B2d17c7de32FB519fDA";
    // get session key from local storage
    const sessionKeyPrivKey = window.localStorage.getItem("sessionPKey");
    console.log("sessionKeyPrivKey", sessionKeyPrivKey);
    if (!sessionKeyPrivKey) {
      alert("Session key not found please create session");
      return;
    }
    const sessionSigner = new ethers.Wallet(sessionKeyPrivKey);
    console.log("sessionSigner", sessionSigner);

    // generate sessionModule
    const sessionModule = await createSessionKeyManagerModule({
      moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
      smartAccountAddress: address,
    });

    // set active module to sessionModule
    smartAccount = smartAccount.setActiveValidationModule(sessionModule);

    const tokenContract = new ethers.Contract(
      // polygon mumbai usdc address
      "0xdA5289fCAAF71d52a80A254da614a192b693e977",
      usdcAbi,
      provider
    );
    let decimals = 18;

    try {
      decimals = await tokenContract.decimals();
    } catch (error) {
      throw new Error("invalid token address supplied");
    }

    const { data } = await tokenContract.populateTransaction.transfer(
      "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD", // receiver address
      ethers.utils.parseUnits("1".toString(), decimals)
    );

    // generate tx data to erc20 transfer
    const tx1 = {
      to: "0xdA5289fCAAF71d52a80A254da614a192b693e977", //erc20 token address
      data: data,
      value: "0",
    };

    // This will build the tx into a user op and send it.
    let userOpResponse = await smartAccount.sendTransaction(tx1, {
      params: {
        sessionSigner: sessionSigner,
        sessionValidationModule: erc20ModuleAddr,
      },
    });

    console.log("userOpHash", userOpResponse);
    const { receipt } = await userOpResponse.wait(1);
    console.log("txHash", receipt.transactionHash);
    const polygonScanlink = `https://mumbai.polygonscan.com/tx/${receipt.transactionHash}`
    toast.success(<a target="_blank" href={polygonScanlink}>Success Click to view transaction</a>, {
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
    console.error(err);
  }
 }

  return(
    <button>Transfer 1 USDC</button>
  )
}

export default ERC20Transfer;
```
</details>

Finally to give the user a succesful feedback we provide them with a link to the transaction once it has been executed.

Running this code should now allow you to sign in using your EOA, create a session, and then send USDC without the need to sign any further transactions!
