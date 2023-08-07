---
sidebar_label: 'Sponsor UserOp End Point'
sidebar_position: 2
---

# Sponsor UserOp End Point

The Paymaster Service will introduce two new endpoints for Token and Sponsorship paymasters. Both endpoints must follow the [JSON RPC](https://www.jsonrpc.org/specification) specifications.


:::info
You can get your paymasterUrl from Biconomy Dashboard after registering the paymaster. The Paymaster will look like this
https://paymaster.biconomy.io/api/v1/{chainId}/[YOUR_API_KEY_HERE]

 The endpoint URL will same as paymasterURL for both `pm_getFeeQuotesOrData` and `pm_sponsorUserOperation`.

:::

--------


### 2. Sponsor UserOp End Point

**`pm_sponsorUserOperation`** : This API is responsible for calculating the `paymasterAndData` field, if applicable, for the given request.

The API receives a partial `UserOp` and an optional token address. From the mode parameter in request, it checks for the type of paymaster this request is for, and processes the request accordingly, as outlined below.

**Sponsorship Paymaster**

To determine whether a request can be sponsored by the Sponsorship Paymaster, only consider the partial UserOp object and the sponsorshipInfo. If the request cannot be sponsored, it would return "0x" as the `paymasterAndData`.

**Token Paymaster**

Consider both the partial `UserOp` and `tokenAddress` parameters in this case. If the `tokenAddress` is absent, an error will be thrown. If both are present, check for the *TokenPaymaster* flow and send the `paymasterAndData` response accordingly. If the `tokenAddress` is not supported, an error will also be thrown. Please see the error response at the end of this document.


:::note
**"MODE"** is mandatory for `pm_sponsorUserOperation` API, 

- If **"MODE"** is **SPONSORED**, we check for request sponsorship. If request cannot be sponsored, we return 0x. This would mean users will pay for their gas fees.
- If **"MODE"** is ERC20, we return `paymasterAndData` for TokenPaymaster. This would mean that users will pay in there preferred ERC20 Tokens
:::

#### 1. Mode is **ERC20** :

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
			"tokenInfo": {
				"feeTokenAddress": "0xbf22b04e250a5921ab4dc0d4ced6e391459e92d4"
			}
		}
	],
}

```

<details>
  <summary> Check for params here: </summary>

`params` is an array where 

| Index | Description |
| --- | --- |
| 0 | Partial `UserOp` without signature and `paymasterAndData` |
| 1 | Context data containing extra information based on type of paymaster used.

`mode`
Mandatory Field. Values can be SPONSORED or ERC20

`tokenInfo`
In case of MODE is ERC20, `tokenInfo` needs to be present in the request body.

`sponsorshipInfo`
In case of MODE is SPONSORED, `sponsorshipInfo` needs to be present in the request body.
*Webhook is optional.*
*SmartAcountInfo is Mandatory.* |


  </details>

> ***Response***

**Success Response**

```javascript

{
	"jsonrpc": "2.0",
	"id": 14,
	"result": {
		"paymasterAndData": "0xsdfsdfa000000asas..."
	}
}
```

In response, the result field will contain `paymasterAndData` to be used in UserOp.

:::note

In the above REQUEST, the user has the option to include **`calculateGasLimits`** parameter that allows us us to *calculate the gas specific fields from userOp* again. This can be set to either **`true`** or **`false`** . When **`calculateGasLimits`**  is not explicitly included in the request, it defaults to **`false`** which is the case in above REQUEST and the value returned is ` "paymasterAndData: "0xsdfsdfa000000asas..."` .

If the value was **`true`**, this is how the **REQUEST** and **RESPONSE** would look like:

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
	"id": 14,
	"result": {
		"preVerificationGas": "2320098",
		"verificationGasLimit": 2647740,
		"callGasLimit": 600000,
		"paymasterAndData": "0xsdfsdfsdfsdf....."
	}
}
```
:::



#### 2. Mode is **SPONSORED** :

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
	"id": 14,
	"result": {
		"paymasterAndData": "0xsdfsdfa000000asas..."
	}
}
```


In response, the result field will contain `paymasterAndData` to be used in UserOp.

