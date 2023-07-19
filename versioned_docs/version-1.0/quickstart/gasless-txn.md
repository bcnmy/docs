---
sidebar_position: 6
---

# Creating a Gasless Transaction

Now with our SDK integration set up let's render our UI and execute some transactions! First let's create a new import in our App.tsx file:

```js
import Counter from './Components/Counter';
```

In the return for this component lets add the following JSX:

```jsx
<div>
      <h1>Biconomy SDK Auth + Gasless Transactions</h1>
      {
        !smartAccount && !loading && <button onClick={login}>Login</button>
      }
      {
        loading && <p>Loading account details...</p>
      }
      {
        !!smartAccount && (
          <div className="buttonWrapper">
            <h3>Smart account address:</h3>
            <p>{smartAccount.address}</p>
            <Counter smartAccount={smartAccount} provider={provider} />
            <button onClick={logout}>Logout</button>
          </div>
        )
      }
      <p>
      Edit <code>src/App.tsx</code> and save to test
      </p>
      <a href="https://biconomy.gitbook.io/sdk/introduction/overview" target="_blank" className="read-the-docs">
  Click here to check out the docs
    </a>
    </div>
```
If you followed all instructions from the last step to now your file should look something like this:

```js
import './App.css'
import "@biconomy-sdk-dev/web3-auth/dist/src/style.css"
import { useState, useEffect, useRef } from 'react'
import SocialLogin from "@biconomy/web3-auth"
import { ChainId } from "@biconomy/core-types";
import { ethers } from 'ethers'
import SmartAccount from "@biconomy/smart-account";
import Counter from './Components/Counter';


export default function App() {
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null)
  const [interval, enableInterval] = useState(false)
  const sdkRef = useRef<SocialLogin | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    let configureLogin:any
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount()
          clearInterval(configureLogin)
        }
      }, 1000)
    }
  }, [interval])

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin()
      const signature1 = await socialLoginSDK.whitelistUrl('http://127.0.0.1:5173/')
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
        network: "testnet",
        whitelistUrls: {
          'http://127.0.0.1:5173/': signature1,
        }
      })
      sdkRef.current = socialLoginSDK
    }
    if (!sdkRef.current.provider) {
      sdkRef.current.showWallet()
      enableInterval(true)
    } else {
      setupSmartAccount()
    }
  }

  async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return
    sdkRef.current.hideWallet()
    setLoading(true)
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    )
    setProvider(web3Provider)
    try {
      const smartAccount = new SmartAccount(web3Provider, {
        activeNetworkId: ChainId.POLYGON_MUMBAI,
        supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
        networkConfig: [
          {
            chainId: ChainId.POLYGON_MUMBAI,
            dappAPIKey: import.meta.env.VITE_BICONOMY_API_KEY,
          },
        ],
      })
      await smartAccount.init()
      setSmartAccount(smartAccount)
      setLoading(false)
    } catch (err) {
      console.log('error setting up smart account... ', err)
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error('Web3Modal not initialized.')
      return
    }
    await sdkRef.current.logout()
    sdkRef.current.hideWallet()
    setSmartAccount(null)
    enableInterval(false)
  }

  return (
    <div>
      <h1>Biconomy SDK Auth + Gasless Transactions</h1>
      {
        !smartAccount && !loading && <button onClick={login}>Login</button>
      }
      {
        loading && <p>Loading account details...</p>
      }
      {
        !!smartAccount && (
          <div className="buttonWrapper">
            <h3>Smart account address:</h3>
            <p>{smartAccount.address}</p>
            <Counter smartAccount={smartAccount} provider={provider} />
            <button onClick={logout}>Logout</button>
          </div>
        )
      }
      <p>
      Edit <code>src/App.tsx</code> and save to test
      </p>
      <a href="https://biconomy.gitbook.io/sdk/introduction/overview" target="_blank" className="read-the-docs">
  Click here to check out the docs
    </a>
    </div>
  )
}
```

Now lets create our Counter component!

If you do not already have a Components folder go ahead and create one within source and create a new file called Counter.tsx

We will also add `react-toastify` for a nice toast to update our users about their transactions.

```bash
yarn add react-toastify
```

Let's add our imports for this file:

```js
import React, { useState, useEffect } from "react";
import SmartAccount from "@biconomy/smart-account";
import abi from "../utils/counterAbi.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
```

Make sure to get the abi from the smart contract we deployed in the first step - I created a utils folder to house that json file.

Here is an interface we will use for the props of this component:

```js
interface Props {
  smartAccount: SmartAccount
  provider: any
}
```

Now we can start building out this Counter Component:

```ts
const Counter: React.FC<Props> = ({ smartAccount, provider }) => {}
```

Here we define a Functional component that with the props of `smartAccount` and `provider` 

We will track two things in state: a count and an instance of the counterContract as well as a variable for the smart account address.

```ts
 const [count, setCount] = useState<number>(0)
 const [counterContract, setCounterContract] = useState<any>(null)
  
  const counterAddress = "address for smart account"
```

With this done let's go into the two functions this component will have: 

```ts
const getCount = async (isUpdating: boolean) => {
    const contract = new ethers.Contract(
      counterAddress,
      abi,
      provider,
    )
    setCounterContract(contract)
    const currentCount = await contract.count()
    setCount(currentCount.toNumber())
    if(isUpdating) {
      toast.success('count has been updated!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  }
```

