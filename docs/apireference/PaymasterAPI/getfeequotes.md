---
sidebar_label: ' Get Fee Quotes'
sidebar_position: 1
---
# 1. pm_getFeeQuoteOrData

:::info
You can get your Paymaster URL from the Biconomy [Dashboard](https://dashboard.biconomy.io/). This is the same endpoint URL used for all requests. All requests must follow the [JSON RPC](https://www.jsonrpc.org/specification) specifications.

You can test this endpoint on our [Paymaster Explorer](/docs/apireference/PaymasterAPI/explorer)
:::

All paymaster URL's allow you to use both Sponsorship and Token Paymasters. To switch between paymasters you will simply change the Mode of a specific request. We will highlight both type of requests below. 

This endpoint returns the `MODE` and `paymasterAndData` for sponsored request and returns specific fee quote information for token paymaster requests. 

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




#### 1. Mode is **SPONSORED**: 

> ***POST Request***

```javascript

{
    "jsonrpc": "2.0",
    "method": "pm_getFeeQuoteOrData",
    "id": 1,
    "params": [
        {
            ...partialUserOp
        },
        {
            "mode": "SPONSORED",
			      "calculateGasLimits" : true,
      // Mandatory Fields
            "sponsorshipInfo": {
                "webhookData": {},
                "smartAccountInfo": {
                    "name": "BICONOMY" | "INFINITSM",
                    "version": "1.0.0"
                }
            }
        }
    ]
}
```


> ***Response***

 
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

#### 2. Mode is **ERC20**:

> ***POST Request***

```javascript
{
    "jsonrpc": "2.0",
    "method": "pm_getFeeQuoteOrData",
    "id": 1,
    "params": [
        {
            ..userOpParams
        },
        {
            "mode": "ERC20",
      // Mandatory Fields
            "tokenInfo": {
                "preferredToken": "0xbf22b04e250a5921ab4dc0d4ced6e391459e92d4",
                "tokenList": [
                    "0xdA5289FCAAF71d52A80A254dA614A192B693e975",
                    "0xda5289fcaaf71d52a80a254da614a192b693e977",
                    "0xeabc4b91d9375796aa4f69cc764a4ab509080a58"
                ]
            }
        }
    ]
}
```




> ***Response***

```javascript
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "MODE": "ERC20",
        "paymasterAddress": "0x716bc27e1b904331c58891cc3ab13889127189a7",
        "feeQuotes": [
            {
                "symbol": "USDT",
                "decimal": 18,
                "tokenAddress": "0xbf22b04e250a5921ab4dc0d4ced6e391459e92d4",
                "maxGasFee": 0.25267043311569887,
                "maxGasFeeUSD": 0.0010842277144671015,
                "exchangeRate": 232808808808808800000,
                "premiumPercentage": "13",
                "validUntil": 1686847490,
                "logoUrl": "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png"
            }
        ],
        "unsupportedTokens": [
            "0xbf22b04e250a5921ab4dc0d4ced6e391459e92d3",
            "0xda5289fcaaf71d52a80a254da614a192b693e977",
            "0xeabc4b91d9375796aa4f69cc764a4ab509080a58"
        ]
    }
}
```


:::note
If both `preferredToken` & `tokenList` are present in the request body, but some tokens are not supported by Biconomy, those will be returned also in the response body under `unsupportedTokens`.
:::


