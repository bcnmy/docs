---
sidebar_label: "Get Chain ID"
sidebar_position: 5
---

# Get Chain ID
`eth_chainId`

This endpoint returns [EIP-155](https://eips.ethereum.org/EIPS/eip-155) Chain ID.

## Parameters

Body

| Param   | Type   | Description                                               | Required |
| ------- | ------ | --------------------------------------------------------- | -------- |
| method  | string | Name of method in this case: eth_chainId                  | Required |
| params  | array  | An empty array with no specific params                    | Required |
| id      | string | id for request determined by client for JSON RPC requests | Required |
| jsonrpc | string | JSON RPC version in this case 2.0.0                       | Required |

## Request

```json
{
  "method": "eth_chainId",
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
  "result": "0xa4b1"
}
```
