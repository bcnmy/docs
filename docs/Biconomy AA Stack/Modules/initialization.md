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

## Session Key Manager Module

```typescript
  // This is how you create an instance of the Session Key Manager module 
 const sessionModule = await SessionKeyManagerModule.create({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: address,
      });

```

For full implementation see this [guide](/docs/category/session-keys-tutorial/)

## Batched Session key Manager Module 

```typescript
  // This is how you create an instance of the Session Key Manager module even for the batched sessions
 const sessionModule = await SessionKeyManagerModule.create({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: address,
      });
// an additional step showcases how to add the batched session router module
const sessionRouterModule = await BatchedSessionRouterModule.create({
        moduleAddress: routerModuleAddr,
        sessionKeyManagerModule: sessionModule,
        smartAccountAddress: scwAddress,
      });

```
Implementation of this is similar to the Session Key Manager module guide - a full timplementation example is shown [here](https://github.com/bcnmy/sdk-demo/blob/dev-v2/src/components/Modules/CreateBatchRouter.tsx)