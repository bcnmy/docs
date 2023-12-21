---
sidebar_label: "Get UserOp Receipt"
sidebar_position: 3
---

# 3. eth_getUserOperationReceipt

:::caution

This documentation is for using our Bundler API directly. If you are building with the Biconomy SDK you can follow the instructions on this [page](/Bundler/bundlermethods).

:::

:::info
You can get your Bundler URL from the Biconomy [Dashboard](https://dashboard.biconomy.io/bundlers). This is the same endpoint URL used for all requests. All requests must follow the [JSON RPC](https://www.jsonrpc.org/specification) specifications.

You can test this endpoint on our [Bundler Explorer](/Bundler/explorer)
:::

This endpoint returns a UserOperation receipt based on a hash (userOpHash) returned by `eth_sendUserOperation`

## Parameters

Body

| Param   | Type   | Description                                                                | Required |
| ------- | ------ | -------------------------------------------------------------------------- | -------- |
| method  | string | Name of method in this case: eth_getUserOperationReceipt                   | Required |
| params  | array  | An array consisting of the userop hash returned by `eth_sendUserOperation` | Required |
| id      | string | id for request determined by client for JSON RPC requests                  | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0                                        | Required |

## Request

```json
{
  "method": "eth_getUserOperationReceipt",
  "params": [
    "0x10b68dfde047c51e2f4a500281a715710c7b1c0517b87ad0b48229042f61ac0e"
  ],
  "id": 1693369916,
  "jsonrpc": "2.0"
}
```

## Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "userOpHash": "0x10b68dfde047c51e2f4a500281a715710c7b1c0517b87ad0b48229042f61ac0e",
    "entryPoint": "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
    "sender": "0x5A927A01a32cE02AF4B438b7848BceBc52C8Ea3e",
    "nonce": 27,
    "success": "true",
    "paymaster": "0x00000f79b7faf42eebadba19acc07cd08af44789",
    "actualGasCost": 124885600000000,
    "actualGasUsed": 1248856,
    "logs": [
      {
        "transactionIndex": 1,
        "blockNumber": 139690898,
        "transactionHash": "0x4a4da7c32ab96281c6c869bf0e5b0ccc5c537ea1c6d887e8ec9de2c4fd5106a6",
        "address": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        "topics": [
          "0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f",
          "0x10b68dfde047c51e2f4a500281a715710c7b1c0517b87ad0b48229042f61ac0e",
          "0x0000000000000000000000005a927a01a32ce02af4b438b7848bcebc52c8ea3e",
          "0x00000000000000000000000000000f79b7faf42eebadba19acc07cd08af44789"
        ],
        "data": "0x000000000000000000000000000000000000000000000000000000000000001b00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000719531d358000000000000000000000000000000000000000000000000000000000000130e58",
        "logIndex": 3,
        "blockHash": "0xac7e9293a01d5ce62859691f668d42c3900af4d56a5de0fb13133dd1b498c5f0"
      }
    ],
    "receipt": {
      "to": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      "from": "0x60db9F05022FfA4C1D23107d8870F22ae31924d6",
      "contractAddress": null,
      "transactionIndex": 1,
      "gasUsed": {
        "_hex": "0x10c234",
        "_isBigNumber": true
      },
      "logsBloom": "0x000000420000000000000000000000000000000100000000000000000000000000090000000010002002000100400000001000000000000000000200000000000000000000000000000000280000000000000400000000000000000000000000000000004a0000000000000000000800000000000800000000000010000800000000080000000000000000000000040200000000000040000000000000100000000000000000000000400000000000000000000000000000000002000000200000000002000008001001000000000000004008040400000000004000800020000000000000000000000000000000000000000000000000000000000080000000",
      "blockHash": "0xac7e9293a01d5ce62859691f668d42c3900af4d56a5de0fb13133dd1b498c5f0",
      "transactionHash": "0x4a4da7c32ab96281c6c869bf0e5b0ccc5c537ea1c6d887e8ec9de2c4fd5106a6",
      "logs": [
        {
          "transactionIndex": 1,
          "blockNumber": 139690898,
          "transactionHash": "0x4a4da7c32ab96281c6c869bf0e5b0ccc5c537ea1c6d887e8ec9de2c4fd5106a6",
          "address": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
          "topics": [
            "0xbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972"
          ],
          "data": "0x",
          "logIndex": 0,
          "blockHash": "0xac7e9293a01d5ce62859691f668d42c3900af4d56a5de0fb13133dd1b498c5f0"
        },
        {
          "transactionIndex": 1,
          "blockNumber": 139690898,
          "transactionHash": "0x4a4da7c32ab96281c6c869bf0e5b0ccc5c537ea1c6d887e8ec9de2c4fd5106a6",
          "address": "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e",
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000005a927a01a32ce02af4b438b7848bcebc52c8ea3e",
            "0x0000000000000000000000000000000000000000000000000000000000000741"
          ],
          "data": "0x",
          "logIndex": 1,
          "blockHash": "0xac7e9293a01d5ce62859691f668d42c3900af4d56a5de0fb13133dd1b498c5f0"
        },
        {
          "transactionIndex": 1,
          "blockNumber": 139690898,
          "transactionHash": "0x4a4da7c32ab96281c6c869bf0e5b0ccc5c537ea1c6d887e8ec9de2c4fd5106a6",
          "address": "0x00000f79B7FaF42EEBAdbA19aCc07cD08Af44789",
          "topics": [
            "0x5dc1c754041954fe976773fa441397a7928c7127a1c83904214a7d2563399007",
            "0x00000000000000000000000095857bffc1cd833cd196af29eb0f61dbc66db4ad",
            "0x000000000000000000000000000000000000000000000000000071cd24d25b00"
          ],
          "data": "0x",
          "logIndex": 2,
          "blockHash": "0xac7e9293a01d5ce62859691f668d42c3900af4d56a5de0fb13133dd1b498c5f0"
        },
        {
          "transactionIndex": 1,
          "blockNumber": 139690898,
          "transactionHash": "0x4a4da7c32ab96281c6c869bf0e5b0ccc5c537ea1c6d887e8ec9de2c4fd5106a6",
          "address": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
          "topics": [
            "0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f",
            "0x10b68dfde047c51e2f4a500281a715710c7b1c0517b87ad0b48229042f61ac0e",
            "0x0000000000000000000000005a927a01a32ce02af4b438b7848bcebc52c8ea3e",
            "0x00000000000000000000000000000f79b7faf42eebadba19acc07cd08af44789"
          ],
          "data": "0x000000000000000000000000000000000000000000000000000000000000001b00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000719531d358000000000000000000000000000000000000000000000000000000000000130e58",
          "logIndex": 3,
          "blockHash": "0xac7e9293a01d5ce62859691f668d42c3900af4d56a5de0fb13133dd1b498c5f0"
        }
      ],
      "blockNumber": 139690898,
      "confirmations": 1,
      "cumulativeGasUsed": {
        "_hex": "0x10c234",
        "_isBigNumber": true
      },
      "effectiveGasPrice": {
        "_hex": "0x05f5e100",
        "_isBigNumber": true
      },
      "status": 1,
      "type": 2,
      "byzantium": true
    }
  }
}
```
