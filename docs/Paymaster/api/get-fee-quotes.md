---
sidebar_label: "Get Fee Quotes"
sidebar_position: 1
---

# Get Fee Quotes
`pm_getFeeQuoteOrData`

All paymaster URLs allow you to use both Sponsorship and Token Paymasters. To switch between paymasters you will simply change the Mode of a specific request. We will highlight both types of requests below.

This endpoint returns the `MODE` and `paymasterAndData` for sponsored requests and returns specific fee quote information for token paymaster requests.

## Parameters

Body

| Param   | Type   | Description                                                                    | Required |
| ------- | ------ | ------------------------------------------------------------------------------ | -------- |
| method  | string | Name of method in this case: pm_getFeeQuoteOrData                              | Required |
| params  | array  | An array consisting of the Useroperation object and Paymaster mode information | Required |
| id      | string | id for request determined by client for JSON RPC requests                      | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0                                            | Required |

Params Array for Sponsorship requests

| Index | Type   | Description                                                                                                                                       | Required |
| ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 0     | object | A partial userOperation object for the userOp that needs to be sponsored                                                                          | Required |
| 1     | object | Mode specified as "SPONSORSHIP" as well as sposorship information which includes any webhook data and smart account information: name and version | Required |

Params Array for ERC20 paymaster requests

| Index | Type   | Description                                                                                             | Required |
| ----- | ------ | ------------------------------------------------------------------------------------------------------- | -------- |
| 0     | object | A partial userOperation object for the userOp that needs to be sponsored                                | Required |
| 1     | object | Mode specified as "ERC20" as well as tokenInfo: a preferred token address and list of tokens to include | Required |

Partial UserOperation Object is basically a userOp object which has `paymasterAndData` and `signature` fields as optional, and the gas price values are not final.


#### 1. Mode is **SPONSORED**:

> **_POST Request_**

```json
{
  "jsonrpc": "2.0",
  "method": "pm_getFeeQuoteOrData",
  "id": 1,
  "params": [
    {
      "sender": "sender SA address",
      "nonce": "0x2f",
      "initCode": "0x",
      "callData": "0x0...",
      "signature": "0x0...",
      "maxFeePerGas": "0xc02244",
      "maxPriorityFeePerGas": "0xf4240",
      "verificationGasLimit": "77101",
      "callGasLimit": "2290252",
      "preVerificationGas": "480527",
      "paymasterAndData": "0x"
    },
    {
      "mode": "SPONSORED",
      "calculateGasLimits": true,
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

```json
{
    "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "MODE": "SPONSORED",
            "paymasterAndData": "0x......",
            "preVerificationGas": "75388",
            "verificationGasLimit": 57121,
            "callGasLimit": 108848
    }
}
```
If Mode is set as `SPONSORED`, this request will behave as a sponsored request and `paymasterAndData` field will be populated by the paymaster service.

#### 2. Mode is **ERC20**:

> **_POST Request_**

```json
{
  "jsonrpc": "2.0",
  "method": "pm_getFeeQuoteOrData",
  "id": 1,
  "params": [
    {
      "sender": "sender SA address",
      "nonce": "0x2f",
      "initCode": "0x",
      "callData": "0x0...",
      "signature": "0x0...",
      "maxFeePerGas": "0xc02244",
      "maxPriorityFeePerGas": "0xf4240",
      "verificationGasLimit": "77101",
      "callGasLimit": "2290252",
      "preVerificationGas": "480527",
      "paymasterAndData": "0x"
    },
    {
      "mode": "ERC20",
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

> **_Response_**

```json
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
If both `preferredToken` & `tokenList` are present in the request body, and some of these tokens are not supported by our paymaster, those will also be returned in the response body under `unsupportedTokens`.
:::
