---
sidebar_position: 1
---

# Description

Biconomy Smart Accounts are flexible in allowing you to use any signer from an EIP-1193 provider, (or simply an ethers signer) to create a Smart Account. Let's take a look again at how we initialize a smart account:

```typescript
const ownerShipModule = await ECDSAOwnershipValidationModule.create({
  signer: {}, // ethers signer object
  moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
});

const biconomyAccount = await BiconomySmartAccountV2.create({
  chainId: 80002, //or any chain of your choice
  bundler: bundler, // instance of bundler
  paymaster: paymaster, // instance of paymaster
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, //entry point address for chain
  defaultValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
  activeValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
});
```

The ownership module for the smart account takes the ethers signer object to link the Smart Account to an EOA that will sign on its behalf.
