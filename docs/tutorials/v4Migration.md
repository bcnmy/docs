---
sidebar_label: "Migrating to V4"
sidebar_position: 10
title: Migrating to SDK V4
---

This guide provides instructions for migrating from v3 to v4. It outlines the changes introduced in the new version and offers guidance on updating your codebase to ensure compatibility.

## Migration Steps

:::info
Make sure you have minimum es2020 set as target in the compilerOptions
:::

1. Update dependencies: Install the latest V4 version of `@biconomy/account` package. All transaction functionalities are now accessible by simply importing the account package without the need for any other Biconomy package.

2. `BiconomyPaymaster` is now named `Paymaster` and could be imported from `@biconomy/account` instead of `@biconomy/paymaster`.

3. When using `buildTokenPaymasterUserOp` method, the spender cannot be undefined. The BiconomyTokenPaymasterRequest `spender` type has changed from string to `0x${string}`, users need to convert spender to `0x${string}` like following.

   ```typescript
   // V3
   const spender = feeQuotesResponse.tokenPaymasterAddress || "";
   finalUserOp = await biconomySmartAccount.buildTokenPaymasterUserOp(
     partialUserOp,
     {
       feeQuote: selectedFeeQuote,
       spender: "0x",
       maxApproval: false,
     }
   );
   // V4
   const spender = feeQuotesResponse.tokenPaymasterAddress;
   finalUserOp = await biconomySmartAccount.buildTokenPaymasterUserOp(
     partialUserOp,
     {
       feeQuote: selectedFeeQuote,
       spender: spender, // needs to be `0x${string}`
       maxApproval: false,
     }
   );
   ```

4. When using viem's wallet as the signer explicitly set the signer to the walletClient. It is no longer necessary or encouraged that the walletClient be wrapped using alchemy's wrapper as per v3

   ```typescript
   // V3
   import { WalletClientSigner } from "@alchemy/aa-core";
   const smartAccount = await BiconomySmartAccountV2.create({
       ...,
       signer: new WalletClientSigner(walletClient, "json-rpc"),
       ...
   });
   // V4
   const smartAccount = await createSmartAccountClient({
       ...,
       signer: walletClient,
       ...
   });
   ```

5. Pass rpcUrl while creating the smart account for signers that are not a viem wallet or ethers.

   ```ts
   const smartAccount = await createSmartAccountClient({
     signer,
     bundlerUrl: "", // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
     biconomyPaymasterApiKey: "", // <-- Read about at https://docs.biconomy.io/dashboard/paymaster
     rpcUrl: "", // Recommended for signers that are not a viem wallet or an ethers signer. It's advised to pass RPC url in case of custom signers such as privy, dynamic etc. If rpcUrl is not provided then a default public rpc will be used - which will likely be heavily throttled and can often silently fail
   });
   ```

Since v4.2:

6. While importing the SDK, "viem" must now be imported independently, as it is no longer bundled in our account package outright. Ethers users need not be purturbed by this, it is still fully compatible with ethers.

```
  npm i @biconomy/account viem
```

Thoroughly test your application with the new SDK version to ensure that all functionalities work as expected. Pay close attention to any areas of your application that interact with the SDK.

## Additional recommendations

- Use the [sendTransaction](/Account/methods#sendtransaction-) method directly instead of buildUserOp and sendUserOp.
- `PaymasterMode` to be imported from `@biconomy/account`
- DEFAULT_ECDSA_OWNERSHIP_MODULE, DEFAULT_SESSION_KEY_MANAGER_MODULE, DEFAULT_MULTICHAIN_MODULE, DEFAULT_BATCHED_SESSION_ROUTER_MODULE to be imported from `@biconomy/account` package.
- `Bundler` to be imported from `@biconomy/account` instead of `@biconomy/bundler` in order to keep using just one package.

If you encounter any compatibility issues or unexpected behavior after migrating to the new SDK version, refer to the release docs or seek assistance from the SDK's support channels.
