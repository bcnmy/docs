---
sidebar_label: 'Sponsor UserOp End Point'
sidebar_position: 2
---

# 2. pm_sponsorUserOperation

:::info
You can get your Paymaster URL from the Biconomy [Dashboard](https://dashboard.biconomy.io/). This is the same endpoint URL used for all requests. All requests must follow the [JSON RPC](https://www.jsonrpc.org/specification) specifications.

You can test this endpoint on our [Paymaster Explorer](/docs/apireference/PaymasterAPI/explorer)
:::

All paymaster URL's allow you to use both Sponsorship and Token Paymasters. To switch between paymasters you will simply change the Mode of a specific request. We will highlight both type of requests below. 

This endpoint is responsible for calculating the `paymasterAndData` field, if applicable, for the given request.

The API receives a partial `UserOp` and an optional token address. From the mode parameter in request, it checks for the type of paymaster this request is for, and processes the request accordingly, as outlined below.

**Sponsorship Paymaster**

To determine whether a request can be sponsored by the Sponsorship Paymaster, only consider the partial UserOp object and the sponsorshipInfo. If the request cannot be sponsored, it would return "0x" as the `paymasterAndData`.

**Token Paymaster**

Consider both the partial `UserOp` and `tokenAddress` parameters in this case. If the `tokenAddress` is absent, an error will be thrown. If both are present, check for the *TokenPaymaster* flow and send the `paymasterAndData` response accordingly. If the `tokenAddress` is not supported, an error will also be thrown. Please see the error response at the end of this document.

## Parameters

Body

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| method | string | Name of method in this case: pm_getFeeQuoteOrData  | Required |
| params | array | An array consisting of the Useroperation object and Paymaster mode information | Required |
| id | string | id for request determined by client for JSON RPC requests  | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0  | Required |


Params Array for Sponsorship requests

| Index | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| 0 | object | A partial userOperation object for the userOp that needs to be sponsored | Required |
| 1 | object | Mode specified as "SPONSORSHIP" as well as sposorship information which includes any webhook data and smart account information: name and version | Required |

Params Array for ERC20 paymaster requests

| Index | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| 0 | object | A partial userOperation object for the userOp that needs to be sponsored | Required |
| 1 | object | Mode specified as "ERC20" as well as tokenInfo: a preferred token address and list of tokens to include | Required |


:::note
**"MODE"** is mandatory for `pm_sponsorUserOperation` API, 

- If **"MODE"** is **SPONSORED**, we check for request sponsorship. If request cannot be sponsored, we return 0x. This would mean users will pay for their gas fees.
- If **"MODE"** is ERC20, we return `paymasterAndData` for TokenPaymaster. This would mean that users will pay in there preferred ERC20 Tokens
:::

## 1. Mode is **SPONSORED** :

> ***POST Request***

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
        },
        {
            "mode": "SPONSORED",
						"calculateGasLimits": true,
						"expiryDuration": 300 //5mins
            "sponsorshipInfo": {
                "webhookData": {},
                "smartAccountInfo": {
                    "name": "BICONOMY",
                    "version": "1.0.0"
                }
            }
        }
    ]
}

```



> ***Response***

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

> ***POST Request:***

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

> ***Response:***

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



#### 2. Mode is **ERC20** :

> ***POST Request***

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
            maxFeePerGas, // string
            maxPriorityFeePerGas, // string

            //mandatory fields
            callGasLimit, // string 
            verificationGasLimit, // string
            preVerificationGas, // string
            
        },
        {
            "mode": "ERC20",
						"calculateGasLimits" : true,
						"expiryDuration": 300 //5mins
            "tokenInfo": {
                "feeTokenAddress": "0xbf22b04e250a5921ab4dc0d4ced6e391459e92d4"
            }
        }
    ],
}
```

> ***Response***


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

