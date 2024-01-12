# Smart Accounts : V1 to V2 Upgrade

All smart accounts already deployed as account V1 can be safely upgraded to account V2 implementation (aka Modular Smart Account).

Biconomy Smart Account V1 and Biconomy Smart Account V2 use different smart account factories; hence, the account address generated for the same EOA and salt would be different for both. Account V2 does not have default owner storage and manages authorisation via validation(aka authorisation) modules.

Account V1’s single EOA ownership is comparable to Account V2 with the ECDSA Ownership module and appears to be the most common upgrade path. Using one default auth module, developers can use the same address and upgrade implementation. 

In the [SDK release](https://github.com/bcnmy/biconomy-client-sdk/releases/tag/r6) (npm version 3.1.1), below API methods have been added to V1 Account API specs (BiconomySmartAccount.ts in accounts package) to help with the upgrades

- **getUpdateImplementationData( )** : This returns transaction object which can be used in buildUserOp() method for batching with other transactions.

- **updateImplementationUserOp( )** : This returns the userOp, which can be sent as a single action to do the upgrade.

### Steps to upgrade

1. create a Biconomy account V1 instance and execute **`getUpdateImplementationData`** transaction.

```tsx
  const biconomyAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
  const biconomySmartAccount = await biconomyAccount.init();

  const tx = await biconomySmartAccount.getUpdateImplementationData() 
  console.log('account update tx', tx)

  // transaction is any existing transaction

  let partialUserOp = await biconomySmartAccount.buildUserOp([transaction, tx]);

  const userOpResponse = await biconomySmartAccount.sendUserOp(partialUserOp);
  const transactionDetails = await userOpResponse.wait();
```
2. Once the above userOp (which contains the upgrade transaction) is mined successfully, Import BiconomySmartAccountV2 class from accounts package as shown in the [example](https://github.com/bcnmy/sdk-examples/commit/d4c395e6eec9dbf4770f27f1b6d0f7ffbda4174c#diff-fd75aa2ccf8c07f2f13d97592cc7d215d0d2bc770193adf13b7279cd4f79666aR5)


3. Create `BiconomySmartAccountV2` instance. When initialising BiconomySmartAccountV2 with the default auth module as ECDSAOwnershipModule instance, the generated default address will differ. However, It’s preferred to use the V1 address here because the account has been upgraded.

4. There are two ways to do this. Either the account address can be overridden in the `biconomySmartAccountConfigV2`, or a `scanForUpgradedAccountsFromV1` flag can be passed that detects the V1 account address that has been upgraded to V2 implementation (with the help of the AddressResolver contract)

5. Create `BiconomySmartAccountV2` instance with overridden address (if V1 address known from the same script) or enable the flag to detect the same.
 

```tsx
const ecdsaModule = await ECDSAOwnershipValidationModule.create({
    signer: signer, // same signer used in V1
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE // imported from modules package
  })

const biconomySmartAccountConfigV2 = {
    chainId: config.chainId,
    rpcUrl: config.rpcUrl,
    paymaster: paymaster, 
    bundler: bundler, 
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: ecdsaModule,
    activeValidationModule: ecdsaModule,
    senderAddress: await biconomySmartAccount.getSmartAccountAddress() // if the address is already known

    scanForUpgradedAccountsFromV1: true // OR use this flag if not overriding like above
  };

const biconomySmartAccountV2 = await BiconomySmartAccountV2.create(biconomySmartAccountConfigV2);
```

This way it will use V2 account but with the context of V1 address which has been already upgraded.