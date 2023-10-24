---
sidebar_label: 'Get Supported Entry Points'
sidebar_position: 6
---

# 6. eth_supportedEntryPoints

:::info
You can get your Bundler URL from the Biconomy [Dashboard](https://dashboard.biconomy.io/bundlers). This is the same endpoint URL used for all requests. All requests must follow the [JSON RPC](https://www.jsonrpc.org/specification) specifications.
:::

This endpoint returns an array of the entryPoint addresses supported by the bundler. The first element of the array is the entryPoint addressed preferred by the bundler.

## Parameters

Body

| Param | Type | Description | Required |
| --------------- | --------------- | --------------- | --------------- |
| method | string | Name of method in this case: eth_supportedEntryPoints| Required |
| params | array | An empty array with no specific params | Required |
| id | string | id for request determined by client for JSON RPC requests  | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0  | Required |

## Request

```json
{
    "method": "eth_supportedEntryPoints",
    "params": [],
    "id": 1693369916,
    "jsonrpc": "2.0"
}

```

## Response

```json
{
    "jsonrpc": "2.0",
    "id": 1693369916,
    "result": [
        "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"
    ]
}

```