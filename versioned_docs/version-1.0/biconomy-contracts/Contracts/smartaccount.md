---
sidebar_position: 2
---

# Smart Account Contract

Heart of the Biconomy SDK AA Eco-system

This is the actual implementation of the Smart Account.

It acts as a Singleton as it is deployed only once and all the actual user Smart Accounts are deployed as Proxies, which send delegatecalls to the Singleton Implementation.

It inherits from theBaseSmartAccount.sol contract, that defines the EIP-4337 specified IAccount interface. It also implements function definitions, that are specified in the BaseAccount.sol

You'll find the description of the most important functions and design choices below.

### Constructor

```javascript
constructor(IEntryPoint anEntryPoint) {
        _self = address(this);
        // By setting the owner it is not possible to call init anymore,
        // so we create an account with fixed non-zero owner.
        // This is an unusable account, perfect for the singleton
        owner = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
        if (address(anEntryPoint) == address(0))
            revert EntryPointCannotBeZero();
        _entryPoint = anEntryPoint;
        _chainId = block.chainid;
    }
```

- \_self, chainId, and \_entryPoint are immutable storage variables. They are the cheapest to use, that's why we decided to store chainId instead of calling for it dynamically.
- Entry Point address is stored in the \_entryPoint variable and is immutable. That means every time there's a new Entry Point deployed, it will be required for Smart Accounts to upgrade to a new implementation that works with the new EP. Actually, introducing a new EP will be more like deploying the new hardfork, so it won't happen often.
- The owner is set not as address(0) but as some random address because ECDSA signature verification algorithm can return address(0) as a signer for some of the invalid signatures.

1. **_init()_**

Is the method for initializing the Smart Account proxy with initial states. It sets the owner address, and the fallback handler address. It also initiates the \_setupModules procedure.

```javascript
function init(address _owner, address _handler) external virtual override {
if (owner != address(0)) revert AlreadyInitialized(address(this));
if (_owner == address(0)) revert OwnerCannotBeZero();
owner = _owner;
_setFallbackHandler(_handler);
_setupModules(address(0), bytes(""));

}
```

2. **_handlePayment()_**

Private method to be used to transfer ERC20 tokens from Smart Account to the refund receiver. Is used to perform gas payment with ERC20 tokens.

```javascript
function handlePayment(
uint256 gasUsed,
uint256 baseGas,
uint256 gasPrice,
uint256 tokenGasPriceFactor,
address gasToken,
address payable refundReceiver
) private returns (uint256 payment)
```

#### Parametres

| Name                | Type    | Description                                                                                              |
| ------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| gasUsed             | uint256 | gas units to be accounted for fee calculation (passed on from main transactional method execTransaction) |
| baseGas             | uint256 | gas units to be accounted for other actions                                                              |
| gasPrice            | uint256 | gasPrice or tokenGasPrice                                                                                |
| tokenGasPriceFactor | uint256 | indicates decimals of fee token                                                                          |
| gasToken            | address | address of the gas token (0x for native)                                                                 |
| refundReceiver      | address | refund receiver                                                                                          |

#### Return Values

| Name    | Type    | Description             |
| ------- | ------- | ----------------------- |
| Payment | uint256 | gas token refund amount |

There's also handlePaymentRevert function that always reverts with the gas amount that was spent to execute the potential refund. It is used to estimate gas usage of the refund procedure itself without actually sending the refund.

3. **_execTransaction_S6W()_**
   This is the main method to dispatch transactions from the Smart account to dApp's contracts using the owner's signature. Operates with the Safe (previously Gnosis Safe) style transactions with optional repayment in native tokens or ERC20 tokens.

The name is optimized to make the function signature start with zeros, in order for it to be at the beginning of the routing table and allow for cheaper public calls.

For consistency, there's also an execTransaction() function that just calls the execTransaction_S6W.

```javascript
function execTransaction_S6W(
        Transaction memory _tx,
        FeeRefund memory refundInfo,
        bytes memory signatures
    ) public payable virtual nonReentrant returns (bool success)
```

#### Parameters

```Javascript
struct Transaction {
        address to;
        uint256 value;
        bytes data;
        Enum.Operation operation; // call or delegate call
        uint256 targetTxGas; // gasLimit for internal transaction
    }

struct FeeRefund {
        uint256 baseGas;
        uint256 gasPrice; //gasPrice or tokenGasPrice
        uint256 tokenGasPriceFactor;
        address gasToken;
        address payable refundReceiver;
    }
```

