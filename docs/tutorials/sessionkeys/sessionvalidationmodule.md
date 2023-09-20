---
sidebar_label: 'Session Validation Module'
sidebar_position: 2
---

# Session Validation Module

Before we continue it is important to understand Session Validation Modules and the Session Key Manager Module which interacts with them via the SDK.

To utilize session keys in a blockchain context, we require a smart contract that verifies whether a given user operation adheres to the permissions defined within the session key and confirms that the operation has been appropriately signed by the said session key.  In this section we will cover a deployed contract that validates specific permissions to execute ERC20 token transfers. Using this ERC20 Validation module you will be able to create a small dApp that allows user to send a limited amount of funds to a specific address without needing to sign a transaction every single time. 

The address of our deployed contract is: [0x000000D50C68705bd6897B2d17c7de32FB519fDA](https://mumbai.polygonscan.com/address/0x000000D50C68705bd6897B2d17c7de32FB519fDA#code)

The Smart contract we will be breaking down is the one shown below: 


```javascript
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./ISessionValidationModule.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title ERC20 Session Validation Module for Biconomy Smart Accounts.
 * @dev Validates userOps for ERC20 transfers and approvals using a session key signature.
 *         - Recommended to use with standard ERC20 tokens only
 *         - Can be used with any method of any contract which implement
 *           method(address, uint256) interface
 *
 * @author Fil Makarov - <filipp.makarov@biconomy.io>
 */

contract ERC20SessionValidationModule is ISessionValidationModule {
    /**
     * @dev validates that the call (destinationContract, callValue, funcCallData)
     * complies with the Session Key permissions represented by sessionKeyData
     * @param destinationContract address of the contract to be called
     * @param callValue value to be sent with the call
     * @param _funcCallData the data for the call. is parsed inside the SVM
     * @param _sessionKeyData SessionKey data, that describes sessionKey permissions
     */
    function validateSessionParams(
        address destinationContract,
        uint256 callValue,
        bytes calldata _funcCallData,
        bytes calldata _sessionKeyData,
        bytes calldata /*_callSpecificData*/
    ) external virtual override returns (address) {
        (
            address sessionKey,
            address token,
            address recipient,
            uint256 maxAmount
        ) = abi.decode(_sessionKeyData, (address, address, address, uint256));

        require(destinationContract == token, "ERC20SV Invalid Token");
        require(callValue == 0, "ERC20SV Non Zero Value");

        (address recipientCalled, uint256 amount) = abi.decode(
            _funcCallData[4:],
            (address, uint256)
        );

        require(recipient == recipientCalled, "ERC20SV Wrong Recipient");
        require(amount <= maxAmount, "ERC20SV Max Amount Exceeded");
        return sessionKey;
    }

    /**
     * @dev validates if the _op (UserOperation) matches the SessionKey permissions
     * and that _op has been signed by this SessionKey
     * Please mind the decimals of your exact token when setting maxAmount
     * @param _op User Operation to be validated.
     * @param _userOpHash Hash of the User Operation to be validated.
     * @param _sessionKeyData SessionKey data, that describes sessionKey permissions
     * @param _sessionKeySignature Signature over the the _userOpHash.
     * @return true if the _op is valid, false otherwise.
     */
    function validateSessionUserOp(
        UserOperation calldata _op,
        bytes32 _userOpHash,
        bytes calldata _sessionKeyData,
        bytes calldata _sessionKeySignature
    ) external pure override returns (bool) {
        require(
            bytes4(_op.callData[0:4]) == EXECUTE_OPTIMIZED_SELECTOR ||
                bytes4(_op.callData[0:4]) == EXECUTE_SELECTOR,
            "ERC20SV Invalid Selector"
        );

        (
            address sessionKey,
            address token,
            address recipient,
            uint256 maxAmount
        ) = abi.decode(_sessionKeyData, (address, address, address, uint256));

        {
            // we expect _op.callData to be `SmartAccount.execute(to, value, calldata)` calldata
            (address tokenAddr, uint256 callValue, ) = abi.decode(
                _op.callData[4:], // skip selector
                (address, uint256, bytes)
            );
            if (tokenAddr != token) {
                revert("ERC20SV Wrong Token");
            }
            if (callValue != 0) {
                revert("ERC20SV Non Zero Value");
            }
        }
        // working with userOp.callData
        // check if the call is to the allowed recepient and amount is not more than allowed
        bytes calldata data;
        {
            uint256 offset = uint256(bytes32(_op.callData[4 + 64:4 + 96]));
            uint256 length = uint256(
                bytes32(_op.callData[4 + offset:4 + offset + 32])
            );
            //we expect data to be the `IERC20.transfer(address, uint256)` calldata
            data = _op.callData[4 + offset + 32:4 + offset + 32 + length];
        }
        if (address(bytes20(data[16:36])) != recipient) {
            revert("ERC20SV Wrong Recipient");
        }
        if (uint256(bytes32(data[36:68])) > maxAmount) {
            revert("ERC20SV Max Amount Exceeded");
        }
        return
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(_userOpHash),
                _sessionKeySignature
            ) == sessionKey;
    }
}
```

This contract extends the ISessionValidationModule interface which gives us the needed parameters for `validateSessionUserOp` and `validateSessionParams`. We will need to extend the implementation of these two functions in order to create a session validation module. You can view this interface [here](https://github.com/bcnmy/scw-contracts/blob/master/contracts/smart-account/modules/SessionValidationModules/ISessionValidationModule.sol).

Coming back to the validation module lets break down the two functions: 

## validateSessionUserOp

```javascript
/**
     * @dev validates if the _op (UserOperation) matches the SessionKey permissions
     * and that _op has been signed by this SessionKey
     * Please mind the decimals of your exact token when setting maxAmount
     * @param _op User Operation to be validated.
     * @param _userOpHash Hash of the User Operation to be validated.
     * @param _sessionKeyData SessionKey data, that describes sessionKey permissions
     * @param _sessionKeySignature Signature over the the _userOpHash.
     * @return true if the _op is valid, false otherwise.
     */
    function validateSessionUserOp(
        UserOperation calldata _op,
        bytes32 _userOpHash,
        bytes calldata _sessionKeyData,
        bytes calldata _sessionKeySignature
    ) external pure override returns (bool) {
        require(
            bytes4(_op.callData[0:4]) == EXECUTE_OPTIMIZED_SELECTOR ||
                bytes4(_op.callData[0:4]) == EXECUTE_SELECTOR,
            "ERC20SV Invalid Selector"
        );

        (
            address sessionKey,
            address token,
            address recipient,
            uint256 maxAmount
        ) = abi.decode(_sessionKeyData, (address, address, address, uint256));

        {
            // we expect _op.callData to be `SmartAccount.execute(to, value, calldata)` calldata
            (address tokenAddr, uint256 callValue, ) = abi.decode(
                _op.callData[4:], // skip selector
                (address, uint256, bytes)
            );
            if (tokenAddr != token) {
                revert("ERC20SV Wrong Token");
            }
            if (callValue != 0) {
                revert("ERC20SV Non Zero Value");
            }
        }
        // working with userOp.callData
        // check if the call is to the allowed recepient and amount is not more than allowed
        bytes calldata data;
        {
            uint256 offset = uint256(bytes32(_op.callData[4 + 64:4 + 96]));
            uint256 length = uint256(
                bytes32(_op.callData[4 + offset:4 + offset + 32])
            );
            //we expect data to be the `IERC20.transfer(address, uint256)` calldata
            data = _op.callData[4 + offset + 32:4 + offset + 32 + length];
        }
        if (address(bytes20(data[16:36])) != recipient) {
            revert("ERC20SV Wrong Recipient");
        }
        if (uint256(bytes32(data[36:68])) > maxAmount) {
            revert("ERC20SV Max Amount Exceeded");
        }
        return
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(_userOpHash),
                _sessionKeySignature
            ) == sessionKey;
    }
```


When validating a single user operation this function will be called by the Session Key Manager Module from the Biconomy SDK. Let's break down the code: 

This function takes four arguments: 

- Useroperation 
- _userOpHash
- _sessionKeyData
- _sessionKeySignature 


- The first check verifies that the useroperation supplied matches the function selectors that are defined in the interface.
- Next we decode the session key data - these arguments are what we need in order to validate if the userOp should be allowed to execute. Depending on your use case you may want different arguments here. In this case we get addresses for: sessionKey(the eoa that will sign on our behalf), token, recipent, and the maximum amount of tokens that can be transferred. 
- Next we decode the token address and call value fields the userop
- If the token address in the userop does not match the token address of the session key we revert the transaction as this is not the token we have permission to send
- If the call value does not equal zero we will also revert. If your logic requires some value to be sent by the end user you would update this condition accordingly. 
- Next we look at the call data and verify the recipient is who we want it to be as defined in the session and that the maximum amount of tokens to be sent has not been exceeded. 
- Finally the ECDSA functions are used to confirm the operations signature matches the session key. 

## validateSessionParams

```javascript

/**
     * @dev validates that the call (destinationContract, callValue, funcCallData)
     * complies with the Session Key permissions represented by sessionKeyData
     * @param destinationContract address of the contract to be called
     * @param callValue value to be sent with the call
     * @param _funcCallData the data for the call. is parsed inside the SVM
     * @param _sessionKeyData SessionKey data, that describes sessionKey permissions
     */
    function validateSessionParams(
        address destinationContract,
        uint256 callValue,
        bytes calldata _funcCallData,
        bytes calldata _sessionKeyData,
        bytes calldata /*_callSpecificData*/
    ) external virtual override returns (address) {
        (
            address sessionKey,
            address token,
            address recipient,
            uint256 maxAmount
        ) = abi.decode(_sessionKeyData, (address, address, address, uint256));

        require(destinationContract == token, "ERC20SV Invalid Token");
        require(callValue == 0, "ERC20SV Non Zero Value");

        (address recipientCalled, uint256 amount) = abi.decode(
            _funcCallData[4:],
            (address, uint256)
        );

        require(recipient == recipientCalled, "ERC20SV Wrong Recipient");
        require(amount <= maxAmount, "ERC20SV Max Amount Exceeded");
        return sessionKey;
    }

```

When validating a batch of sessions this function will be called by the Session Key Manager Module from the Biconomy SDK. Let's break down the code: 

The `validateSessionParams` takes five arguments supplied by the Session Key Manager Module: 

- destinationContract
- callValue
- _funcCallData
- _sessionKeyData
- _callSpecificData

This is very similar to the `validateSessionUserOp`

- First we decode the session key address, token address, recipient address, and maximum amount of tokens. Again this can be altered based on your needs if you are building your own session key module. 
- Two checks are then conducted to make sure that the destination contract is the token address and that the call value is zero. You can edit this if you need a value transferred for the transaction such as paying to mint an nft. 
- The recipientCalled and amount are then returned from decoding the _funcCallData and compared to make sure they match with session key data
- the session key address is returned

This is a breakdown of the contract we will be using to power our session key demo. In the next section we will initialize our frontend and start integrating the Biconomy SDK. 