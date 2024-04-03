---
sidebar_label: "Sponsor UserOperation End Point"
sidebar_position: 2
---

# Sponsor UserOperation End Point
`pm_sponsorUserOperation`

All paymaster URLs allow you to use both Sponsorship and Token Paymasters. To switch between paymasters you will simply change the Mode of a specific request. We will highlight both types of requests below.

This endpoint is responsible for calculating the `paymasterAndData` field, if applicable, for the given request.
The API accepts a partial UserOp and an optional token address. By examining the mode parameter in the request, it identifies the type of paymaster associated with the request and handles the processing accordingly, as described in the following.

### Sponsorship Paymaster

To determine whether a request can be sponsored by the Sponsorship Paymaster, only consider the partial UserOp object and the sponsorshipInfo. If the request cannot be sponsored, the `paymasterAndData` will return "0x".

### Token Paymaster

Consider both the partial `UserOp` and `tokenAddress` parameters in this case. If the `tokenAddress` is absent, an error will be thrown. If both are present, check for the _TokenPaymaster_ flow and send the `paymasterAndData` response accordingly. If the `tokenAddress` is not supported, an error will also be thrown. Please see the error response at the end of this document.

## Parameters

**Body**

| Param   | Type   | Description                                                                    | Required |
| ------- | ------ | ------------------------------------------------------------------------------ | -------- |
| method  | string | Name of method in this case: pm_getFeeQuoteOrData                              | Required |
| params  | array  | An array consisting of the Useroperation object and Paymaster mode information | Required |
| id      | string | id for request determined by client for JSON RPC requests                      | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0                                            | Required |

<br/>
**Params Array for Sponsorship requests**

| Index | Type   | Description                                                                                                                                       | Required |
| ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 0     | object | A partial userOperation object for the userOp that needs to be sponsored                                                                          | Required |
| 1     | object | Mode specified as "SPONSORSHIP" as well as sposorship information which includes any webhook data and smart account information: name and version | Required |

<br/>
**Params Array for ERC20 paymaster requests**

| Index | Type   | Description                                                                                             | Required |
| ----- | ------ | ------------------------------------------------------------------------------------------------------- | -------- |
| 0     | object | A partial userOperation object for the userOp that needs to be sponsored                                | Required |
| 1     | object | Mode specified as "ERC20" as well as tokenInfo: a preferred token address and list of tokens to include | Required |

<br/>
:::note
**"MODE"** is mandatory for `pm_sponsorUserOperation` API,

- If **"MODE"** is **SPONSORED**, we check for request sponsorship. If a request cannot be sponsored, we return 0x. This would mean users will pay for their gas fees.
- If **"MODE"** is ERC20, we return `paymasterAndData` for TokenPaymaster. This would mean that users will pay in their preferred ERC20 Tokens
  :::

## 1. Mode is **SPONSORED** :

> **_POST Request_**

```javascript
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "pm_sponsorUserOperation",
    "params": [
        {
            sender, // address
            nonce, // uint256
            initCode, // string
            callData, // string
            callGasLimit, // string
            verificationGasLimit, // string
            preVerificationGas, // string
            maxFeePerGas, // string
            maxPriorityFeePerGas, // string
            signature // dummy signature string
        },
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
    ]
}

```

> **_Response_**

**Success Response**

```javascript

{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "MODE": "SPONSORED",
        "paymasterAndData": "0xdc91ffb7c4b800d70410a79a5b503ae4391f67e40000000000000000000000007306ac7a32eb690232de81a9ffb44bb346026fab00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000041e1f74852c31150f18ef4e472b748148f8ae031849032218b26170414a18c9f99516eb13a4a9bd35d1334194348cccee3d270b6e7bb400b39f0c8d645266ead601c00000000000000000000000000000000000000000000000000000000000000",
        "preVerificationGas": "75388",
        "verificationGasLimit": 57121,
        "callGasLimit": 108848
    }
}
```

## 2. Mode is **ERC20** :

> **_POST Request:_**

```javascript
{
    "jsonrpc": "2.0",
    "id": 14,
    "method": "pm_sponsorUserOperation",
    "params": [
        {
            sender, // address
            nonce, // uint256
            initCode, // string
            callData, // string
            maxFeePerGas, // string
            maxPriorityFeePerGas, // string
            //optional fields
            callGasLimit, // string
            verificationGasLimit, // string
            preVerificationGas, // string
        },
        {
            "calculateGasLimits": true,
            "mode": "ERC20",
            "tokenInfo": {
                "feeTokenAddress": "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"
            }
        }
    ]
}
```

> **_Response:_**

```javascript
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "MODE": "ERC20",
        "paymasterAndData": "0xdc91ffb7c4b800d70410a79a5b503ae4391f67e40000000000000000000000007306ac7a32eb690232de81a9ffb44bb346026fab00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000041e1f74852c31150f18ef4e472b748148f8ae031849032218b26170414a18c9f99516eb13a4a9bd35d1334194348cccee3d270b6e7bb400b39f0c8d645266ead601c00000000000000000000000000000000000000000000000000000000000000",
        "preVerificationGas": "75388",
        "verificationGasLimit": 57121,
        "callGasLimit": 108848
    }
}
```

In response, the result field will contain `paymasterAndData` to be used in UserOp.