| Name       | Type        | Description                                  |
| ---------- | ----------- | -------------------------------------------- |
| \_tx       | Transaction | Smart Account transaction as described above |
| refundInfo | FeeRefund   | as described above                           |
| signatures | bytes       | required owner signature                     |

#### Returns Success or Failure bool and Emits Following Events

```javascript
event ExecutionFailure(address to, uint256 value, bytes data, Enum.Operation operation, uint256 txGas);
event ExecutionSuccess(address to, uint256 value, bytes data, Enum.Operation operation, uint256 txGas)
```

4.  **_setOwner()_**

Allows to rotate signing kets. Definition below:

```javascript
function setOwner(address _newOwner) external mixedAuth
modifier mixedAuth {
       require(msg.sender == owner || msg.sender == address(this),"Only owner or self");
       _;
  }
```

mixedAuth is onlyOwner OR self (allows transaction from social recovery module via Guardians!)
modifier mixedAuth

5.  **_updateImplementation()_**

Allows to update the implementation when called from a Proxy via delegatecall. New implementation must be a smart contract.

```javascript
function updateImplementation(address _implementation) public virtual mixedAuth
```

6. **_checkSignatures()_**

Checks whether the signature provided is valid for the provided data hash. Revert otherwise.

Works with several types of signatures, such as: contract signatures, eth_sign derived signatures and regular ECDSA signatures. Used by the execTransaction() in a non-EIP-4337 flow.

```javascript
function checkSignatures(
        bytes32 dataHash,
        bytes memory signatures
    ) public view virtual
```

7. **_requiredTxGas()_**

Allows to estimate a transaction. This method is only meant for estimation purpose, therefore the call will always revert and encode the result in the revert data. Biconomy SDK backend has the API to estimate gas using above method

```javascript
function requiredTxGas(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    ) external returns (uint256)
```

8. **_executeCall(), executeBatchCall()_**

And their optimized names implementations: `executeBatchCall_4by` and `executeCall_s1m`.

Are called by an Entry Point in a EIP-4337 flow to execute arbitrary transactions on behalf of the Smart Account.

9. **_validateUserOp()_**

Located in BaseSmartAccount.sol
Implements IAccount interface by EIP-4337.

```javascript
function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external virtual override returns (uint256 validationData) {
        if (msg.sender != address(entryPoint()))
            revert CallerIsNotAnEntryPoint(msg.sender);
        validationData = _validateSignature(userOp, userOpHash);
        if (userOp.initCode.length == 0) {
            _validateAndUpdateNonce(userOp);
        }
        _payPrefund(missingAccountFunds);
    }
```

10. **_\_validateSignature()_**

Implements the template method of BaseAccount and validates the user's signature for a given operation.

If the `calldata` field in the `UserOp` encodes the call to this Smart Account module, we pass the signature verification flow to the Module's `validateSignature` method. This design allows for alternative signing schemes, such as `secp256r1` (passkeys) and others.

```javascript
function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override returns (uint256 validationData) {
        // below changes need formal verification.
        bytes calldata userOpData = userOp.callData;
        if (userOpData.length > 0) {
            bytes4 methodSig = bytes4(userOpData[:4]);
            // If method to be called is executeCall then only check for module transaction
            if (methodSig == this.executeCall.selector) {
                (address _to, uint _amount, bytes memory _data) = abi.decode(
                    userOpData[4:],
                    (address, uint, bytes)
                );
                if (address(modules[_to]) != address(0))
                    return IModule(_to).validateSignature(userOp, userOpHash);
            }
        }
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        if (owner != hash.recover(userOp.signature))
            return SIG_VALIDATION_FAILED;
        return 0;
    }
```

11. **_isValidSignature()_**

This function allows for signature verification according to [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271).

This method can be called by off-chain entities to verify if the contract recognizes the provided signature as valid or not. That allows for a seamless login experience with signed messages like the one by OpenSea to be available for Smart Accounts as well.

If there's an active module for this Smart Account that has got signature verification flow passed to, `_dataHash` and \*\*`_signature` will be passed to its `isValidSignature` method. This allows for alternative signing schemes not only in course of EIP-4337 `userOps` executions but for all kinds of Smart Account interactions with various dApps.

```javascript
function isValidSignature(
        bytes32 _dataHash,
        bytes memory _signature
    )
```
