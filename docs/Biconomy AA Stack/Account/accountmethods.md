---
sidebar_position: 4
---
# Smart Account Methods
``` typescript
export interface IBiconomySmartAccount extends ISmartAccount {
  init(_initilizationData?: InitilizationData): Promise<this>;
  initializeAccountAtIndex(_accountIndex: number): void;
  getExecuteCallData(_to: string, _value: BigNumberish, _data: BytesLike): string;
  getExecuteBatchCallData(_to: Array<string>, _value: Array<BigNumberish>, _data: Array<BytesLike>): string;
  buildUserOp(_transactions: Transaction[], _overrides?: Overrides): Promise<Partial<UserOperation>>;
  getAllTokenBalances(_balancesDto: BalancesDto): Promise<BalancesResponse>;
  getTotalBalanceInUsd(_balancesDto: BalancesDto): Promise<UsdBalanceResponse>;
  getSmartAccountsByOwner(_smartAccountByOwnerDto: SmartAccountByOwnerDto): Promise<SmartAccountsResponse>;
  getTransactionsByAddress(_chainId: number, _address: string): Promise<SCWTransactionResponse[]>;
  getTransactionByHash(_txHash: string): Promise<SCWTransactionResponse>;
  getAllSupportedChains(): Promise<SupportedChainsResponse>;
  attachSigner(_signer: Signer): Promise<void>;
}
```
# IBiconomySmartAccount Interface

The `IBiconomySmartAccount` interface extends the `ISmartAccount` interface and provides additional methods for interacting with a Biconomy Smart Account.

| Method                   | Parameters                   | Description                                                                                                                                                                 || 
|---------------------------------|------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| init                            | initilizationData?: InitilizationData                                  | Initializes the smart account with the provided `initilizationData`, if provided. Returns a Promise that resolves to the initialized `IBiconomySmartAccount`.                                                                                                           |
| initializeAccountAtIndex        | accountIndex: number                                                   | Initializes the smart account at the specified `accountIndex`.                                                                                                                                                                                                         |
| getExecuteCallData              | to: string, value: BigNumberish, data: BytesLike                        | Returns the call data for executing a single transaction to the specified address (`to`) with the given `value` and `data`.                                                                                                                                               |
| getExecuteBatchCallData         | to: Array string , value: Array BigNumberish, data: Array BytesLike | Returns the call data for executing a batch of transactions to multiple addresses (`to`) with the corresponding `value` and `data` arrays.                                                                                                                            |
| buildUserOp                     | transactions: Transaction[], overrides?: Overrides                   | Builds a `UserOperation` object from the provided array of `Transaction`s. It also accepts optional `overrides` for specifying gas limits and gas prices. Returns a Promise that resolves to the partial `UserOperation`.                                              |
| getAllTokenBalances             | balancesDto: BalancesDto                                                | Retrieves the balances of multiple tokens for the smart account based on the provided `balancesDto`. Returns a Promise that resolves to the `BalancesResponse` containing the token balances.                                                                         |
| getTotalBalanceInUsd            | balancesDto: BalancesDto                                                | Retrieves the total balance of all tokens in USD for the smart account based on the provided `balancesDto`. Returns a Promise that resolves to the `UsdBalanceResponse`.                                                                                                |
| getSmartAccountsByOwner         | smartAccountByOwnerDto: SmartAccountByOwnerDto                         | Retrieves all smart accounts owned by the specified address based on the provided `smartAccountByOwnerDto`. Returns a Promise that resolves to the `SmartAccountsResponse` containing the array of smart account addresses.                                             |
| getTransactionsByAddress        | chainId: number, address: string                                       | Retrieves the transactions associated with the specified `address` on the given `chainId`. Returns a Promise that resolves to an array of `SCWTransactionResponse` objects containing information about the transactions.                                              |
| getTransactionByHash            | txHash: string                                                         | Retrieves the transaction details for the specified transaction hash (`txHash`). Returns a Promise that resolves to a `SCWTransactionResponse` object containing information about the transaction.                                                                    |
| getAllSupportedChains           | N/A                                                                    | Retrieves information about all supported chains. Returns a Promise that resolves to the `SupportedChainsResponse` containing the list of supported chains.                                                                                                           |
| attachSigner           | Ethers Signer                                                                    | Attaach ethers signer object                                                                                                         |




# ISmartAccount Interface
The `ISmartAccount` interface provides essential methods for interacting with a Biconomy Smart Account.
``` typescript
import { UserOperation } from '@biconomy/core-types'
import { UserOpResponse } from '@biconomy/bundler'
export interface ISmartAccount {
  getSmartAccountAddress(accountIndex: number): Promise<string>
  signUserOp(userOperation: UserOperation): Promise<UserOperation>
  sendUserOp(userOperation: UserOperation): Promise<UserOpResponse>
  sendSignedUserOp(userOperation: UserOperation): Promise<UserOpResponse>
}
```

| Method                   | Parameters                   | Description                                                                                                                                                                 |
|--------------------------|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| getSmartAccountAddress   | accountIndex: number | Retrieves the address of the smart account at the specified `accountIndex`. Returns a Promise that resolves to the smart account address.                                |
| signUserOp               | userOperation: UserOperation | Signs the given `UserOperation` with the necessary cryptographic signature. Returns a Promise that resolves to the signed `UserOperation`.                                 |
| sendUserOp               | userOperation: UserOperation | Sends the provided `UserOperation` to the Biconomy network for execution. Returns a Promise that resolves to a `UserOpResponse` containing the response from the network. |
| sendSignedUserOp         | userOperation: UserOperation | Sends the pre-signed `UserOperation` to the Biconomy network for execution. Returns a Promise that resolves to a `UserOpResponse` containing the response from the network. |


# IBaseSmartAccount

```typescript

export interface INon4337Account {
  estimateCreationGas(_initCode: string): Promise<BigNumberish>;
  getNonce(): Promise<BigNumber>;
  signMessage(_message: Bytes | string): Promise<string>;
  getAccountAddress(_accountIndex?: number): Promise<string>;
}

export interface IBaseSmartAccount extends INon4337Account {
  getVerificationGasLimit(_initCode: BytesLike): Promise<BigNumberish>;
  getPreVerificationGas(_userOp: Partial<UserOperation>): Promise<BigNumberish>;
  signUserOp(_userOp: UserOperation): Promise<UserOperation>;
  signUserOpHash(_userOpHash: string): Promise<string>;
  getUserOpHash(_userOp: Partial<UserOperation>): Promise<string>;
  getAccountInitCode(): Promise<string>;
  getDummySignature(): Promise<string>;
}

```

| Method                   | Parameters                   | Description                                                                                                                                                                 |
|--------------------------|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| estimateCreationGas   | _initCode: string | Estimate gas for account creation                       |
| getNonce               | n/a | Returns promise that resolves into big number for nonce                                |
| signMessage               | _message: Bytes or String | Returns signature as promise that resolves to a string |
| getAccountAddress         | accountIndex?: number | Returns address, optionally takes an index if not default address |