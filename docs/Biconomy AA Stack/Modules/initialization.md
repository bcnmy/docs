---
sidebar_position: 3
---
# Initialization

## ECDSA Ownership Module

```typescript
// This is how you create ECDSA module instance in your dapp's
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";

   const module = new ECDSAOwnershipValidationModule({
    signer: signer, // you will need to supply a signer from an EOA in this step
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
  })
```

## MultiChain Validaton Module 

```typescript
// This is how you create ECDSA module instance in your dapp's
import { MultiChainValidationModule, DEFAULT_MULTICHAIN_MODULE } from "@biconomy/modules";

    const multiChainModule = new MultiChainValidationModule({
    signer: signer,
    moduleAddress: DEFAULT_MULTICHAIN_MODULE
  })
```