---
sidebar_label: 'Batching Multiple Transactions'
sidebar_position: 4
---

# Batching Multiple Transactions

In this guide, we will edit the functionality in the previous section to not only mint a gasless transaction but to showcase batching transactions by minting multiple transactions together. 

<details>
  <summary> Click to view code from previous section </summary>

```typescript

import { config } from "dotenv";
import { IBundler, Bundler } from "@biconomy/bundler";
import { ChainId } from "@biconomy/core-types";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
import { ethers } from "ethers";
import {
  IPaymaster,
  BiconomyPaymaster,
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from "@biconomy/paymaster";

config();

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai"
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

const bundler: IBundler = new Bundler({
  bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: "https://paymaster.biconomy.io/api/v1/80001/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a",
});

async function createAccount() {
  const module = await ECDSAOwnershipValidationModule.create({
    signer: wallet,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
  });

  let biconomyAccount = await BiconomySmartAccountV2.create({
    chainId: ChainId.POLYGON_MUMBAI,
    bundler: bundler,
    paymaster: paymaster,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: module,
    activeValidationModule: module,
  });
  console.log("address", await biconomyAccount.getAccountAddress());
  return biconomyAccount;
}

async function mintNFT() {
  const smartAccount = await createAccount();
  const address = await smartAccount.getAccountAddress();
  const nftInterface = new ethers.utils.Interface([
    "function safeMint(address _to)",
  ]);

  const data = nftInterface.encodeFunctionData("safeMint", [address]);

  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";

  const transaction = {
    to: nftAddress,
    data: data,
  };

  let partialUserOp = await smartAccount.buildUserOp([transaction], {
    paymasterServiceData: {
      mode: PaymasterMode.SPONSORED,
    },
  });

  const biconomyPaymaster =
    smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

  try {
    const paymasterAndDataResponse =
      await biconomyPaymaster.getPaymasterAndData(partialUserOp);
    partialUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
  } catch (e) {
    console.log("error received ", e);
  }

  try {
    const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
    const transactionDetails = await userOpResponse.wait();
    console.log(
      `transactionDetails: https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}`
    );
    console.log(
      `view minted nfts for smart account: https://testnets.opensea.io/${address}`
    );
  } catch (e) {
    console.log("error received ", e);
  }
}

mintNFT();


```



</details>

Our Focus for this edit will be on the following section of the mintNFT function: 

```typescript
  const smartAccount = await createAccount();
  const address = await smartAccount.getAccountAddress();

  const nftInterface = new ethers.utils.Interface([
    "function safeMint(address _to)",
  ]);

  const data = nftInterface.encodeFunctionData("safeMint", [address]);

  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";

  const transaction = {
    to: nftAddress,
    data: data,
  };

  let partialUserOp = await smartAccount.buildUserOp([transaction], {
    paymasterServiceData: {
      mode: PaymasterMode.SPONSORED,
    },
  });

```

We start constructing our transaction here and pass the transaction to an array within the Smart Accounts `buildUserOp` method. The quickest edit we can do here is simply pass the transaction multiple times:

```typescript

let partialUserOp = await smartAccount.buildUserOp([transaction, transaction], {
    paymasterServiceData: {
      mode: PaymasterMode.SPONSORED,
    },
  });

```

Passing the transaction twice in the Array will allow you to mint multiple NFTs in one transaction. This is useful for use cases such as using NFTs as a ticketing system and needing to mint multiple tickets or creating one-click experiences in defi by passing multiple types of transactions into the array.

Try running the script yourself with this edit and you will notice multiple mints in the transaction details, allowing you to save gas in cases where users need to conduct multiple transactions.

In the next section, we'll learn how to change our transaction method to pay for gas using an **ERC20 token** instead of using **gasless transactions**.
