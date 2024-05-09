---
sidebar_label: "Offset Gas Values"
sidebar_position: 1
title: "Offset User Operation Gas Values"
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

### Overview

This tutorial demonstrates how to increase user operation gas values by a percentage.

:::caution
This should only be used in urgent cases, where for some reason our gas estimates are not enough.
:::

```typescript
const encodedCall = encodeFunctionData({
    abi: parseAbi(["function safeMint(address _to)"]),
    functionName: "safeMint",
    args: [recipient]
})
const transaction = {
    to: nftAddress, // NFT address
    data: encodedCall
}
const { wait } = await smartAccount.sendTransaction(transaction, {
    gasOffset: {
        verificationGasLimitOffsetPct: 25, // 25% increase
        preVerificationGasOffsetPct: 25, // 25% increase
        callGasLimitOffsetPct: 15, // 15% increase
    }
})
const {
    receipt: { transactionHash },
    userOpHash,
    success
} = await wait()
```