---
sidebar_position: 4
---
# Bundler Methods

Following are the methods that can be called on bundler instance

```typescript
export interface IBundler {
    estimateUserOpGas(
        userOp: Partial<UserOperation>
    ): Promise<UserOpGasResponse>
    sendUserOp(userOp: UserOperation): Promise<UserOpResponse>
    getUserOpReceipt(userOpHash: string): Promise<UserOpReceipt>
    getUserOpByHash(userOpHash: string): Promise<UserOpByHashResponse>
}
```

| Method | Parameter | Description |
| -------- | -------- | -------- |
| estimateUserOpGas | userOp: Partial UserOperation | Estimates the gas values for a UserOperation. The UserOperation may be provided without gas limits and gas prices. The method returns the needed gas limits for the operation. The signature field is ignored by the wallet to avoid user approval. However, a "semi-valid" signature is required. |
| sendUserOp | userOp: UserOperation | Sends a UserOperation to be executed. The method returns a Promise that resolves to a UserOpResponse, representing the response from the execution of the UserOperation. |
| getUserOpReceipt | userOpHash: string | Retrieves the receipt for a previously executed UserOperation, identified by its hash. The method returns a Promise that resolves to a UserOpReceipt containing the execution details. |
| getUserOpByHash | userOpHash: string | Retrieves the details of a previously executed UserOperation, identified by its hash. The method returns a Promise that resolves to a UserOpByHashResponse containing the UserOperation details. |

