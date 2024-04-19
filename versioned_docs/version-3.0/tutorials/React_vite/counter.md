---
sidebar_position: 2
---

# Counter Smart Contract

[Remix](https://remix.ethereum.org/) is a powerful, open source tool that helps
you write Solidity contracts straight from the browser. Remix also supports
testing, debugging and deploying of smart contracts and much more.

It is recommended to use [Remix](https://remix.ethereum.org/) to create and
deploy smart contracts quickly.

In Remix, when opening a basic template you will see a folder called contracts.
Right click on the folder and create a new contract called Counter.sol and begin
typing the code below.

## License

At the start of your smart contract, you can declare a license. In this case, we
will leave this as UNLICENSED as we are not too concerned about what this code
is used for.

```
// SPDX-License-Identifier: UNLICENSED
```

## Mention Compiler Version

```
pragma solidity ^0.8.9;
```

:::caution Make sure the solidity version declared in the contract matches your
compiler version

:::

Now let's write out our contract:

```solidity
contract Counter {
    uint256 public count;

    event updateCount(uint newCount);

    function incrementCount() public returns(uint256) {
        count +=1;
        emit updateCount(count);
        return count;
    }
}
```

Here is a breakdown of what this contract is doing:

1. `uint256 public count`: This line declares a public unsigned integer variable
   named count. Unsigned integers are non-negative numbers. The `public` keyword
   automatically generates a function that allows you to access the current
   value of the `count` state variable from outside the contract.
2. `event updateCount(uint newCount)`: This line declares an event named
   `updateCount`. Events are a way for your contract to communicate that
   something happened on the blockchain to your app front-end, which can be
   'listening' for certain events and take action when they happen. In this
   case, the event will emit the new value of `count`.
3. `function incrementCount() public returns(uint256)`: This line declares a
   public function named incrementCount that doesn't take any parameters and
   returns an unsigned integer. Inside the incrementCount function:

- `count +=1`: This line increases the `count` variable by one.
- `emit updateCount(count)`: This line triggers the `updateCount` event and
  sends the new value of the count variable to the listener.
- `return count`: This line returns the new value of `count`.

Now that we have our basic contract let's deploy this to the Polygon Amoy Test
Network. You can follow the official
[Remix Documentation](https://remix-ide.readthedocs.io/en/latest/run.html) for
Deployment to get this deployed and verified.