The `getCount` function is an asynchronous function responsible for fetching the current value of the counter from a smart contract on a blockchain and setting the state of the contract and count in the component.

1. **Create Contract Instance**: It first creates an instance of the smart contract using the `ethers.Contract` constructor. It takes three arguments - the contract address, the contract ABI (Application Binary Interface), and the Web3 provider. This contract instance allows you to interact with the contract on the blockchain.
2. **Set Contract State**: It then calls `setCounterContract(contract)` to set the state of counterContract to the instance of the contract it just created.
3. **Fetch Current Count**: It fetches the current value of the count from the smart contract by calling the `count()` function on the contract instance. Since this function interacts with the blockchain, it returns a Promise, hence the `await` keyword.
4. **Set Count State**: It then calls `setCount(currentCount.toNumber())` to set the state of count to the current value it just fetched. It converts the value to a number since the value returned from the contract is a BigNumber.
5. **Display Toast Notification**: If the `isUpdating` parameter is `true`, it displays a toast notification indicating that the count has been updated. This notification includes configuration for its position, auto-close time, behavior on click and hover, and theme.

In summary, the `getCount` function creates a contract instance, sets the state of the contract, fetches the current value of the count from the contract, sets the state of the count, and optionally displays a toast notification.

```ts
const incrementCount = async () => {
    try {
      toast.info('processing count on the blockchain!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      const incrementTx = await counterContract.populateTransaction.incrementCount()
      const tx1 = {
        to: counterAddress,
        data: incrementTx.data,
      }
      const txResponse = await smartAccount.sendTransaction({ transaction: tx1})

      const txHash = await txResponse.wait();
      console.log(txHash)
      getCount(true)

    } catch (error) {
      console.log({error})
      toast.error('error occured check the console', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  }
```

The `incrementCount` function is an asynchronous function that increments the count on the smart contract by sending a transaction to the blockchain.

1. **Display Initial Toast Notification**: The function begins by displaying a toast notification to inform the user that the count is being processed on the blockchain.
2. **Create Transaction**: It then creates a transaction object using the counterContract.`populateTransaction.incrementCount()` function. This function prepares the data needed to call the `incrementCount` function on the smart contract but does not send the transaction. The returned transaction object includes the data needed to call the function.
3. **Define Transaction Parameters**: It defines the parameters for the transaction in `tx1`. This includes the address of the contract in to and the data needed to call the function in `data`.
4. **Send Transaction**: It sends the transaction to the blockchain using the `smartAccount.sendTransaction()` function. This function takes an object with the transaction parameters and sends the transaction. Since this function interacts with the blockchain, it returns a Promise, hence the await keyword.
5. **Wait for Transaction Confirmation**: It then calls `txResponse.wait()` to wait for the transaction to be confirmed on the blockchain. This function also returns a Promise, hence the `await` keyword.
6. **Log Transaction Hash**: Once the transaction is confirmed, the transaction hash is logged to the console with `console.log(txHash)`.
7. **Update Count**: It then calls `getCount(true)` to fetch the updated count from the smart contract and update the state in the component. The true argument means that a toast notification will be displayed to indicate that the count has been updated.
8. **Error Handling**: If an error occurs during this process, it is caught by the `catch` block. The error is logged to the console with `console.log({error})` and a toast notification is displayed to inform the user that an error occurred.

In summary, the `incrementCount` function sends a transaction to a smart contract on a blockchain to increment a count, waits for the transaction to be confirmed, fetches the updated count, and handles any errors that occur during this process.

Finally we round all this up by displaying the UI for our Toast and button:

```ts
return(
    <>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    <button onClick={() => incrementCount()}>
      count is {count}
    </button>
    </>
  )
```

Congratulations you just created your first AA powered dApp. Users can now log in and have a smart account created for them and interact with a smart contract without the need to purchase any tokens to pay for gas. Here is the complete implimintation of this component:

```ts
import React, { useState, useEffect } from "react";
import SmartAccount from "@biconomy/smart-account";
import abi from "../utils/counterAbi.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
  smartAccount: SmartAccount
  provider: any
}


const Counter: React.FC<Props> = ({ smartAccount, provider }) => {
  const [count, setCount] = useState<number>(0)
  const [counterContract, setCounterContract] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const counterAddress = "address for smart account"

  useEffect(() => {
    setIsLoading(true)
    getCount(false)
  },[])

  const getCount = async (isUpdating: boolean) => {
    const contract = new ethers.Contract(
      counterAddress,
      abi,
      provider,
    )
    setCounterContract(contract)
    const currentCount = await contract.count()
    setCount(currentCount.toNumber())
    if(isUpdating) {
      toast.success('count has been updated!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  }

  const incrementCount = async () => {
    try {
      toast.info('processing count on the blockchain!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      const incrementTx = await counterContract.populateTransaction.incrementCount()
      const tx1 = {
        to: counterAddress,
        data: incrementTx.data,
      }
      const txResponse = await smartAccount.sendTransaction({ transaction: tx1})

      const txHash = await txResponse.wait();
      console.log(txHash)
      getCount(true)

    } catch (error) {
      console.log({error})
      toast.error('error occured check the console', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  }
  return(
    <>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    <button onClick={() => incrementCount()}>
      count is {count}
    </button>
    </>
  )
};

export default Counter;
```

If you would like to see the completed project on github you can use the template below: 

https://github.com/Rahat-ch/biconomy-sdk-social-gasless-starter