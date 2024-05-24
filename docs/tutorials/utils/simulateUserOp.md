---
sidebar_label: "Simulate User Op"
sidebar_position: 3
title: "Simulate a User Op with buildUserOp()"
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

### Overview

This tutorial provides insights into how to simulate a user operation using the buildUserOp() method.


```typescript
const account = privateKeyToAccount("");

const signer = createWalletClient({
    account,
    chain: polygonAmoy,
    transport: http(),
})

const smartAccount = await createSmartAccountClient({
    signer,
    bundlerUrl, // from Biconomy dashboard
    paymasterUrl, // from Biconomy dashboard
});

const encodedCall = encodeFunctionData({
    abi: parseAbi(["function safeMint(address _to)"]),
    functionName: "safeMint",
    args: [recipient]
})
const transaction = {
    to: nftAddress, 
    data: encodedCall
}

// will throw an error if something is wrong with the transaction
await smartAccount.buildUserOp([transaction]);
```