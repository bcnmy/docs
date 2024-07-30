---
sidebar_label: "Methods"
sidebar_position: 3
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/GasEstimations/methods.md
---

# Methods

## [estimateUserOperationGas](https://github.com/bcnmy/entry-point-gas-estimations/blob/52dee03ee0ecdff78e4dae16152277de8505d4c8/src/gas-estimator/entry-point-v6/GasEstimator/GasEstimator.ts#L118C9-L118C33)

This method is used to estimate gas for the userOp. It returns estimates for preVerificationGas, verificationGasLimit, and callGasLimit for a given UserOperation. It requires passing a semi-valid/ dummy signature in userOp (e.g. a signature of the correct length and format).

**Usage**

```ts
const estimateUserOperationGasResponse: EstimateUserOperationGas = await gasEstimator.estimateUserOperationGas({
  userOperation,
  supportsEthCallStateOverride,
  supportsEthCallByteCodeOverride,
  stateOverrideSet
  baseFeePerGas
});
```

**Parameters**

- userOperation(`UserOperation`, required): userOperation to calculate gas estimates for.
- stateOverrideSet(`StateOverrideSet`): optional state override set for estimating gas for a userOperation under different blockchain states.
- supportsEthCallStateOverride (`boolean`): optional param, default set to true, set to false if eth_call does not support state overrides
- supportsEthCallByteCodeOverride (`boolean`): optional param, default set to true, set to false if eth_call does not give the correct response to bytecode overrides
- baseFeePerGas (`bigint`): optional param, but required for Optimism based networks

**returns**

- estimateUserOperationGasResponse(`Promise<EstimateUserOperationGas>`): It returns an object containing the following gas limits.

  ```ts
  type EstimateUserOperationGas = {
    callGasLimit: bigint;
    verificationGasLimit: bigint;
    preVerificationGas: bigint;
    validAfter: number;
    validUntil: number;
  };
  ```

## [estimateVerificationGasLimit](https://github.com/bcnmy/entry-point-gas-estimations/blob/52dee03ee0ecdff78e4dae16152277de8505d4c8/src/gas-estimator/entry-point-v6/GasEstimator/GasEstimator.ts#L177C9-L177C37)

This method is used to estimate the verificationGasLimit for a given userOperation.

**Usage**

```ts
const verificationGasLimitResponse: EstimateVerificationGasLimit =
  await gasEstimator.estimateVerificationGasLimit({
    userOperation,
    supportsEthCallStateOverride,
    supportsEthCallByteCodeOverride,
    stateOverrideSet,
  });
```

**Parameters**

- userOperation(`UserOperation`, required): userOperation to calculate gas estimates for.
- stateOverrideSet(`StateOverrideSet`): optional state override set for estimating gas for a userOperation under different blockchain states.
- supportsEthCallStateOverride (`boolean`): optional param, default set to true, set to false if eth_call does not support state overrides
- supportsEthCallByteCodeOverride (`boolean`): optional param, default set to true, set to false if eth_call does not give the correct response to bytecode overrides

**returns**

- verificationGasLimitResponse(`Promise<EstimateVerificationGasLimit>`): It returns an object containing the verificationGasLimit, validUntil, and validAfter values

  ```ts
  type EstimateVerificationGasLimit = {
    verificationGasLimit: bigint;
    validAfter: number;
    validUntil: number;
  };
  ```

## [estimateCallGasLimit](https://github.com/bcnmy/entry-point-gas-estimations/blob/52dee03ee0ecdff78e4dae16152277de8505d4c8/src/gas-estimator/entry-point-v6/GasEstimator/GasEstimator.ts#L221C9-L221C29)

This method is used to estimate the callGasLimit for a given userOperation.

**Usage**

```ts
const callGasLimitResponse = await gasEstimator.estimateCallGasLimit({
  userOperation,
  supportsEthCallStateOverride,
  supportsEthCallByteCodeOverride,
  stateOverrideSet,
});
```

**Parameters**

- userOperation(`UserOperation`, required): userOperation to calculate gas estimates for.
- stateOverrideSet(`StateOverrideSet`): optional state override set for estimating gas for a userOperation under different blockchain states.
- supportsEthCallStateOverride (`boolean`): optional param, default set to true, set to false if eth_call does not support state overrides
- supportsEthCallByteCodeOverride (`boolean`): optional param, default set to true, set to false if eth_call does not give the correct response to bytecode overrides

**returns**

- callGasLimitResponse(`Promise<EstimateCallGasLimit>`): It returns an object containing the callGasLimit value

  ```ts
  type EstimateCallGasLimit = {
    callGasLimit: bigint;
  };
  ```

## [calculatePreVerificationGas](https://github.com/bcnmy/entry-point-gas-estimations/blob/52dee03ee0ecdff78e4dae16152277de8505d4c8/src/gas-estimator/entry-point-v6/GasEstimator/GasEstimator.ts#L291C9-L291C36)

This method is used to estimate the preVerificationGas for a given userOperation. The exact implementation of this method is network-dependent hence make sure to use network-specific gas estimator clients

**Usage**

```ts
const preVerficationGasResponse =
  await gasEstimator.calculatePreVerificationGas({
    userOperation,
    baseFeePerGas,
  });
```

**Parameters**

- userOperation(`UserOperation`, required): userOperation to calculate gas estimates for.
- baseFeePerGas (`bigint`): optional param, but required for Optimism based networks

**returns**

- preVerificationGasResponse(`Promise<CalculatePreVerificationGas>`) : It returns an object containing the preVerficationGas value

  ```ts
  type CalculatePreVerificationGas = {
    preVerificationGas: bigint;
  };
  ```

## [setEntryPointAddress](https://github.com/bcnmy/entry-point-gas-estimations/blob/413261a88e0842d9d6a93815106372d87452d02a/src/gas-estimator/entry-point-v6/GasEstimator/GasEstimator.ts#L320)

This method is used to set the entryPointAddress that is being used in the Gas Estimator instance

**Usage**

```ts
await gasEstimator.setEntryPointAddress("<ENTRY_POINT_ADDRESS>");
```

**Parameters**

- entryPointAddress(`string`, required): entry point address that one might need to change to.

**returns**

- void
