---
sidebar_position: 3
---
# Initialization

```typescript
// This is how you create paymaster instance in your dapp's
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'

// Currently this package only exports Biconomy Paymaster which acts as a Hybrid paymaster for gas abstraction. You can sponsor user transactions but can also make users pay gas in supported ERC20 tokens.

  const paymaster = new BiconomyPaymaster({
    paymasterUrl: '' // you can get this value from biconomy dashboard. https://dashboard.biconomy.io
  })
```

**paymasterUrl** you can get this value from biconomy dashboard.