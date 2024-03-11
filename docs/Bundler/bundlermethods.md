---
sidebar_label: "Methods"
sidebar_position: 3
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/Bundler/integration.mdx
---

# Methods

## [estimateUserOpGas](https://bcnmy.github.io/biconomy-client-sdk/classes/Bundler.html#estimateUserOpGas)
This method is used to estimate gas for the userOp.

**Usage**
```ts
const userOpGasResponse: UserOpGasResponse = await bundler.estimateUserOpGas(userOp);
```
**Parameters**

- userOp(`UserOperation`, required): userOperation to calculate gas for.

**returns**

- userOpGasResponse(`Promise<UserOpGasResponse>`): It returns an object containing the following gas values.

  ```ts
  type UserOpGasResponse = {
    preVerificationGas: string;
    verificationGasLimit: string;
    callGasLimit: string;
    maxPriorityFeePerGas: string;
    maxFeePerGas: string;
  };
  ```


## [sendUserOp](https://bcnmy.github.io/biconomy-client-sdk/classes/Bundler.html#sendUserOp)

This method is used to execute the userOperation.

**Usage**
```ts
const userOpResponse: UserOpResponse = await bundler.sendUserOp(userOp);
```
**Parameters**

- userOp(`UserOperation`, required): userOperation to send.

**returns**

- userOpResponse(`Promise<UserOpResponse>`): It returns an object containing the userOpHash and wait method.

  ```ts
  type UserOpResponse = {
    userOpHash: string;
    wait(_confirmations?: number): Promise<UserOpReceipt>;
  };
  ```

## [getUserOpReceipt](https://bcnmy.github.io/biconomy-client-sdk/classes/Bundler.html#getUserOpReceipt)

After using `sendUserOp` you will receive a `userOpResponse` which contains a string called `userOpHash`

Using this `userOpHash` you can fetch the `userOpReceipt` which verifies that your `userOp` was handled on chain as a transaction.

**Usage**

```ts
const userOpReceipt = await bundler.getUserOpReceipt("0x....");
```

**Parameters**

- userOpHash(`string`, required): user operation hash.

**returns**

- userOpReceipt(`UserOpReceipt`): The full UserOpReceipt object type is shown below:

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
  };
  ```

## [getUserOpByHash](https://bcnmy.github.io/biconomy-client-sdk/classes/Bundler.html#getUserOpByHash)

Using the `userOpHash` you can fetch the original `userOp` that was created with this hash.

**Usage**

```ts
const userOp = await bundler.getUserOpByHash("0x...");
```

**Parameters**

- userOpHash(`string`, required): user operation hash.

**returns**
- userOp(`Promise<UserOperation>`) : The userOperation will contain the following values:

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
  };
  ```

  Additionally this response will contain the following:

  ```ts
  type UserOpByHashResponse = UserOperation & {
    transactionHash: string;
    blockNumber: number;
    blockHash: string;
    entryPoint: string;
  };
  ```
