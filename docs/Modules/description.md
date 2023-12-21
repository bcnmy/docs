---
sidebar_position: 1
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/Modules/description.md
---

# Description

With the upgrade to the Biconomy Smart Account V2 our smart accounts no longer store ownership information and no longer have a default algorithm for validating signatures. This allows for more easily building modules that contain arbitrary Validation logic before executing user operations.

Custom Validation algorithms are one of the the key features of Account Abstraction and open up the ability to provide better customized user experiences in your wallets and dApps.

Refer to the chart below for the modules currently available with the Biconomy SDK:

| Module                        | Description                                                                                                                                                                                                                                                                     | Address                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| ECDSA Ownership Module        | This module relies on ECDSA. The EOA owners public key is needed to sign and verify a message. This can also be used as default and active validation modules.                                                                                                                  | 0x0000001c5b32F37F5beA87BDD5374eB2aC54eA8e |
| MultiChain Validation Module  | This module is an extenstion of the ECDSA Module. In addition to the ECSA functionality this module allows for dispatching multiple userOps to different EVM chains. Can be used in place of ECDSA Module as default and active validation modules.                             | 0x000000824dc138db84FD9109fc154bdad332Aa8E |
| Session Key Manager Module    | This module enables the use of sessions with session validation modules which can be deployed at different addresses. The validation modules themselves do not get implemented as modules but can be managed by this one. This can only be used as an active validation module. | 0x000000456b395c4e107e0302553B90D1eF4a32e9 |
| Batched Session Router Module | This module works with Session Key Manager Module. Normally only one session key signed userOp could be executed, this module allows for multiple session operations.                                                                                                           | 0x000008dA71757C0E1D83CE56c823e25Aa49bC058 |
