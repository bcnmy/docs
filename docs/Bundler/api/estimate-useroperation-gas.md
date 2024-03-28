---
sidebar_label: "Estimate UserOperation Gas"
sidebar_position: 1
---

# Estimate UserOperation Gas

`eth_estimateUserOperationGas`

This endpoint is used to estimate the gas values for a UserOperation. Request constitutes given UserOperation optionally without gas limits and gas prices & returns the needed gas limits. The signature field is ignored by the wallet, so that the operation will not require user’s approval. It still requires putting a “semi-valid” signature (e.g. a signature in the right length).

## Parameters

Body

| Param   | Type   | Description                                                                                         | Required |
| ------- | ------ | --------------------------------------------------------------------------------------------------- | -------- |
| method  | string | Name of method in this case: eth_estimateUserOperationGas                                           | Required |
| params  | array  | An array consisting of the Useroperation object, Bundler address and an optional State Override Set | Required |
| id      | string | id for request determined by client for JSON RPC requests                                           | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0                                                                 | Required |

- Same as eth_sendUserOperation gas limits (and prices) parameters are optional, but are used if specified.
- Optionally accepts the State Override Set to allow users to modify the state during the gas estimation.
  This field as well as its behavior is equivalent to the ones defined for eth_call RPC method.
  The interface for State Override Set is the same for a regular [eth_call](https://docs.alchemy.com/reference/eth-call)

## Request

```json
{
  "method": "eth_estimateUserOperationGas",
  "params": [
    {
      "sender": "0x5A927A01a32cE02AF4B438b7848BceBc52C8Ea3e",
      "nonce": "0x1b",
      "initCode": "0x",
      "callData": "0x0000189a0000000000000000000000001758f42af7026fbbb559dc60ece0de3ef81f665e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002440d097c30000000000000000000000005a927a01a32ce02af4b438b7848bcebc52c8ea3e00000000000000000000000000000000000000000000000000000000",
      "signature": "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000001c5b32F37F5beA87BDD5374eB2aC54eA8e000000000000000000000000000000000000000000000000000000000000004181d4b4981670cb18f99f0b4a66446df1bf5b204d24cfcb659bf38ba27a4359b5711649ec2423c5e1247245eba2964679b6a1dbb85c992ae40b9b00c6935b02ff1b00000000000000000000000000000000000000000000000000000000000000",
      "paymasterAndData": "0x"
    },
    "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
  ],
  "id": 1697033406,
  "jsonrpc": "2.0"
}
```

## Response

:::info

Please note that the callGasLimit, verificationGasLimit and preVerificationGas returned here are numbers but `eth_sendUserOperation`
expects them as a string. This is a known bug which will be fixed in a future version release.
:::

```json
{
  "jsonrpc": "2.0",
  "id": 1697033406,
  "result": {
    "callGasLimit": 77217,
    "verificationGasLimit": 86895,
    "preVerificationGas": 772931,
    "validUntil": "0xffffffffffff",
    "validAfter": "0x00",
    "maxPriorityFeePerGas": "100000000",
    "maxFeePerGas": "100000000"
  }
}
```
