---
sidebar_position: 1
---

# Setup Node CLI Tool

Our Node JS CLI Tool allows you to quickly execute scripts for more use cases

This guide will take you through the initial setup of our tool so you can see more Account Abstraction use cases in action with our SDK. 

To get started clone down this [GitHub Repository](https://github.com/bcnmy/sdk-examples)

```bash
git clone git@github.com:bcnmy/sdk-examples.git
```

Note that this is the ssh example, use http or GithubCli options if you prefer.

In your preferred command line interface navigate to the `sdk-examples` directory you just cloned and then into the `backend-node` directory. 

Install all dependencies using either yarn or npm 

```bash
yarn install

#or

npm install

```

From this point we will continue using yarn but you can substitute any of the below commands with npm as well. 
Open the code in your preferred code editor to reference any of the code powering the script and now let's create a configuration object for the CLI to use. From your command line run the command below: 

```bash
yarn run smartAccount init --network=mumbai
```
You will have a `config.json` file created in the root of this directory which should look something like this:

```json
{
  "privateKey": "83ad2579e0162864ba0b48f217bdaba43c6020a79fcbe456fe736c524bbaa8d5",
  "accountIndex": 0,
  "chainId": 80001,
  "rpcUrl": "https://rpc.ankr.com/polygon_mumbai",
  "bundlerUrl": "https://bundler.biconomy.io/api/v2/<CHAINID>/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  "biconomyPaymasterUrl": "https://paymaster.biconomy.io/api/v1/<CHAINID>/<APIKEY>",
  "preferredToken": "",
  "tokenList": []
}

```
You can update the private key value to be the address of any EOA wallet you would like. Make sure to update the ChainID and API Key as well for the Paymaster URL. For Mumbai the Chain ID is 80001 and you can get your API Key from your Biconomy Dashboard. 

Now run the following command: 

```bash
yarn run smartAccount address
```
This will print the EOA address associated to the private key you entered in the configuration as well as a Smart Contract Wallet that is now owned by that EOA. 