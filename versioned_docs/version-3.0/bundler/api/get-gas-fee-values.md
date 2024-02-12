---
sidebar_label: "Get gas fee values"
sidebar_position: 7
title: Get gas fee values
---

# Get gas fee values
`biconomy_getGasFeeValues`

This endpoint returns the maxFeePerGas & maxPriorityFeePerGas.

## Parameters

Body

| Param   | Type   | Description                                               | Required |
| ------- | ------ | --------------------------------------------------------- | -------- |
| method  | string | Name of method in this case: biconomy_getGasFeeValues     | Required |
| params  | array  | An empty array with no specific params                    | Required |
| id      | string | id for request determined by client for JSON RPC requests | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0                       | Required |

## Request

```json
{
  "method": "biconomy_getGasFeeValues",
  "params": [],
  "id": 1697033314,
  "jsonrpc": "2.0"
}
```

## Response

```json
{
  "jsonrpc": "2.0",
  "id": 1697033314,
  "result": {
    "maxPriorityFeePerGas": "100000000",
    "maxFeePerGas": "100000000"
  }
}
```
