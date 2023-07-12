---
sidebar_position: 4
---
# Bundler Methods

WIP Converting to tables and explanations for more readibility

Following are the methods that can be call on bundler instance

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

**estimateUserOpGas**
Estimate the gas values for a UserOperation. Given UserOperation optionally without gas limits and gas prices, return the needed gas limits. The signature field is ignored by the wallet, so that the operation will not require user's approval. Still, it might require putting a "semi-valid" signature (e.g. a signature in the right length)

**Return Values**

**preVerificationGas** gas overhead of this UserOperation
**verificationGasLimit** actual gas used by the validation of this UserOperation
**callGasLimit** limit used to execute userop.callData called from EntryPoint to the Smart Account