---
sidebar_position: 3
---

# Paymaster Methods

This section will cover methods that can be called using the Paymaster Package.

:::note

When using these methods you will need to create a `userOp`. The [accounts methods](../Account/methods.md) will help you in creating these for the paymaster methods below.

:::

Imports needed for these methods:

```ts
import {
  IHybridPaymaster,
  PaymasterFeeQuote,
  PaymasterMode,
  SponsorUserOperationDto,
} from "@biconomy/paymaster";
```

After setting up your smart account as mentioned above you can start using the Paymaster in this way:

```ts
const biconomyPaymaster =
  smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
```

## getPaymasterAndData()

This method takes a `userOp` and optionally an object with information about sponsorship for the `userOp`. It returns a promise that resolves to a Paymaster and Data Response object. The data in this response can be used to update the userOp to include sponsorship data or data for paying gas in ERC20 tokens. There are two modes for using this function: `SPONSORED` and `ERC20`.

### Mode: `SPONSORED`

Below is an example of the sponsorship data or `paymasterServiceData`

Here it is meant to act as Sponsorship/Verifying paymaster hence we send mode: PaymasterMode.SPONSORED which is required

```ts
let paymasterServiceData: SponsorUserOperationDto = {
  mode: PaymasterMode.SPONSORED,
  smartAccountInfo: {
    name: "BICONOMY",
    version: "2.0.0",
  },
  // optional params...
  calculateGasLimits: true,
};
```

Additionally here is the full typing for this operation:

```ts
type SponsorUserOperationDto = {
  mode: PaymasterMode;
  calculateGasLimits?: boolean;
  expiryDuration?: number;
  webhookData?: {
    [key: string]: any;
  };
  smartAccountInfo?: SmartAccountData;
  feeTokenAddress?: string;
};
```

Now we can get the Paymaster and Data Response and update our userOp with the returned data:

```ts
const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
  userOp,
  paymasterServiceData,
);

userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
```

This way we update our userOp to specify that this will be a sponsored transaction by the Biconomy Paymaster. Here is the full typing for the `paymasterAndDataResponse`

```ts
type PaymasterAndDataResponse = {
  paymasterAndData: string;
  preVerificationGas?: BigNumberish;
  verificationGasLimit?: BigNumberish;
  callGasLimit?: BigNumberish;
};
```

### Mode: `ERC20`

When switching mode to sponsored there are a couple of additional steps that need to be considered.

First we need to get quotes for the swap of the ERC20 token that the user is paying into the native token of the network we are on.

```ts
const feeQuotesResponse = await biconomyPaymaster.getPaymasterFeeQuotesOrData(
  userOp,
  {
    mode: PaymasterMode.ERC20,
    tokenList: [],
    preferredToken: "",
  },
);
```

- We set mode to ERC20
- In token list we can specify a list of addresses for the choices in tokens we want to have our users pay in
- We can also decide to choose a preferred token for the response to include

:::warning

**_Important:_** When using **Token Paymaster** with ERC20 tokens, always ensure to calculate the **feeQuote** correctly. This is crucial to avoid transaction reverts due to insufficient token balance after execution. The `feeQuote` should consider both the transaction cost and any other **token** movements within the same operation.

_Example:_ If a user is transacting with **USDC**, and the feeQuote is **2 USDC**, the DApp must ensure that the user's balance post-callData execution is sufficient to cover this fee. Incorrect fee calculations can lead to transaction failures and a degraded user experience.

:::

Here is the typing for the full data object you can pass here:

```ts
type FeeQuotesOrDataDto = {
  mode?: PaymasterMode;
  expiryDuration?: number;
  calculateGasLimits?: boolean;
  tokenList?: string[];
  preferredToken?: string;
  webhookData?: {
    [key: string]: any;
  };
  smartAccountInfo?: SmartAccountData;
};
```

Now lets take a look at the response we would get from this:

```ts
type FeeQuotesOrDataResponse = {
  feeQuotes?: PaymasterFeeQuote[];
  tokenPaymasterAddress?: string;
  paymasterAndData?: string;
  preVerificationGas?: BigNumberish;
  verificationGasLimit?: BigNumberish;
  callGasLimit?: BigNumberish;
};
```

Similar to other Paymaster responses but this also includes a feeQuotes Array. A paymaster Fee quote will have additional information about the fee being paid in the specifed ERC20 token. Here is the full typing for a single fee quote:

```ts
type PaymasterFeeQuote = {
  symbol: string;
  tokenAddress: string;
  decimal: number;
  logoUrl?: string;
  maxGasFee: number;
  maxGasFeeUSD?: number;
  usdPayment?: number;
  premiumPercentage: number;
  validUntil?: number;
};
```

This returns information about the gas fee, how long this fee is valid, what type of premium is going to be paid, as well as general token information and amount in USD.

After getting this information we need to build our updated userOp with the preferred `feeQuote` from the `feeQuotes` array.

```ts
finalUserOp = await smartAccount.buildTokenPaymasterUserOp(userOp, {
  feeQuote: selectedFeeQuote,
  spender: spender,
  maxApproval: false,
});
```

Now we create our `paymasterServiceData` again:

```ts
let paymasterServiceData = {
  mode: PaymasterMode.ERC20,
  feeTokenAddress: selectedFeeQuote.tokenAddress,
  calculateGasLimits: true, // Always recommended and especially when using token paymaster
};
```

Now we ready our userOp to get sent to Bundler:

```ts
const paymasterAndDataWithLimits = await biconomyPaymaster.getPaymasterAndData(
  finalUserOp,
  paymasterServiceData,
);
finalUserOp.paymasterAndData = paymasterAndDataWithLimits.paymasterAndData;
```

:::tip

A common error you might encounter here is the AA34 error.

<details>
<summary> Code snippet to fix AA34 </summary>

```ts
try {
  const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
    partialUserOp,
    paymasterServiceData,
  );
  partialUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

  if (
    paymasterAndDataResponse.callGasLimit &&
    paymasterAndDataResponse.verificationGasLimit &&
    paymasterAndDataResponse.preVerificationGas
  ) {
    // Returned gas limits must be replaced in your op as you update paymasterAndData.
    // Because these are the limits paymaster service signed on to generate paymasterAndData
    // If you receive AA34 error check here..

    partialUserOp.callGasLimit = paymasterAndDataResponse.callGasLimit;
    partialUserOp.verificationGasLimit =
      paymasterAndDataResponse.verificationGasLimit;
    partialUserOp.preVerificationGas =
      paymasterAndDataResponse.preVerificationGas;
  }
} catch (e) {
  console.log("error received ", e);
}
```

</details>

:::
