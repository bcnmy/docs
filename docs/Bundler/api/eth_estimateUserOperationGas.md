---
sidebar_label: "Estimate UserOp Gas"
sidebar_position: 1
---

# 1. eth_estimateUserOperationGas

:::caution

This documentation is for using our Bundler API directly. If you are building with the Biconomy SDK you can follow the instructions on this [page](/Bundler/bundlermethods).

:::

:::info
You can get your Bundler URL from the Biconomy [Dashboard](https://dashboard.biconomy.io/bundlers). This is the same endpoint URL used for all requests. All requests must follow the [JSON RPC](https://www.jsonrpc.org/specification) specifications.

You can test this endpoint on our [Bundler Explorer](/Bundler/api/explorer)
:::

This endpoint is used to estimate the gas values for a UserOperation. Request constitutes given UserOperation optionally without gas limits and gas prices & returns the needed gas limits. The signature field is ignored by the wallet, so that the operation will not require user’s approval. It still requires putting a “semi-valid” signature (e.g. a signature in the right length)

## Parameters

Body

| Param   | Type   | Description                                                         | Required |
| ------- | ------ | ------------------------------------------------------------------- | -------- |
| method  | string | Name of method in this case: eth_estimateUserOperationGas           | Required |
| params  | array  | An array consisting of the Useroperation object and Bundler address | Required |
| id      | string | id for request determined by client for JSON RPC requests           | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0                                 | Required |

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

```json
{
  "jsonrpc": "2.0",
  "id": 1697033406,
  "result": {
    "callGasLimit": 77217,
    "verificationGasLimit": 86895,
    "preVerificationGas": 772931,
    "validUntil": {
      "type": "BigNumber",
      "hex": "0xffffffffffff"
    },
    "validAfter": {
      "type": "BigNumber",
      "hex": "0x00"
    },
    "maxPriorityFeePerGas": "0",
    "maxFeePerGas": "100000000"
  }
}
```
