---
sidebar_position: 3
title: Methods
---
# Smart Account V1 Methods

```typescript
export interface IBiconomySmartAccount extends ISmartAccount {
  init(initilizationData?: InitilizationData): Promise<this>;
  initializeAccountAtIndex(accountIndex: number): void;
  getExecuteCallData(to: string, value: BigNumberish, data: BytesLike): string;
  getExecuteBatchCallData(
    to: Array<string>,
    value: Array<BigNumberish>,
    data: Array<BytesLike>,
  ): string;
  buildUserOp(
    transactions: Transaction[],
    overrides?: Overrides,
  ): Promise<Partial<UserOperation>>;
  getAllTokenBalances(balancesDto: BalancesDto): Promise<BalancesResponse>;
  getTotalBalanceInUsd(balancesDto: BalancesDto): Promise<UsdBalanceResponse>;
  getSmartAccountsByOwner(
    smartAccountByOwnerDto: SmartAccountByOwnerDto,
  ): Promise<SmartAccountsResponse>;
  getTransactionsByAddress(
    chainId: number,
    address: string,
  ): Promise<SCWTransactionResponse[]>;
  getTransactionByHash(txHash: string): Promise<SCWTransactionResponse>;
  getAllSupportedChains(): Promise<SupportedChainsResponse>;
}
```

# IBiconomySmartAccount Interface

The `IBiconomySmartAccount` interface extends the `ISmartAccount` interface and provides additional methods for interacting with a Biconomy Smart Account.

| Method                   | Parameters                                                          | Description                                                                                                                                                                                                                 |     |
| ------------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| init                     | initilizationData?: InitilizationData                               | Initializes the smart account with the provided `initilizationData`, if provided. Returns a Promise that resolves to the initialized `IBiconomySmartAccount`.                                                               |
| initializeAccountAtIndex | accountIndex: number                                                | Initializes the smart account at the specified `accountIndex`.                                                                                                                                                              |
| getExecuteCallData       | to: string, value: BigNumberish, data: BytesLike                    | Returns the call data for executing a single transaction to the specified address (`to`) with the given `value` and `data`.                                                                                                 |
| getExecuteBatchCallData  | to: Array string , value: Array BigNumberish, data: Array BytesLike | Returns the call data for executing a batch of transactions to multiple addresses (`to`) with the corresponding `value` and `data` arrays.                                                                                  |
| buildUserOp              | transactions: Transaction[], overrides?: Overrides                  | Builds a `UserOperation` object from the provided array of `Transaction`s. It also accepts optional `overrides` for specifying gas limits and gas prices. Returns a Promise that resolves to the partial `UserOperation`.   |
| getAllTokenBalances      | balancesDto: BalancesDto                                            | Retrieves the balances of multiple tokens for the smart account based on the provided `balancesDto`. Returns a Promise that resolves to the `BalancesResponse` containing the token balances.                               |
| getTotalBalanceInUsd     | balancesDto: BalancesDto                                            | Retrieves the total balance of all tokens in USD for the smart account based on the provided `balancesDto`. Returns a Promise that resolves to the `UsdBalanceResponse`.                                                    |
| getSmartAccountsByOwner  | smartAccountByOwnerDto: SmartAccountByOwnerDto                      | Retrieves all smart accounts owned by the specified address based on the provided `smartAccountByOwnerDto`. Returns a Promise that resolves to the `SmartAccountsResponse` containing the array of smart account addresses. |
| getTransactionsByAddress | chainId: number, address: string                                    | Retrieves the transactions associated with the specified `address` on the given `chainId`. Returns a Promise that resolves to an array of `SCWTransactionResponse` objects containing information about the transactions.   |
| getTransactionByHash     | txHash: string                                                      | Retrieves the transaction details for the specified transaction hash (`txHash`). Returns a Promise that resolves to a `SCWTransactionResponse` object containing information about the transaction.                         |
| getAllSupportedChains    | N/A                                                                 | Retrieves information about all supported chains. Returns a Promise that resolves to the `SupportedChainsResponse` containing the list of supported chains.                                                                 |

# ISmartAccount Interface

The `ISmartAccount` interface provides essential methods for interacting with a Biconomy Smart Account.

```typescript
import { UserOperation } from "@biconomy/core-types";
import { UserOpResponse } from "@biconomy/bundler";
export interface ISmartAccount {
  getSmartAccountAddress(accountIndex: number): Promise<string>;
  signUserOp(userOperation: UserOperation): Promise<UserOperation>;
  sendUserOp(userOperation: UserOperation): Promise<UserOpResponse>;
  sendSignedUserOp(userOperation: UserOperation): Promise<UserOpResponse>;
}
```

| Method                 | Parameters                   | Description                                                                                                                                                                 |
| ---------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getSmartAccountAddress | accountIndex: number         | Retrieves the address of the smart account at the specified `accountIndex`. Returns a Promise that resolves to the smart account address.                                   |
| signUserOp             | userOperation: UserOperation | Signs the given `UserOperation` with the necessary cryptographic signature. Returns a Promise that resolves to the signed `UserOperation`.                                  |
| sendUserOp             | userOperation: UserOperation | Sends the provided `UserOperation` to the Biconomy network for execution. Returns a Promise that resolves to a `UserOpResponse` containing the response from the network.   |
| sendSignedUserOp       | userOperation: UserOperation | Sends the pre-signed `UserOperation` to the Biconomy network for execution. Returns a Promise that resolves to a `UserOpResponse` containing the response from the network. |
