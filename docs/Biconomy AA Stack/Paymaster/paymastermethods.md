---
sidebar_position: 4
---
# Paymaster Methods

Following are the methods that can be called on paymaster instance 

```typescript
export interface IHybridPaymaster<T> extends IPaymaster {
  getPaymasterAndData(
    userOp: Partial<UserOperation>,
    paymasterServiceData?: T
  ): Promise<PaymasterAndDataResponse>
  buildTokenApprovalTransaction(
    tokenPaymasterRequest: BiconomyTokenPaymasterRequest,
    provider: Provider
  ): Promise<Transaction>
  getPaymasterFeeQuotesOrData(
    userOp: Partial<UserOperation>,
    paymasterServiceData: FeeQuotesOrDataDto
  ): Promise<FeeQuotesOrDataResponse>
}

```
| Method |Parameter    | Description                                                                                                                                                                                                                     |
|-----------------------------|----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| getPaymasterAndData         | userOp: Partial UserOperation                    | Accepts a Partial UserOperation object (without signature and paymasterAndData fields) and returns paymasterAndData from PaymasterAndDataResponse.   |
| buildTokenApprovalTransaction | tokenPaymasterRequest: BiconomyTokenPaymasterRequest, provider: Provider | Specifically used for token paymaster sponsorship. It creates an approve transaction for the paymaster that gets batched with other transactions. Note: Automatically called as part of the buildTokenPaymasterUserOp function. |
| getPaymasterFeeQuotesOrData | userOp: Partial UserOperation, paymasterServiceData: FeeQuotesOrDataDto | Fetches quote information or paymaster data based on provided userOperation and paymasterServiceData. Tries sponsorship first and then falls back to serving fee quotes for supported/requested tokens. Can return paymasterAndData. |


#### Below API methods can be used for Biconomy Hybrid paymaster
One can also build their own Paymaster API class and submit a PR or just provide instance of it in the account package / use standalone to generate paymasterAndData

It should follow below Interface. 


```typescript
export interface IPaymaster {
  // Implementing class may add extra parameter (for example paymasterServiceData with it's own type) in below function signature
  getPaymasterAndData(userOp: Partial<UserOperation>): Promise<PaymasterAndDataResponse>
  getDummyPaymasterAndData(userOp: Partial<UserOperation>): Promise<string>
}
```
| Method |Parameter    | Description                                                                                                                                                                                                                     |
|-----------------------------|----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| getDummyPaymasterAndData | userOp: Partial UserOperation | This function is not part of the IHybridPaymaster interface but is specified in the IPaymaster interface. It is optional and can be implemented in the class. It is used to provide a dummy paymaster and data and returns a string as a Promise.|

