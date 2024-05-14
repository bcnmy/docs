---
sidebar_label: "Offset Gas Values"
sidebar_position: 1
title: "Offset User Operation Gas Values"
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

### Overview

This tutorial provides insights into adjusting user operation gas values by a specified percentage.

:::caution
Exercise caution when implementing this approach. It is recommended to use this only for urgent situations where gas estimates fall short for specific operations.
:::

For instance, if gas estimates for verificationGasLimitOffsetPct and preVerificationGasOffsetPct are inaccurately low, this method allows for increasing these values by a defined percentage.

```typescript
const encodedCall = encodeFunctionData({
    abi: parseAbi(["function safeMint(address _to)"]),
    functionName: "safeMint",
    args: [recipient]
})
const transaction = {
    to: nftAddress, 
    data: encodedCall
}
const { wait } = await smartAccount.sendTransaction(transaction, {
    gasOffset: {
        verificationGasLimitOffsetPct: 25, // 25% increase
        preVerificationGasOffsetPct: 9.80, // 9.80% increase
    }
})
const {
    receipt: { transactionHash },
    userOpHash,
    success
} = await wait()
```