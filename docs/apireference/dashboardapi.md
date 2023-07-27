---
sidebar_label: 'Dashboard API'
sidebar_position: 2

---

# Dashboard APIs


Using these APIs allow you to perform various actions without the need to access the dashboard UI manually.

### Auth Token

To obtain an authToken required in the header, please reach out to our support team.



#### 1. Get list of dApps: 

> ***GET Request***

URL: https://paymaster-dashboard-backend.prod.biconomy.io/api/v1/public/sdk/dapp

Parameters

Header

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| authToken | string | Token unique to every user account | Required |


Responses

> ***200 OK***


```javascript
{
    "statusCode": 200,
    "message": "DApp list fetched",
    "data": [
        {
            "name": "setQuote",
            "chainId": 80001,
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

> ***401 Unauthorized***


```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```

#### 2. Create a new dApp: 

> ***POST Request***

URL: https://paymaster-dashboard-backend.prod.biconomy.io/api/v1/public/sdk/dapp

Parameters

Header

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| authToken | string | Token unique to every user account | Required |

Body

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| name | string | Unique name of the DApp for a chain id | Required |
| chainId | number | Network on which the DApp exists | Required |

> ***200 OK***


```javascript
{
    "statusCode": 200,
    "message": "DApp registered successfully",
    "data": {
        "name": "setQuoteMumbai",
        "chainId": 80001,
        "apiKey": "vrTVKqTZI.7ea9dae1-9a06-4c17-a4fb-7728177b76d3" // apiKey is used to init biconomy instance to relay transactions for this Dapp
    }
}
```

> ***400 Bad Request***

Dapp Name Already Exists

```javascript
{
    "statusCode": 400,
    "message": "Dapp name already exists"
}
```

> ***400 Bad Request***

Chain Id not supported

```javascript
{
    "statusCode": 400,
    "message": "Chain ID not supported"
}
```

> ***401 Unauthorized***


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

> ***POST Request***

URL: https://paymaster-dashboard-backend.prod.biconomy.io/api/v1/public/sdk/smart-contract

Parameters

Header

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| authToken | string | Token unique to every user account | Required |
| apiKey | string | API Key Associated with dApp | Required |

Body

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| name | string | Unique name of smart contract | Required |
| address | string | Address of smart contract | Required |
| abi | string | Stringified ABI of smart contract | Required |
| whitelistedMethods | array of strings | List of method names of smart contract which are to be sponsored by DApp | Optional |

Responses

> ***200 OK***


```javascript
{
    "statusCode": 200,
    "message": "Smart contract registered successfully"
}
```

> ***400 Bad Request***

Smart Contract Already Exists

```javascript
{
    "statusCode": 400,
    "message": "Smart contract address already exists"
}
```

> ***401 Unauthorized***


```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```


#### 4. Get List of Smart Contracts:

> ***GET Request***

URL: https://paymaster-dashboard-backend.prod.biconomy.io/api/v1/public/sdk/smart-contract

Parameters

Header

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| authToken | string | Token unique to every user account | Required |
| apiKey | string | API Key Associated with dApp | Required |

> ***200 OK***


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

> ***401 Unauthorized***


```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```


#### 5. Update Smart Contract Whitelisted Methods:

> ***PATCH Request***

Parameters

Header

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| authToken | string | Token unique to every user account | Required |
| apiKey | string | API Key Associated with dApp | Required |

Body

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| address | string | Smart contract address | Required |
| whitelistedMethods | array of strings | List of method names of smart contract which are to be sponsored by DApp | Required |

Responses 

> ***200 OK***


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

> ***400 Bad Request***

Whitelisted methods must be an array

```javascript
{
    "statusCode": 400,
    "message": "whitelistedMethods must be an array"
}
```

> ***401 Unauthorized***


```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```

> ***404 Not Found***

Usually, this occurs when incorrect apiKey is used or the address is not added 

```javascript
{
    "statusCode": 400,
    "message": "Smart contract not found"
}
```

#### 6. Delete Smart Contract

> ***DELETE Request***

Parameters

Header

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| authToken | string | Token unique to every user account | Required |
| apiKey | string | API Key Associated with dApp | Required |

Body

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| address | string | Smart contract address | Required |

Responses 

> ***200 OK***


```javascript
{
    "statusCode": 200,
    "message": "Smart contract deleted"
}
```

> ***401 Unauthorized***


```javascript
{
    "statusCode": 401,
    "message": "Auth token and API key is required in the headers"
}
```

> ***404 Not Found***

```javascript
{
    "statusCode": 400,
    "message": "Smart contract not found"
}
```