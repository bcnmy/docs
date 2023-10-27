---
sidebar_position: 3
---
# Bundler Methods

Following are the methods that can be called on bundler instance

:::note

When using these methods you will need to create a `userOp`. The [accounts methods](/category/methods) will help you in creating these for the paymaster methods below. 

:::

## sendUserOp

Although the Bundler has the sendUserOp method for sending a userOp to be mined on chain this is not something you would need to call yourself as it would be done when sending the userOp from the smart account. For a full rundown of this process [click here](/Account/methods/userOpMethods). 

## getUserOpReceipt

After using `sendUserOp` you will recieve a `userOpResponse` which contains a string clled `userOpHash`

Using this `userOpHash` you can fetch the `userOpReceipt` which verifies that your `userOp` was handled on chain as a transaction. 

```ts

const userOpReceipt = await getUserOpReceipt("0x....")

```

The full UserOpReceipt object type is shown below: 

```ts

type UserOpReceipt = {
    userOpHash: string;
    entryPoint: string;
    sender: string;
    nonce: number;
    paymaster: string;
    actualGasCost: BigNumber;
    actualGasUsed: BigNumber;
    success: boolean;
    reason: string;
    logs: Array<ethers.providers.Log>;
    receipt: ethers.providers.TransactionReceipt;
}
```


## getUserOpByHash

After using `sendUserOp` you will recieve a `userOpResponse` which contains a string clled `userOpHash`

Using this `userOpHash` you can fetch the original `userOp` that was created with this hash. 

```ts

const userOp = await getUserOpByHash("0x...")

```

The userOperation will contain the followin values: 


```ts

type BytesLike = Bytes | string;
type BigNumberish = BigNumber | Bytes | bigint | string | number;

type UserOperation = {
    sender: string;
    nonce: BigNumberish;
    initCode: BytesLike;
    callData: BytesLike;
    callGasLimit: BigNumberish;
    verificationGasLimit: BigNumberish;
    preVerificationGas: BigNumberish;
    maxFeePerGas: BigNumberish;
    maxPriorityFeePerGas: BigNumberish;
    paymasterAndData: BytesLike;
    signature: BytesLike;
}

```

Additionally this response will contain the following: 

```ts

type UserOpByHashResponse = UserOperation & {
    transactionHash: string;
    blockNumber: number;
    blockHash: string;
    entryPoint: string;
}

```
