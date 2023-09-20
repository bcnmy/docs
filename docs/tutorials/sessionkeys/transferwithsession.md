---
sidebar_label: 'Transfer ERC20 With Session'
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

```javascript

import React from "react";
import { ethers } from "ethers";
import { SessionKeyManagerModule } from "@biconomy-devx/modules";
import { BiconomySmartAccountV2 } from "@biconomy-devx/account"
import { DEFAULT_SESSION_KEY_MANAGER_MODULE  } from "@biconomy-devx/modules";
import usdcAbi from "@/utils/usdcAbi.json"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface props {
  smartAccount: BiconomySmartAccountV2;
  provider: ethers.providers.Provider;
  address: string;
}

```

Let's create the inital component: 

```javascript

const ERC20Transfer: React.FC<props> = ({ smartAccount, provider, address}) => {
  return(
    <button>Transfer 1 USDC</button>
  )
}

export default ERC20Transfer;

```

This is going to be a basic button that simply transfers 1 USDC to a recipient. You can go ahead and import this component now into your Create Session component. It should look like this at the bottom of your Create Session component: 

```javascript

{isSessionActive && <ERC20Transfer smartAccount={smartAccount} provider={provider} address={address} />}

```
## Create transfer function 

Let's create the function now to handle the transfer: 

```javascript

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
      const sessionModule = await SessionKeyManagerModule.create({
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

      // build user op
      let userOp = await smartAccount.buildUserOp([tx1], {
        overrides: {
          // signature: "0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000456b395c4e107e0302553b90d1ef4a32e9000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000db3d753a1da5a6074a9f74f39a0a779d3300000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000bfe121a6dcf92c49f6c2ebd4f306ba0ba0ab6f1c000000000000000000000000da5289fcaaf71d52a80a254da614a192b693e97700000000000000000000000042138576848e839827585a3539305774d36b96020000000000000000000000000000000000000000000000000000000002faf08000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041feefc797ef9e9d8a6a41266a85ddf5f85c8f2a3d2654b10b415d348b150dabe82d34002240162ed7f6b7ffbc40162b10e62c3e35175975e43659654697caebfe1c00000000000000000000000000000000000000000000000000000000000000"
          // callGasLimit: 2000000, // only if undeployed account
          // verificationGasLimit: 700000
        },
        skipBundlerGasEstimation: false,
        params: {
          sessionSigner: sessionSigner,
          sessionValidationModule: erc20ModuleAddr,
        },
      });

      // send user op
      const userOpResponse = await smartAccount.sendUserOp(userOp, {
        sessionSigner: sessionSigner,
        sessionValidationModule: erc20ModuleAddr,
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

Let's break down this code: 

```javascript

  if (!address || !smartAccount || !address) {
      alert("Please connect wallet first");
      return;
    }

```

First we check to make sure our props all exist.

```javascript

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

```

We update the user that a transfer is about to start

```javascript

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

```javascript

      // generate sessionModule
      const sessionModule = await SessionKeyManagerModule.create({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: address,
      });

      // set active module to sessionModule
      smartAccount = smartAccount.setActiveValidationModule(sessionModule);

```

Now we'll generate a session module using the Session Key Manager Module and then set the active validation module to be the session module. This updates the original configureation on the smart account.

```javascript

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

```

We now create an instance of the contract. Note that USDC does not have 18 decimals so we update the decimals based on the USDC contract. 

```javascript

const { data } = await tokenContract.populateTransaction.transfer(
        "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD", // receiver address
        ethers.utils.parseUnits("1".toString(), decimals)
      );

```

Now we will get raw transaction data for a transfer of 1 usdc to the receiver address we specified. Using any other reciever other than the one registered on the session key will result in an error. We are sending 1 USDC in this case but can send up to 50 with this transaction as that is the maximum amount that we specified. 

```javascript

  // generate tx data to erc20 transfer
      const tx1 = {
        to: "0xdA5289fCAAF71d52a80A254da614a192b693e977", //erc20 token address
        data: data,
        value: "0",
      };

      // build user op
      let userOp = await smartAccount.buildUserOp([tx1], {
        overrides: {
          // signature: "0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000456b395c4e107e0302553b90d1ef4a32e9000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000db3d753a1da5a6074a9f74f39a0a779d3300000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000bfe121a6dcf92c49f6c2ebd4f306ba0ba0ab6f1c000000000000000000000000da5289fcaaf71d52a80a254da614a192b693e97700000000000000000000000042138576848e839827585a3539305774d36b96020000000000000000000000000000000000000000000000000000000002faf08000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041feefc797ef9e9d8a6a41266a85ddf5f85c8f2a3d2654b10b415d348b150dabe82d34002240162ed7f6b7ffbc40162b10e62c3e35175975e43659654697caebfe1c00000000000000000000000000000000000000000000000000000000000000"
          // callGasLimit: 2000000, // only if undeployed account
          // verificationGasLimit: 700000
        },
        skipBundlerGasEstimation: false,
        params: {
          sessionSigner: sessionSigner,
          sessionValidationModule: erc20ModuleAddr,
        },
      });

      // send user op
      const userOpResponse = await smartAccount.sendUserOp(userOp, {
        sessionSigner: sessionSigner,
        sessionValidationModule: erc20ModuleAddr,
      });

```

Now we build the user op and send it for execution. Note the additional arguments you can add in the `buildUserOp` method such as overrides if needed, ability to skip bundler gas estimations, and most importantly params object that will contain information about the session signer and session validation module. 

```javascript

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

```

Finaly to give the user a succesful feedback we provide them with a link to the transaction once it has been executed. 

Running this code should now allow you to sign in using your EOA, create a session, and then send USDC without the need to sign any further transactions!