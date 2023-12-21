---
sidebar_position: 3
---

# Smart Account Factory Contract

Factory for deploying Smart Accounts as Proxies

(https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-contract-wallet/SmartAccountFactory.sol)

It is a Factory contract that is responsible for deploying Smart Accounts using `CREATE2` and CREATE opcodes.

It deploys Smart Accounts as proxies pointing to `basicImplementation` that is immutable for this factory.

This allows keeping the same address for the same Smart Account `owner` on various chains via `CREATE2`.

The Smart Account is initialized directly after its deployment with owner and callback handler info.

**_getAddressForCounterFactualAccount()_**

Returns an address for the Smart Account when it will be deployed by this factory with the same `_owner` and `_index` values. `_index` serves as a salt to be able to deploy several Smart Accounts for the same user from this factory.

```javascript
function getAddressForCounterFactualAccount(
        address _owner,
        uint256 _index
    ) external view returns (address _account)
```

**_deployCounterFactualAccount()_**

Deploys Smart Account with `CREATE2` and returns its address.

```javascript
function deployCounterFactualAccount(
        address _owner,
        uint256 _index
    ) public returns (address proxy)
```

**_deployAccount()_**

Deploys account using `CREATE` (thus it deploys with a random address, rather than a counterfactual).

```javascript
function deployAccount(address _owner) public returns (address proxy)
```
