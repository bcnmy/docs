---
sidebar_label: "pm_getPaymasterData"
sidebar_position: 5
---

# pm_getPaymasterData

`pm_getPaymasterData`

This endpoint returns the values to be used in paymaster-related fields of an usigned user operarion. These are not stub values and will be used during user operation submission to a bundler.

## Parameters

Body

| Param   | Type   | Description                                                                | Required |
| ------- | ------ | -------------------------------------------------------------------------- | -------- |
| method  | string | Name of method in this case: pm_getPaymasterStubData                       | Required |
| params  | array  | Unsigned user operation, entrypoint address, chain id and a context object | Required |
| id      | string | id for request determined by client for JSON RPC requests                  | Required |
| jsonrpc | string | JSON RPC version in this case 2.0                                          | Required |

:::info
The context object for Biconomy Paymaster service should be exactly the second element
of the params object that is supported on [`pm_sponsorUserOperation`](https://legacy-docs.biconomy.io/Paymaster/api/sponsor-useroperation#1-mode-is-sponsored-)
:::

## Request

```javascript
{
  "method": "pm_getPaymasterData",
  "params": [
        {
      "sender": "0x5A927A01a32cE02AF4B438b7848BceBc52C8Ea3e",
      "nonce": "0x1a",
      "initCode": "0x",
      "callData": "0x0000189a0000000000000000000000001758f42af7026fbbb559dc60ece0de3ef81f665e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002440d097c30000000000000000000000005a927a01a32ce02af4b438b7848bcebc52c8ea3e00000000000000000000000000000000000000000000000000000000",
      "maxFeePerGas": "0x05f5e100",
      "maxPriorityFeePerGas": "0",
      "verificationGasLimit": "0x01536f",
      "callGasLimit": "0x012da1",
      "preVerificationGas": "0x0bcb43",
    }, // unsigned user operation
    "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789", // entry point address
    "0x2105", // chain id
        {
      "mode": "SPONSORED",
      "calculateGasLimits": true,
      "expiryDuration": 300 // duration (secs) for which the generate paymasterAndData will be valid. Default duration is 300 secs.
      "sponsorshipInfo": {
        "webhookData": {},
        "smartAccountInfo": {
            "name": "BICONOMY",
            "version": "2.0.0"
        }
      }
    }
  ],
  "id": 1693369916,
  "jsonrpc": "2.0"
}
```

## Response

```javascript
{
  "jsonrpc": "2.0",
  "id": 1693369916,
  "result": {
    "paymasterAndData": "0xabc..."
  }
}
```
