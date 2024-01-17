---
sidebar_label: "Get UserOperation by Hash"
sidebar_position: 4
---

# Get UserOperation by Hash
`eth_getUserOperationByHash`

This endpoint returns a UserOperation based on a hash (userOpHash) returned by `eth_sendUserOperation`.

## Parameters

Body

| Param   | Type   | Description                                                                | Required |
| ------- | ------ | -------------------------------------------------------------------------- | -------- |
| method  | string | Name of method in this case: eth_getUserOperationByHash                    | Required |
| params  | array  | An array consisting of the userop hash returned by `eth_sendUserOperation` | Required |
| id      | string | id for request determined by client for JSON RPC requests                  | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0                                        | Required |

## Request

```json
{
  "method": "eth_getUserOperationByHash",
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
    "sender": "0x5A927A01a32cE02AF4B438b7848BceBc52C8Ea3e",
    "nonce": 27,
    "initCode": "0x",
    "callData": "0x0000189a0000000000000000000000001758f42af7026fbbb559dc60ece0de3ef81f665e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002440d097c30000000000000000000000005a927a01a32ce02af4b438b7848bcebc52c8ea3e00000000000000000000000000000000000000000000000000000000",
    "callGasLimit": 77223,
    "preVerificationGas": 1135913,
    "verificationGasLimit": 70106,
    "paymasterAndData": "0x00000f79b7faf42eebadba19acc07cd08af4478900000000000000000000000095857bffc1cd833cd196af29eb0f61dbc66db4ad000000000000000000000000000000000000000000000000000000006526b669000000000000000000000000000000000000000000000000000000006526af6100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000041050fbcff9826c84488f1db121a5ac2c812d5acab6194a0704b0cb81434e968240a7ab145b916a24085e284420e3b6ca55aa4fe1b35f918a8c5d4a2572763891f1b00000000000000000000000000000000000000000000000000000000000000",
    "maxFeePerGas": 100000000,
    "maxPriorityFeePerGas": 0,
    "signature": "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000001c5b32f37f5bea87bdd5374eb2ac54ea8e0000000000000000000000000000000000000000000000000000000000000041c0d738c1911cfac54b56ab345849d3cc6a8cdce545f65a07828c4a947347c04063e83a835f28749740ea13b9563f4accca1c74ff260fda171043d9690e290df31c00000000000000000000000000000000000000000000000000000000000000",
    "entryPoint": "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
    "transactionHash": "0x4a4da7c32ab96281c6c869bf0e5b0ccc5c537ea1c6d887e8ec9de2c4fd5106a6",
    "blockNumber": 139690898,
    "blockHash": "0xac7e9293a01d5ce62859691f668d42c3900af4d56a5de0fb13133dd1b498c5f0"
  }
}
```
