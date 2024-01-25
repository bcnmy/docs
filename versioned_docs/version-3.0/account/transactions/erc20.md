---
sidebar_label: "Pay Gas with ERC20 Tokens"
sidebar_position: 3
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/Account/transactions/erc20.md
---

# Pay gas with ERC20 Tokens

In this guide we will look at executing a transaction and allowing the user to pay for gas with an ERC20 token. This will be utilizing our token paymaster.

:::info
This guide assumes you have already initialized the Biconomy SDK and just need to understand how to execute a user paid transaction. See our [tutorials](/category/tutorials) for step by step setups.

Before using these code snippets make sure to [set up a paymaster](/dashboard/paymaster).

:::

## Imports

These are the imports needed for the code snippets below:

```javascript
import { ethers } from "ethers";
import abi from "some abi location";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
```

Additionally an Instance of the BiconomySmartAccount is needed as mentioned above.

## Connect to Contract

Connect to an instance of a contract, below is an example of using ethers JS to connect to an NFT contract.

```javascript
const nftAddress = "0x0a7755bDfb86109D9D403005741b415765EAf1Bc";

const contract = new ethers.Contract(nftAddress, abi, provider);
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

## Get Feequotes for ERC20 Token payment

The example below gets the fee quotes for just USDC. If you pass an empty array for token List you will receive the feequotes for every supported ERC20 token on the network and can choose accordingly.

```javascript
    const biconomyPaymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

    const feeQuotesResponse =
        await biconomyPaymaster.getPaymasterFeeQuotesOrData(partialUserOp, {
            mode: PaymasterMode.ERC20,
            tokenList: ["0xda5289fcaaf71d52a80a254da614a192b693e977"],
        });

    const feeQuotes = feeQuotesResponse.feeQuotes as PaymasterFeeQuote[];
    const spender = feeQuotesResponse.tokenPaymasterAddress || "";
    const usdcFeeQuotes = feeQuotes[0];

    finalUserOp = await smartAccount.buildTokenPaymasterUserOp(partialUserOp, {
        feeQuote: usdcFeeQuotes,
        spender: spender,
        maxApproval: false,
    });

```

## Request Paymaster Data

We now need to construct the `paymasterAndData` field of our userOp. This is done by making a request to the paymaster with the Paymaster mode set to sponsored and updating the userOp with the returned `paymasterAndData` response.

```javascript
let paymasterServiceData = {
  mode: PaymasterMode.ERC20,
  feeTokenAddress: usdcFeeQuotes.tokenAddress,
  calculateGasLimits: true, // Always recommended and especially when using token paymaster
};

try {
  const paymasterAndDataWithLimits =
    await biconomyPaymaster.getPaymasterAndData(
      finalUserOp,
      paymasterServiceData,
    );
  finalUserOp.paymasterAndData = paymasterAndDataWithLimits.paymasterAndData;
  if (
    paymasterAndDataWithLimits.callGasLimit &&
    paymasterAndDataWithLimits.verificationGasLimit &&
    paymasterAndDataWithLimits.preVerificationGas
  ) {
    // Returned gas limits must be replaced in your op as you update paymasterAndData.
    // Because these are the limits paymaster service signed on to generate paymasterAndData
    // If you receive AA34 error check here..

    finalUserOp.callGasLimit = paymasterAndDataWithLimits.callGasLimit;
    finalUserOp.verificationGasLimit =
      paymasterAndDataWithLimits.verificationGasLimit;
    finalUserOp.preVerificationGas =
      paymasterAndDataWithLimits.preVerificationGas;
  }
} catch (e) {
  console.log("error received ", e);
}
```

## Send UserOperation

Send your `finalUserOp` to our Bundler which will send the userOp to the entry point contract to handle executing it as a transaction on chain.

```javascript
// ensure you send the finalUserOp here and not the userOp or you will run into AA21 errors
const userOpResponse = await smartAccount.sendUserOp(finalUserOp);
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
      const biconomyPaymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

    const feeQuotesResponse =
        await biconomyPaymaster.getPaymasterFeeQuotesOrData(partialUserOp, {
            mode: PaymasterMode.ERC20,
            tokenList: ["0xda5289fcaaf71d52a80a254da614a192b693e977"],
        });

    const feeQuotes = feeQuotesResponse.feeQuotes as PaymasterFeeQuote[];
    const spender = feeQuotesResponse.tokenPaymasterAddress || "";
    const usdcFeeQuotes = feeQuotes[0];

    finalUserOp = await smartAccount.buildTokenPaymasterUserOp(partialUserOp, {
        feeQuote: usdcFeeQuotes,
        spender: spender,
        maxApproval: false,
    });

    let paymasterServiceData = {
    mode: PaymasterMode.ERC20,
    feeTokenAddress: usdcFeeQuotes.tokenAddress,
    calculateGasLimits: true, // Always recommended and especially when using token paymaster
};

try {
  const paymasterAndDataWithLimits =
  await biconomyPaymaster.getPaymasterAndData(
        finalUserOp,
        paymasterServiceData
  );
  finalUserOp.paymasterAndData = paymasterAndDataWithLimits.paymasterAndData;
  if (
      paymasterAndDataWithLimits.callGasLimit &&
      paymasterAndDataWithLimits.verificationGasLimit &&
      paymasterAndDataWithLimits.preVerificationGas
    ) {

      // Returned gas limits must be replaced in your op as you update paymasterAndData.
      // Because these are the limits paymaster service signed on to generate paymasterAndData
      // If you receive AA34 error check here..

      finalUserOp.callGasLimit = paymasterAndDataWithLimits.callGasLimit;
      finalUserOp.verificationGasLimit =
        paymasterAndDataWithLimits.verificationGasLimit;
      finalUserOp.preVerificationGas =
        paymasterAndDataWithLimits.preVerificationGas;
    }
    } catch (e) {
        console.log("error received ", e);
    }

    const userOpResponse = await smartAccount.sendUserOp(finalUserOp);
    console.log("userOpHash", userOpResponse);
    const { receipt } = await userOpResponse.wait(1);
    console.log("txHash", receipt.transactionHash);

    } catch (err: any) {
      console.error(err);
      console.log(err)
    }
  }

```
