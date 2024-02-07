---
sidebar_label: "Migrating to V4"
sidebar_position: 8
title: Migrating to SDK V4
---

This guide provides instructions for migrating from v3 to v4. It outlines the changes introduced in the new version and offers guidance on updating your codebase to ensure compatibility.

## Migration Steps

1. Update dependencies: Install the latest V4 version of  `@biconomy/account` package. All transaction functionalities are now accessible by simply importing the account package without the need for any other Biconomy package.

2. `BiconomyPaymaster` is now named `Paymaster` and should be imported from `@biconomy/account` instead of `@biconomy/paymaster`.

3. The `value` type in transaction can be bigInt, number, 0xstring or string. So, if you are using ethers.parseEther or any ethers parse function, will need to change to the following.

    ```typescript
    // V3 
    const transaction = {
        to: to || "0x0000000000000000000000000000000000000000",
        data: "0x",
        value: ethers.utils.parseEther(amount.toString()),
    };
    // V4, users need to use the .toBigInt() method to make the value param compatible 
    const transaction = {
        to: to || "0x0000000000000000000000000000000000000000",
        data: "0x",
        value: ethers.utils.parseEther(amount.toString()).toBigInt(),
    };
    ```

4. When using `buildTokenPaymasterUserOp` method, the spendor cannot be undefined. The BiconomyTokenPaymasterRequest `spender` type has changed from string to `0x${string}`, users need to convert spender to `0x${string}` like following.

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

Thoroughly test your application with the new SDK version to ensure that all functionalities work as expected. Pay close attention to any areas of your application that interact with the SDK.

## Additional recommendations
- Use the [sendTransaction](/Account/methods#sendtransaction-) method directly instead of buildUserOp and sendUserOp.
- `PaymasterMode` to be imported from `@biconomy/account`
- DEFAULT_ECDSA_OWNERSHIP_MODULE, DEFAULT_SESSION_KEY_MANAGER_MODULE, DEFAULT_MULTICHAIN_MODULE, DEFAULT_BATCHED_SESSION_ROUTER_MODULE to be imported from `@biconomy/account` package.
- `Bundler` to be imported from `@biconomy/account` instead of `@biconomy/bundler` in order to keep using just one package.


If you encounter any compatibility issues or unexpected behavior after migrating to the new SDK version, refer to the release docs or seek assistance from the SDK's support channels.