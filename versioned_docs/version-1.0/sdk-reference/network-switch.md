---
sidebar_position: 7
---

# Network Switching

Let's talk about network switching. Biconmy SDK allows for easy network switching.

```js
import {
  ChainId
} from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";

// Get the EOA provider for choice of your wallet which manages your signer

const { provider, address } = useWeb3AuthContext();
const walletProvider = new ethers.providers.Web3Provider(provider);

// Initialize the Smart Account

let options = {
 activeNetworkId: ChainId.GOERLI,
 supportedNetworksIds: [ ChainId.GOERLI, ChainId.POLYGON_MAINNET, ChainId.POLYGON_MUMBAI
 ]}
  
let smartAccount = new SmartAccount(walletProvider, options);
smartAccount = await smartAccount.init();
```

In the example above, Goerli has been selected as the currently active chain. Goerli, Polygon Mainnet, and Polygon Mumbai are the supported chains.

Once the wallet instance is instantiated, and the default chain is selected, dApp can choose to make transactions on any of the supported chains other than a currently active chain.  

You can do that in two ways.

## Active switching

The first one is active switching to a different network (for complete smart account API)

```js
// you can change your active chain and make transactions
smartAccount.setActiveChain(ChainId.POLYGON_MAINNET)
// Now your default active chain has been changed from GOERLI to POLYGON MAINNET
```

## Temporary Switching

The second way is to just change the **chainId** in the DTO (Data Transfer Object) of the method. This will only affect the current action while the remaining actions will be executed on the chain that is currently active by default.

```js
const txResponse = await smartAccount.sendTransaction({ chainId: ChainId.POLYGON_MAINNET,
    transaction: tx1 
});
```

When instantiating the wallet instance, GOERLI is currently used as the default chainId.

However, in the Transaction DTO you state Polygon Mainnet as the chain to execute this exact transaction on.

List of the methods whose DTOs support custom ChainId

```js
1. sendTransaction(
    transactionDto: TransactionDto
  ): Promise<TransactionResponse>
  
2. sendTransactionBatch(
    transactionBatchDto: TransactionBatchDto
  ): Promise<TransactionResponse>
  
3. getAlltokenBalances(
    balancesDto: BalancesDto,
    chainId: ChainId = this.#smartAccountConfig.activeNetworkId
  ): Promise<BalancesResponse>

4. getTotalBalanceInUsd(
    balancesDto: BalancesDto,
    chainId: ChainId = this.#smartAccountConfig.activeNetworkId
  ): Promise<UsdBalanceResponse>

5. getSmartAccountsByOwner(
    smartAccountByOwnerDto: SmartAccountByOwnerDto
  )

6. getTransactionByAddress(
    chainId: number,
    address: string
  ): Promise<SCWTransactionResponse[]>
 
7. signTransaction(signTransactionDto: SignTransactionDto): Promise<string>

8. sendTransaction(sendTransactionDto: SendTransactionDto): Promise<string>

9. getFeeQuotesForBatch(
    getFeeQuotesForBatchDto: PrepareRefundTransactionDto
  ): Promise<FeeQuote[]>
 
10. prepareRefundTransactionBatch(
    getFeeQuotesForBatchDto: GetFeeQuotesForBatchDto
  ): Promise<FeeQuote[]>

11. createUserPaidTransaction(
    createUserPaidTransactionDto: CreateUserPaidTransactionDto
  ): Promise<IWalletTransaction>

12. createTransaction(transactionDto: TransactionDto): Promise<IWalletTransaction>

13. createTransactionBatch(
    transactionBatchDto: TransactionBatchDto
  ): Promise<IWalletTransaction>

14. createRefundTransactionBatch(
    refundTransactionBatchDto: RefundTransactionBatchDto
  ): Promise<IWalletTransaction>

15. getAddress(
    addressForCounterFactualWalletDto: AddressForCounterFactualWalletDto
  )
```

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
