---
sidebar_label: "Get Chain ID"
sidebar_position: 5
---

# 5. eth_chainId

:::caution

This documentation is for using our Bundler API directly. If you are building with the Biconomy SDK you can follow the instructions on this [page](/Bundler/bundlermethods).

:::

:::info
You can get your Bundler URL from the Biconomy [Dashboard](https://dashboard.biconomy.io/bundlers). This is the same endpoint URL used for all requests. All requests must follow the [JSON RPC](https://www.jsonrpc.org/specification) specifications.
:::

This endpoint returns [EIP-155](https://eips.ethereum.org/EIPS/eip-155) Chain ID

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
