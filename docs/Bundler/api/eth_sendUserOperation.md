---
sidebar_label: 'Send Useroperation'
sidebar_position: 2
---

# 2. eth_sendUserOperation

:::caution

This documentation is for using our Bundler API directly. If you are building with the Biconomy SDK you can follow the instructions on this [page](/Bundler/bundlermethods). 

:::

:::info
You can get your Bundler URL from the Biconomy [Dashboard](https://dashboard.biconomy.io/bundlers). This is the same endpoint URL used for all requests. All requests must follow the [JSON RPC](https://www.jsonrpc.org/specification) specifications.

You can test this endpoint on our [Bundler Explorer](/Bundler/explorer)
:::

This endpoint submits a User Operation object to the User Operation pool of the bundler. The result is set to the userOpHash if and only if the request passed simulation and was accepted in the client’s User Operation pool. If the validation, simulation, or User Operation pool inclusion fails, the failure reason will be returned.

## Parameters

Body

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| method | string | Name of method in this case: eth_sendUserOperation  | Required |
| params | array | An array consisting of the Useroperation object, Bundler address, and simulation type. | Required |
| id | string | id for request determined by client for JSON RPC requests  | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0  | Required |

:::info
The params array in this request takes an additional argument for "simulation_type". This determines how and when the UserOperation is simulated. Your options are: 

1. Set  `simulation_type : "validation"` or do not pass this param, if you want only userOp validation checks to be performed on bundler

2. Set `simulation_type : "validation_and_execution"` if you want both userOp validation & execution to be checked on the bundler. Please note, this would mean added latency for this request.
:::

## Request

```json

{
    "method": "eth_sendUserOperation",
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
            "paymasterAndData": "0x",
            "signature": "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000001c5b32f37f5bea87bdd5374eb2ac54ea8e000000000000000000000000000000000000000000000000000000000000004192bbb8c80bb259efefdb183e78289a44517ac4892db4acf2c2f436b4e5a863842f42a8b143e184097bdcf30230b1c48aef87617ab821709384ecf6c44441eea31b00000000000000000000000000000000000000000000000000000000000000"
        },
        "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
        {
            "simulation_type": "validation"
        }
    ],
    "id": 1697033407,
    "jsonrpc": "2.0"
}

```

:::info
The request also accepts maxFeePerGas, maxPriorityFeePerGas, verificationGasLimit, callGasLimit, preVerificationGas as numbers in either hexadecimal format as shown above or as decimal strings like so.

```json
"maxFeePerGas": "50000000000",
"maxPriorityFeePerGas": "20000000000",
"verificationGasLimit": "100000",
"callGasLimit": "200000",
"preVerificationGas": "60000",
```
:::



## Response

Responses are exactly as per [ERC4337 spec](https://eips.ethereum.org/EIPS/eip-4337#rpc-methods-eth-namespace:~:text=supportedEntryPoints%20rpc%20call.-,Return,-value%3A)