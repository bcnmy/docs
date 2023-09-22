---
sidebar_label: 'Gasless Transactions'
sidebar_position: 2
---

# Gasless Transactions

:::info
This guide assumes you have already initialized the Biconomy SDK and just need to understand how to execute a user paid transaction. See our [tutorials](/docs/category/tutorials) for step by step setups. 
:::

In this guide we will look at executing a gasless transaction utilizing our sponsorship paymaster.

## Imports

These are the imports needed for the code snippets below: 

```javascript

import { ethers } from "ethers";
import abi from "some abi location"
import { 
  IHybridPaymaster, 
  SponsorUserOperationDto,
  PaymasterMode
} from '@biconomy/paymaster'

```

Additionally an Instance of the BiconomySmartAccount is needed as mentioned above.

## Connect to Contract

Connect to an instance of a contract, below is an example of using ethers JS to connect to an NFT contract.

```javascript

const nftAddress = "0x0a7755bDfb86109D9D403005741b415765EAf1Bc"

const contract = new ethers.Contract(
      nftAddress,
      abi,
      provider,
    )

```

## Build Useroperation

Using an instance of the smart account use the buildUserOp method to create a userOp. 

```javascript
  
  // use the ethers populateTransaction method to create a raw transaction
  const minTx = await contract.populateTransaction.safeMint(address);
  console.log(minTx.data);
  const tx1 = {
    to: nftAddress,
    data: minTx.data,
  };
  let userOp = await smartAccount.buildUserOp([tx1]);

```

## Request Paymaster Data

We now need to construct the `paymasterAndData` field of our userOp. This is done by making a request to the paymaster with the Paymaster mode set to sponsored and updating the userOp with the returned `paymasterAndData` response. 

```javascript

  const biconomyPaymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
      };
      const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        ); 
      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

```

## Send UserOperation

Send your userOp to our Bundler which will send the userOp to the entry point contract to handle executing it as a transaction on chain. 

```javascript

const userOpResponse = await smartAccount.sendUserOp(userOp);
  console.log("userOpHash", userOpResponse);
  const { receipt } = await userOpResponse.wait(1);
  console.log("txHash", receipt.transactionHash);

```

## Mint NFT Function

```javascript

 const handleMint = async () => {
    const contract = new ethers.Contract(
      nftAddress,
      abi,
      provider,
    )
    try {
      const minTx = await contract.populateTransaction.safeMint(address);
      console.log(minTx.data);
      const tx1 = {
        to: nftAddress,
        data: minTx.data,
      };
      let userOp = await smartAccount.buildUserOp([tx1]);
      console.log({ userOp })
      const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
      };
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );
        
      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
    } catch (err: any) {
      console.error(err);
      console.log(err)
    }
  }

```