---
sidebar_label: 'Get UserOperation Status'
sidebar_position: 8
---

# 8. biconomy_getUserOperationStatus

:::caution

This documentation is for using our Bundler API directly. If you are building with the Biconomy SDK you can follow the instructions on this [page](/Bundler/bundlermethods). 

:::

:::info
You can get your Bundler URL from the Biconomy [Dashboard](https://dashboard.biconomy.io/bundlers). This is the same endpoint URL used for all requests. All requests must follow the [JSON RPC](https://www.jsonrpc.org/specification) specifications.
:::

The endpoint is responsible for returning the status of transactionHash associated with the userOpHash. 

Cases:

- Incorrect userOphash sent in the request
- Not submitted on chain (can be in bundler mempool or rejected due to some error)
- Submitted on chain but not included in a block
- Included in a block

The backend should automatically return correct hashes and status in case of bumped up transaction or front runned transactions

## Parameters

Body

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| method | string | Name of method in this case: eth_estimateUserOperationGas  | Required |
| params | array | An array consisting of the userop hash returned by `eth_sendUserOperation`| Required |
| id | string | id for request determined by client for JSON RPC requests  | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0  | Required |

## Request

```json
{
  "method": "biconomy_getUserOperationStatus",
  "params": ["0x9aa5864f9ebb6ec43992bdc957d9bef454c661a351c1698919339cf2587ed11c"],
  "id": 1693369916,
  "jsonrpc": "2.0"
}

```

## Responses

If userOpHash was not found: 

```json

{ 
	"jsonrpc": "2.0", 
	"id": 1693369916, 
	"error": { 
		code: -32094, 
		message: "userOpHash not found", 
	} 
}

```

If userOp is in mempool


```json

{
    "jsonrpc": "2.0",
    "id": 1693369916,
    "result": {
				state: "BUNDLER_MEMPOOL"
		}
}

```

If userOp could not be sent on chain: 

```json

{
    "jsonrpc": "2.0",
    "id": 1693369916,
    "result": {
				state: "DROPPED_FROM_BUNDLER_MEMPOOL"
		}
}

```

If transaction was submitted on chain but not confirmed

```json

{
    "jsonrpc": "2.0",
    "id": 1693369916,
    "result": {
				state: "SUBMITTED",
        transactionHash: "0xabc"
		}
}

```

If transaction is confirmed: 

```json

{
    "jsonrpc": "2.0",
    "id": 1693369916,
    "result": {
			"state": "CONFIRMED",
			"message": "Transaction is confirmed" OR "Transaction was frontrunned, check the new transaction hash in receipt"
			"userOperationReceipt": {
				"userOpHash": "0x9aa5864f9ebb6ec43992bdc957d9bef454c661a351c1698919339cf2587ed11c",
        "entryPoint": "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
        "sender": "0x5A927A01a32cE02AF4B438b7848BceBc52C8Ea3e",
        "nonce": 25,
        "success": "true",
        "paymaster": "0x00000f79b7faf42eebadba19acc07cd08af44789",
        "actualGasCost": 84514000000000,
        "actualGasUsed": 845140,
        "logs": [
            {
                "transactionIndex": 4,
                "blockNumber": 139280938,
                "transactionHash": "0xd6460eae405ea5a03ace5026bd78b27fd5f6ebd255b6ef7320b13188d99084ac",
                "address": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
                "topics": [
                    "0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f",
                    "0x9aa5864f9ebb6ec43992bdc957d9bef454c661a351c1698919339cf2587ed11c",
                    "0x0000000000000000000000005a927a01a32ce02af4b438b7848bcebc52c8ea3e",
                    "0x00000000000000000000000000000f79b7faf42eebadba19acc07cd08af44789"
                ],
                "data": "0x0000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000004cdd72f2d40000000000000000000000000000000000000000000000000000000000000ce554",
                "logIndex": 7,
                "blockHash": "0xad86d2037e714aaea8126e32dfb5c12575d5a89698300ff43d413ddf7990d842"
            }
        ],
        "receipt": {
            "to": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
            "from": "0x125Ad1988Cf1Ec8c2Dd7357621ad825603768365",
            "contractAddress": null,
            "transactionIndex": 4,
            "gasUsed": {
                "_hex": "0x0b4e61",
                "_isBigNumber": true
            },
            "logsBloom": "0x000000000000000000000000000000000000001000000000000000000000000000090000000000002002000100400000001000000000000000000200000000000000000300002000000000280100000000000000000000000000000000000000000000000a0000000000000000000800000000200800000000000010008800000000080000000000000000000000000200000000000040000000000000000000000000000000000000400000000000000000000000000000000002000000200000000002000008001001000000000000004008040400000000004000800020000000000000000000000000000010000000000000000004000000000000000000",
            "blockHash": "0xad86d2037e714aaea8126e32dfb5c12575d5a89698300ff43d413ddf7990d842",
            "transactionHash": "0xd6460eae405ea5a03ace5026bd78b27fd5f6ebd255b6ef7320b13188d99084ac",
            "logs": [
                {
                    "transactionIndex": 4,
                    "blockNumber": 139280938,
                    "transactionHash": "0xd6460eae405ea5a03ace5026bd78b27fd5f6ebd255b6ef7320b13188d99084ac",
                    "address": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
                    "topics": [
                        "0xbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972"
                    ],
                    "data": "0x",
                    "logIndex": 4,
                    "blockHash": "0xad86d2037e714aaea8126e32dfb5c12575d5a89698300ff43d413ddf7990d842"
                },
                {
                    "transactionIndex": 4,
                    "blockNumber": 139280938,
                    "transactionHash": "0xd6460eae405ea5a03ace5026bd78b27fd5f6ebd255b6ef7320b13188d99084ac",
                    "address": "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e",
                    "topics": [
                        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                        "0x0000000000000000000000000000000000000000000000000000000000000000",
                        "0x0000000000000000000000005a927a01a32ce02af4b438b7848bcebc52c8ea3e",
                        "0x000000000000000000000000000000000000000000000000000000000000073f"
                    ],
                    "data": "0x",
                    "logIndex": 5,
                    "blockHash": "0xad86d2037e714aaea8126e32dfb5c12575d5a89698300ff43d413ddf7990d842"
                },
                {
                    "transactionIndex": 4,
                    "blockNumber": 139280938,
                    "transactionHash": "0xd6460eae405ea5a03ace5026bd78b27fd5f6ebd255b6ef7320b13188d99084ac",
                    "address": "0x00000f79B7FaF42EEBAdbA19aCc07cD08Af44789",
                    "topics": [
                        "0x5dc1c754041954fe976773fa441397a7928c7127a1c83904214a7d2563399007",
                        "0x00000000000000000000000095857bffc1cd833cd196af29eb0f61dbc66db4ad",
                        "0x00000000000000000000000000000000000000000000000000004d1565f1d700"
                    ],
                    "data": "0x",
                    "logIndex": 6,
                    "blockHash": "0xad86d2037e714aaea8126e32dfb5c12575d5a89698300ff43d413ddf7990d842"
                },
                {
                    "transactionIndex": 4,
                    "blockNumber": 139280938,
                    "transactionHash": "0xd6460eae405ea5a03ace5026bd78b27fd5f6ebd255b6ef7320b13188d99084ac",
                    "address": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
                    "topics": [
                        "0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f",
                        "0x9aa5864f9ebb6ec43992bdc957d9bef454c661a351c1698919339cf2587ed11c",
                        "0x0000000000000000000000005a927a01a32ce02af4b438b7848bcebc52c8ea3e",
                        "0x00000000000000000000000000000f79b7faf42eebadba19acc07cd08af44789"
                    ],
                    "data": "0x0000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000004cdd72f2d40000000000000000000000000000000000000000000000000000000000000ce554",
                    "logIndex": 7,
                    "blockHash": "0xad86d2037e714aaea8126e32dfb5c12575d5a89698300ff43d413ddf7990d842"
                }
            ],
            "blockNumber": 139280938,
            "confirmations": 1,
            "cumulativeGasUsed": {
                "_hex": "0x140267",
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
}

```

If transaction failed: 


```json

{
    "jsonrpc": "2.0",
    "id": 1693369916,
    "result": {
				state: "FAILED",
				message: "Transaction failed on chain with message: AA 25 invalid nonce"
				transactionHash: "0xabc"
		}
}

```