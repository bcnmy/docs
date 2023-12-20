const eth_estimateUserOperationGas = {
  method: "eth_estimateUserOperationGas",
  params: [
    {
      sender: "0x0000000000000000000000000000000000000000",
      nonce: "0x0",
      initCode: "0x",
      callData: "0x",
      signature:
        "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000001c5b32F37F5beA87BDD5374eB2aC54eA8e000000000000000000000000000000000000000000000000000000000000004181d4b4981670cb18f99f0b4a66446df1bf5b204d24cfcb659bf38ba27a4359b5711649ec2423c5e1247245eba2964679b6a1dbb85c992ae40b9b00c6935b02ff1b00000000000000000000000000000000000000000000000000000000000000",
      paymasterAndData: "0x",
    },
    "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
  ],
  id: 1697033406,
  jsonrpc: "2.0",
};

const eth_sendUserOperation = {
  method: "eth_sendUserOperation",
  params: [
    {
      sender: "0x0000000000000000000000000000000000000000",
      nonce: "0x0",
      initCode: "0x",
      callData: "0x",
      maxFeePerGas: "0x",
      maxPriorityFeePerGas: "0",
      verificationGasLimit: "0x",
      callGasLimit: "0x",
      preVerificationGas: "0",
      paymasterAndData: "0x",
      signature: "0x",
    },
    "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
    {
      simulation_type: "validation",
    },
  ],
  id: 1697033407,
  jsonrpc: "2.0",
};

const eth_getUserOperationReceipt = {
  method: "eth_getUserOperationReceipt",
  params: ["0x"],
  id: 1693369916,
  jsonrpc: "2.0",
};

const eth_getUserOperationByHash = {
  method: "eth_getUserOperationByHash",
  params: ["0x"],
  id: 1693369916,
  jsonrpc: "2.0",
};

const eth_chainId = {
  method: "eth_chainId",
  params: [],
  id: 1693369916,
  jsonrpc: "2.0",
};

const eth_supportedEntryPoints = {
  method: "eth_supportedEntryPoints",
  params: [],
  id: 1693369916,
  jsonrpc: "2.0",
};

const biconomy_getGasFeeValues = {
  method: "biconomy_getGasFeeValues",
  params: [],
  id: 1697033314,
  jsonrpc: "2.0",
};

const biconomy_getUserOperationStatus = {
  method: "biconomy_getUserOperationStatus",
  params: ["0x"],
  id: 1693369916,
  jsonrpc: "2.0",
};

const sampleRequests = {
  eth_estimateUserOperationGas,
  eth_sendUserOperation,
  eth_getUserOperationReceipt,
  eth_getUserOperationByHash,
  eth_chainId,
  eth_supportedEntryPoints,
  biconomy_getGasFeeValues,
  biconomy_getUserOperationStatus,
};

export default sampleRequests;
