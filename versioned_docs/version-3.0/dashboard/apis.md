---
sidebar_label: "APIs"
sidebar_position: 6
---

# Dashboard APIs

Using these APIs allow you to perform various actions without the need to access the dashboard UI manually.

### Auth Token

To obtain an authToken required in the header, you can generate one in your account settings page on the [biconomy dashboard](https://dashboard.biconomy.io/account).

#### 1. Get list of Paymasters:

> **_GET Request_**

```
https://paymaster-dashboard-backend.prod.biconomy.io/api/v2/public/sdk/paymaster
```

Parameters

Header

| Param     | Type   | Description                        | Required |
| --------- | ------ | ---------------------------------- | -------- |
| authToken | string | Token unique to every user account | Required |

Responses

> **_200 OK_**

```javascript
{
    "statusCode": 200,
    "message": "DApp list fetched",
    "data": [
        {
            "name": "setQuote",
            "chainId": 80002,
            "apiKey": "lU3R_dRgt.22c06266-1faa-4c47-8477-e8eaacd90330"
        },
        {
            "name": "setQuote",
            "chainId": 137,
            "apiKey": "rEEgKf5DS.a4e4f2c9-de7e-4a13-ac2d-6a9120714d61"
        }
    ]
}
```

> **_401 Unauthorized_**

```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```

#### 2. Create a new Paymaster:

> **_POST Request_**

```
https://paymaster-dashboard-backend.prod.biconomy.io/api/v2/public/sdk/paymaster
```

Parameters

Header

| Param     | Type   | Description                        | Required |
| --------- | ------ | ---------------------------------- | -------- |
| authToken | string | Token unique to every user account | Required |

Body

| Param   | Type   | Description                                                             | Required |
| ------- | ------ | ----------------------------------------------------------------------- | -------- |
| name    | string | Unique name of the DApp for a chain id                                  | Required |
| type    | string | Type of paymaster to be set up, in this case will be "HYBRID"           | Required |
| chainId | number | Network on which the DApp exists                                        | Required |
| version | string | String that represents the version of Paymaster to be used for the dApp | Required |

> **_200 OK_**

```javascript
{
    "statusCode": 200,
    "message": "DApp registered successfully",
    "data": {
        "name": "setQuoteAmoy",
        "chainId": 80002,
        "apiKey": "vrTVKqTZI.7ea9dae1-9a06-4c17-a4fb-7728177b76d3" // apiKey is used to init biconomy instance to relay transactions for this Dapp
    }
}
```

> **_400 Bad Request_**

Paymaster Name Already Exists

```javascript
{
    "statusCode": 400,
    "message": "paymaster_name_exists"
}
```

> **_400 Bad Request_**

Chain Id not supported

```javascript
{
    "statusCode": 400,
    "message": "Chain ID not supported"
}
```

> **_401 Unauthorized_**

```javascript
{
    "statusCode": 401,
    "message": "Auth token is required in the headers"
}
```

To manage the smart contracts associated with your DApp, we provide a set of endpoints that allow you to perform actions such as adding, updating, deleting, and retrieving a list of smart contracts. To access these endpoints, you will need to include the "apiKey" parameter in the header of your requests along with the "authToken".

The "apiKey" can be obtained in two ways:

When creating your DApp, you will receive an "apiKey" as part of the registration process.

Alternatively, if you already have a DApp registered, you can find the "apiKey" in the list API of the DApp.

#### 3. Create a Smart Contract:

> **_POST Request_**

URL: "https://paymaster-dashboard-backend.prod.biconomy.io/api/v2/public/sdk/smart-contract"

Parameters

Header

| Param     | Type   | Description                        | Required |
| --------- | ------ | ---------------------------------- | -------- |
| authToken | string | Token unique to every user account | Required |
| apiKey    | string | API Key Associated with dApp       | Required |

Body

| Param              | Type             | Description                                                              | Required |
| ------------------ | ---------------- | ------------------------------------------------------------------------ | -------- |
| name               | string           | Unique name of smart contract                                            | Required |
| address            | string           | Address of smart contract                                                | Required |
| abi                | string           | Stringified ABI of smart contract                                        | Required |
| whitelistedMethods | array of strings | List of method names of smart contract which are to be sponsored by DApp | Optional |

Responses

> **_200 OK_**

```javascript
{
    "statusCode": 200,
    "message": "Smart contract registered successfully"
}
```

> **_400 Bad Request_**

Smart Contract Already Exists

```javascript
{
    "statusCode": 400,
    "message": "Smart contract address already exists"
}
```

> **_401 Unauthorized_**

```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```

#### 4. Get List of Smart Contracts:

> **_GET Request_**

```
https://paymaster-dashboard-backend.prod.biconomy.io/api/v2/public/sdk/smart-contract
```

Parameters

Header

| Param     | Type   | Description                        | Required |
| --------- | ------ | ---------------------------------- | -------- |
| authToken | string | Token unique to every user account | Required |
| apiKey    | string | API Key Associated with dApp       | Required |

> **_200 OK_**

```javascript
{
    "statusCode": 200,
    "message": "Smart contract list fetched",
    "data": [
        {
            "name": "Set Quote",
            "address": "0xe31b0bcbda693bff2529f4a1d9f7e8f6d924c6ab",
            "abi": "[ { \"inputs\": [ { \"internalType\": \"string\", \"name\": \"newQuote\", \"type\": \"string\" } ], \"name\": \"setQuote\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"constructor\" }, { \"inputs\": [], \"name\": \"admin\", \"outputs\": [ { \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"getQuote\", \"outputs\": [ { \"internalType\": \"string\", \"name\": \"currentQuote\", \"type\": \"string\" }, { \"internalType\": \"address\", \"name\": \"currentOwner\", \"type\": \"address\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"owner\", \"outputs\": [ { \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"quote\", \"outputs\": [ { \"internalType\": \"string\", \"name\": \"\", \"type\": \"string\" } ], \"stateMutability\": \"view\", \"type\": \"function\" } ]",
            "whitelistedMethods": [
                "setQuote"
            ],
            "methods": [
                "setQuote"
            ]
        }
    ]
}
```

> **_401 Unauthorized_**

```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```

#### 5. Update Smart Contract Whitelisted Methods:

> **_PATCH Request_**

```
https://paymaster-dashboard-backend.prod.biconomy.io/api/v2/public/sdk/smart-contract
```

Parameters

Header

| Param     | Type   | Description                        | Required |
| --------- | ------ | ---------------------------------- | -------- |
| authToken | string | Token unique to every user account | Required |
| apiKey    | string | API Key Associated with dApp       | Required |

Body

| Param              | Type             | Description                                                              | Required |
| ------------------ | ---------------- | ------------------------------------------------------------------------ | -------- |
| address            | string           | Smart contract address                                                   | Required |
| whitelistedMethods | array of strings | List of method names of smart contract which are to be sponsored by DApp | Required |

Responses

> **_200 OK_**

```javascript
{
    "statusCode": 200,
    "message": "Smart contract updated",
    "data": {
        "name": "Set Quote",
        "address": "0xe31b0bcbda693bff2529f4a1d9f7e8f6d924c6ab",
        "abi": "[ { \"inputs\": [ { \"internalType\": \"string\", \"name\": \"newQuote\", \"type\": \"string\" } ], \"name\": \"setQuote\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" }, { \"inputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"constructor\" }, { \"inputs\": [], \"name\": \"admin\", \"outputs\": [ { \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"getQuote\", \"outputs\": [ { \"internalType\": \"string\", \"name\": \"currentQuote\", \"type\": \"string\" }, { \"internalType\": \"address\", \"name\": \"currentOwner\", \"type\": \"address\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"owner\", \"outputs\": [ { \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [], \"name\": \"quote\", \"outputs\": [ { \"internalType\": \"string\", \"name\": \"\", \"type\": \"string\" } ], \"stateMutability\": \"view\", \"type\": \"function\" } ]",
        "whitelistedMethods": [
            "setQuote"
        ],
        "methods": [
            "setQuote"
        ]
    }

}
```

> **_400 Bad Request_**

Whitelisted methods must be an array

```javascript
{
    "statusCode": 400,
    "message": "whitelistedMethods must be an array"
}
```

> **_401 Unauthorized_**

```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```

> **_404 Not Found_**

Usually, this occurs when incorrect apiKey is used or the address is not added

```javascript
{
    "statusCode": 400,
    "message": "Smart contract not found"
}
```

#### 6. Update Sponsorship Paymaster Funding Wallet:

##### It is a 3-step process.

##### _1. Generate a message from biconomy servers, for the sponsorship paymaster._

> **_GET Request_**

```
https://paymaster-dashboard-backend.prod.biconomy.io/api/v2/public/sdk/funding-message/{{paymasterId}}
```

Headers

| Param     | Type   | Description                        | Required |
| --------- | ------ | ---------------------------------- | -------- |
| authToken | string | Token unique to every user account | Required |
| apiKey    | string | API Key Associated with dApp       | Required |

Responses

> **_200 OK_**

```javascript
{
    "statusCode": 200,
        "message": "Funding message sent",
        "data": {
        "fundingMessage": "Timestamp: November 27, 2023, 5:05 PM\nWelcome to Biconomy! This request will connect your gas tank to our app. It will not trigger a blockchain transaction or incur any fees."
    }
}
```

> **_401 Unauthorized_**

```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```

##### _2. Sign the generated message using the private key of the EOA (Funding Wallet)._

##### _3. Send the request to biconomy to update the funding wallet address._

> **_PATCH Request_**

```
 https://paymaster-dashboard-backend.prod.biconomy.io//api/v2/public/sdk/paymaster
```

Parameters

Header

| Param     | Type   | Description                        | Required |
| --------- | ------ | ---------------------------------- | -------- |
| authToken | string | Token unique to every user account | Required |
| apiKey    | string | API Key Associated with dApp       | Required |

Body

| Param       | Type   | Description                                                 | Required |
| ----------- | ------ | ----------------------------------------------------------- | -------- |
| paymasterId | string | Sponsorship Paymaster Id                                    | Required |
| type        | string | Method Name. <br/>Use "paymasterFundingId" here             | Required |
| signature   | string | Signature generated using private key of EOA                | Required |
| address     | string | Address of the EOA which is to be updated as funding wallet | Required |

Responses

> **_200 OK_**

```javascript
{
    "statusCode": 200,
        "message": "Paymaster updated successfully",
        "data": {
        "name": "testXXX",
        "chainId": 80002,
        "apiKey": "GwfDKydYq.2967f140-XXXX-4042-XXXX-76684f9XXXX",
        "paymasterId": "e998530d-XXXX-451e-XXXX-cb6fXXXXef54"
    }
}
```

> **_400 Bad Request_**

This happens, when there is a signature mismatch, either because an older message is used to generate the signature, or EOA address mentioned in the request body, is not the address which signed the message.

```javascript
{
    "statusCode": 400,
    "message": "Invalid signature"
}
```

> **_401 Unauthorized_**

```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```

> **_404 Not Found_**

Usually, this occurs when incorrect apiKey or authToken is used

```javascript
{
    "statusCode": 404,
    "message": "User not found"
}
```

#### 7. Delete Smart Contract

> **_DELETE Request_**

```
https://paymaster-dashboard-backend.prod.biconomy.io/api/v2/public/sdk/smart-contract
```

Parameters

Header

| Param     | Type   | Description                        | Required |
| --------- | ------ | ---------------------------------- | -------- |
| authToken | string | Token unique to every user account | Required |
| apiKey    | string | API Key Associated with dApp       | Required |

Body

| Param   | Type   | Description            | Required |
| ------- | ------ | ---------------------- | -------- |
| address | string | Smart contract address | Required |

Responses

> **_200 OK_**

```javascript
{
    "statusCode": 200,
    "message": "Smart contract deleted"
}
```

> **_401 Unauthorized_**

```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```

> **_404 Not Found_**

```javascript
{
    "statusCode": 400,
    "message": "Smart contract not found"
}
```
