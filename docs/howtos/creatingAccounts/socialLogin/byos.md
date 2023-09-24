---
sidebar_label: 'Bring your own Signer'
sidebar_position: 4
---

# Bring your own Signer

When looking through the ways you create a Biconomy Account, one thing remains the same: a signer is needed from any authentication method you choose. As long as you can export a signer any authentication method from a third party can be used along with our SDK. Let's take a look at the creation method of our smart accounts again: 

```typescript

let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler, 
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: module,
        activeValidationModule: module
      })

```

If your third party package of choice exports a provider that can be used in an Ethers JS provier instance you are all set to go with using it to create a smart account.