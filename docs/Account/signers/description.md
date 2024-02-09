---
sidebar_position: 1
---

# Description

Biconomy Smart Accounts are flexible in allowing you to use any signer from an EIP-1193 provider, (or simply an ethers signer) to create a Smart Account. Let's take a look again at how we initialize a smart account:

```typescript
const biconomyAccount = await createSmartAccountClient({
  signer: {}, // viem wallet or ethers signer object
  bundlerUrl: "https://docs.biconomy.io/dashboard#bundler-url", // <-- Read about this here
  biconomyPaymasterApiKey: "https://docs.biconomy.io/dashboard/paymaster", // <-- Read about this here
});
```

The ownership module for the smart account takes the ethers signer object to link the Smart Account to an EOA that will sign on its behalf.
