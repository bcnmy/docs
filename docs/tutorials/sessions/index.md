---
sidebar_position: 6
title: Sessions
---

The following tutorials provide a detailed, step-by-step guide on how to integrate Account Abstraction Sessions. If you're developing in TypeScript, it's recommended to utilize the SDK.

Before proceeding it is worth understanding an important data model that developers are expected to understand prior to working with sessions (both single and batch). It is a low-level building block upon which sessions are built: the [Rule](#rules)

```typescript
/** Defines permissions for the args of an allowed method. */
export interface Rule {
  /**
   * The offset in the ABI SVM contract helps locate the relevant data within the function call data
   */
  offset: number;
  /**
   * condition
   *
   * 0 - Equal
   * 1 - Less than or equal
   * 2 - Less than
   * 3 - Greater than or equal
   * 4 - Greater than
   * 5 - Not equal
   */
  condition: number;
  /** The value to compare against. */
  referenceValue:
    | string
    | number
    | bigint
    | boolean
    | ByteArray
    | HardcodedReference;
}

/** Use the HardcodedReference type to bypass the auto-formatting which may mis-align your offset. */
export type HardcodedReference = {
  raw: Hex;
};
```

## Rules

Rules define permissions for the args of an allowed method.
With rules, you can precisely define what should be the args of the transaction that is allowed for a given Session.
Every Rule works with a single static arg or a 32-byte chunk of the dynamic arg.

Since the ABI Encoding translates every static param into a 32-bytes word, even the shorter ones (like `address` or `uint8`), every Rule defines a desired relation (`Condition`) between n-th 32bytes word of the `calldata` and a reference Value (that is obviously a 32-bytes word as well).

So, when dApp is creating a `_sessionKeyData` to enable a session, it should convert every shorter static arg to a 32bytes word to match how it will be actually ABI encoded in the `userOp.callData`.

For the dynamic args, like `bytes`, every 32-bytes word of the `calldata` such as offset of the bytes arg, length of the bytes arg, and n-th 32-bytes word of the bytes arg can be controlled by a dedicated Rule.

### Offset

The offset in the ABI SVM contract helps locate the relevant data within the function call data, it serves as a reference point from which to start reading or extracting specific information required for validation.
When processing function call data, particularly in low-level languages like Solidity assembly, it's necessary to locate where specific parameters or arguments are stored.
The offset is used to calculate the starting position within the `calldata` where the desired data resides.
Suppose we have a function call with multiple arguments passed as `calldata`. Each argument occupies a certain number of bytes, and the offset helps determine where each argument begins within the `calldata`.

**Using the offset to Extract Data:**
In the contract, the offset is used to calculate the position within the `calldata` where specific parameters or arguments are located. Since every arg is a 32-bytes word, offsets are always multiplier of 32 (or of 0x20 in hex).

Let's see how the offset is applied to extract the to and value arguments of a transfer(address to, uint256 value) method:

Extracting to Argument:
The to argument is the first parameter of the transfer function, representing the recipient address. Every `calldata` starts with the 4-bytes method selector. However, the ABI SVM is adding the selector length itself, so for the first argument the offset will always be 0 (0x00);

Extracting value Argument:
The value argument is the second parameter of the transfer function, representing the amount of tokens to be transferred. To extract this argument, the offset for the value parameter would be calculated based on its position in the function `calldata`. Despite to is a 20-bytes address, in the solidity abi encoding it is always appended with zeroes to a 32-bytes word. So the offset for the second 32-bytes argument (which isthe value in our case) will be 32 (or 0x20 in hex).

If you need to deal with dynamic-length arguments, such as bytes, please refer to this document https://docs.soliditylang.org/en/v0.8.24/abi-spec.html#function-selector-and-argument-encoding
to learn more about how dynamic arguments are represented in the `calldata` and which offsets should be used to access them.

### Condition

The condition is used to determine how we are checking the actual reference value, the condition can be of many types:

- 0: EQUAL
- 1: LESS_THAN_OR_EQUAL
- 2: LESS_THAN
- 3: GREATER_THAN_OR_EQUAL
- 4: GREATER_THAN
- 5: NOT_EQUAL
  In our example the condition is 0, this means we check that the receiver of the NFT is EQUAL to what we set it to be.

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
