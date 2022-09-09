/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { DexPair, DexPairInterface } from "../../swap/DexPair";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "InsufficientAmount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "InsufficientLiquidity",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "InvalidAddressParameters",
    type: "error",
  },
  {
    inputs: [],
    name: "Locked",
    type: "error",
  },
  {
    inputs: [],
    name: "Overflow",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0In",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1In",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "Swap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve0",
        type: "uint112",
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve1",
        type: "uint112",
      },
    ],
    name: "Sync",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINIMUM_LIQUIDITY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      {
        internalType: "uint112",
        name: "_reserve0",
        type: "uint112",
      },
      {
        internalType: "uint112",
        name: "_reserve1",
        type: "uint112",
      },
      {
        internalType: "uint32",
        name: "_blockTimestampLast",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token1",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "kLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "price0CumulativeLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "price1CumulativeLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "safeTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "skim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "swap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sync",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token0",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token1",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60c06040526001600a5534801561001557600080fd5b5060408051808201825260078152660444558737761760cc1b6020918201528151808301835260018152603160f81b9082015281517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f918101919091527f6a6f5684613219496cdd2a0ab3d28e0ea8c188284d27e24bf1d5bbe7fd5091e5918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6606082015246608082018190523060a08301529060c00160408051601f198184030181529190528051602090910120608052503360a05260805160a0516126b661012c600039600081816104a401528181610b680152611c5201526000818161034701526114e801526126b66000f3fe608060405234801561001057600080fd5b50600436106101f05760003560e01c80636a6278421161010f578063ba9a7a56116100a2578063d505accf11610071578063d505accf146104d9578063dd62ed3e146104ec578063eb79554914610517578063fff6cae91461052a57600080fd5b8063ba9a7a5614610483578063bc25cf771461048c578063c45a01551461049f578063d21220a7146104c657600080fd5b806389afcb44116100de57806389afcb441461041057806395d89b4114610438578063a9059cbb1461045d578063b88d4fde1461047057600080fd5b80636a627842146103b457806370a08231146103c75780637464fc3d146103e75780637ecebe00146103f057600080fd5b806330adf81f1161018757806342842e0e1161015657806342842e0e1461037c578063485cc9551461038f5780635909c0d5146103a25780635a3d5493146103ab57600080fd5b806330adf81f14610301578063313ce567146103285780633644e51514610342578063423f6cef1461036957600080fd5b8063095ea7b3116101c3578063095ea7b3146102995780630dfe1681146102ac57806318160ddd146102d757806323b872dd146102ee57600080fd5b806301ffc9a7146101f5578063022c0d9f1461021d57806306fdde03146102325780630902f1ac14610265575b600080fd5b61020861020336600461201a565b610532565b60405190151581526020015b60405180910390f35b61023061022b36600461204c565b610584565b005b610258604051806040016040528060078152602001660444558737761760cc1b81525081565b604051610214919061213e565b61026d610a6d565b604080516001600160701b03948516815293909216602084015263ffffffff1690820152606001610214565b6102086102a7366004612151565b610a97565b6004546102bf906001600160a01b031681565b6040516001600160a01b039091168152602001610214565b6102e060005481565b604051908152602001610214565b6102086102fc36600461217d565b610aad565b6102e07f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b610330601281565b60405160ff9091168152602001610214565b6102e07f000000000000000000000000000000000000000000000000000000000000000081565b610230610377366004612151565b610b1f565b61023061038a36600461217d565b610b3d565b61023061039d3660046121be565b610b5d565b6102e060075481565b6102e060085481565b6102e06103c23660046121f7565b610bd3565b6102e06103d53660046121f7565b60016020526000908152604090205481565b6102e060095481565b6102e06103fe3660046121f7565b60036020526000908152604090205481565b61042361041e3660046121f7565b610e98565b60408051928352602083019190915201610214565b6102586040518060400160405280600681526020016504b6c61794c560d41b81525081565b61020861046b366004612151565b6111fa565b61023061047e3660046122b7565b611207565b6102e06103e881565b61023061049a3660046121f7565b611375565b6102bf7f000000000000000000000000000000000000000000000000000000000000000081565b6005546102bf906001600160a01b031681565b6102306104e7366004612323565b61148d565b6102e06104fa3660046121be565b600260209081526000928352604080842090915290825290205481565b61023061052536600461239a565b6116af565b610230611708565b60006001600160e01b03198216636578737160e01b148061056357506001600160e01b0319821663a219a02560e01b145b8061057e57506301ffc9a760e01b6001600160e01b03198316145b92915050565b600a546001146105a7576040516303cb96db60e21b815260040160405180910390fd5b6000600a55841580156105b8575083155b1561060b5760405163240bf61760e11b815260206004820152601f60248201527f4445583a20494e53554646494349454e545f4f55545055545f414d4f554e540060448201526064015b60405180910390fd5b600080610616610a6d565b5091509150816001600160701b03168710158061063c5750806001600160701b03168610155b1561068a5760405163abd6d26960e01b815260206004820152601b60248201527f4445583a20494e53554646494349454e545f4c495155494449545900000000006044820152606401610602565b60045460055460009182916001600160a01b03918216919081169089168214806106c55750806001600160a01b0316896001600160a01b0316145b1561070557604051631fadb98760e11b815260206004820152600f60248201526e4445583a20494e56414c49445f544f60881b6044820152606401610602565b8a1561071657610716828a8d611832565b891561072757610727818a8c611832565b8615610794576040516304347a1760e21b81526001600160a01b038a16906310d1e85c906107619033908f908f908e908e906004016123f3565b600060405180830381600087803b15801561077b57600080fd5b505af115801561078f573d6000803e3d6000fd5b505050505b6040516370a0823160e01b81523060048201526001600160a01b038316906370a0823190602401602060405180830381865afa1580156107d8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107fc919061243f565b6040516370a0823160e01b81523060048201529094506001600160a01b038216906370a0823190602401602060405180830381865afa158015610843573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610867919061243f565b92505050600089856001600160701b0316610882919061246e565b831161088f5760006108ac565b6108a28a6001600160701b03871661246e565b6108ac908461246e565b905060006108c38a6001600160701b03871661246e565b83116108d05760006108ed565b6108e38a6001600160701b03871661246e565b6108ed908461246e565b9050811580156108fb575080155b156109495760405163240bf61760e11b815260206004820152601e60248201527f4445583a20494e53554646494349454e545f494e5055545f414d4f554e5400006044820152606401610602565b6000610956836003612485565b610962866103e8612485565b61096c919061246e565b9050600061097b836003612485565b610987866103e8612485565b610991919061246e565b90506109a96001600160701b03808916908a16612485565b6109b690620f4240612485565b6109c08284612485565b10156109f85760405163240bf61760e11b81526020600482015260066024820152654445583a204b60d01b6044820152606401610602565b5050610a068484888861193d565b60408051838152602081018390529081018c9052606081018b90526001600160a01b038a169033907fd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d8229060800160405180910390a350506001600a55505050505050505050565b6006546001600160701b0380821692600160701b830490911691600160e01b900463ffffffff1690565b6000610aa4338484611ae4565b50600192915050565b6001600160a01b03831660009081526002602090815260408083203384529091528120546000198114610b0957610ae4838261246e565b6001600160a01b03861660009081526002602090815260408083203384529091529020555b610b14858585611b45565b506001949350505050565b610b398282604051806020016040528060008152506116af565b5050565b610b5883838360405180602001604052806000815250611207565b505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610ba5576040516282b42960e81b815260040160405180910390fd5b600480546001600160a01b039384166001600160a01b03199182161790915560058054929093169116179055565b6000600a54600114610bf8576040516303cb96db60e21b815260040160405180910390fd5b6000600a81905580610c08610a6d565b50600480546040516370a0823160e01b815230928101929092529294509092506000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610c5b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c7f919061243f565b6005546040516370a0823160e01b81523060048201529192506000916001600160a01b03909116906370a0823190602401602060405180830381865afa158015610ccd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cf1919061243f565b90506000610d086001600160701b0386168461246e565b90506000610d1f6001600160701b0386168461246e565b90506000610d2d8787611c4d565b60005490915080610d6b576103e8610d4d610d488587612485565b611d97565b610d57919061246e565b9850610d6660006103e8611e07565b610db2565b610daf6001600160701b038916610d828387612485565b610d8c91906124ba565b6001600160701b038916610da08487612485565b610daa91906124ba565b611e98565b98505b88610e0b5760405163abd6d26960e01b815260206004820152602260248201527f4445583a20494e53554646494349454e545f4c49515549444954595f4d494e54604482015261115160f21b6064820152608401610602565b610e158a8a611e07565b610e2186868a8a61193d565b8115610e4a57600654610e46906001600160701b03600160701b820481169116612485565b6009555b604080518581526020810185905233917f4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f910160405180910390a250506001600a5550949695505050505050565b600080600a54600114610ebe576040516303cb96db60e21b815260040160405180910390fd5b6000600a81905580610ece610a6d565b50600480546005546040516370a0823160e01b815230938101939093529395509193506001600160a01b0391821692919091169060009083906370a0823190602401602060405180830381865afa158015610f2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f51919061243f565b6040516370a0823160e01b81523060048201529091506000906001600160a01b038416906370a0823190602401602060405180830381865afa158015610f9b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fbf919061243f565b30600090815260016020526040812054919250610fdc8888611c4d565b60005490915080610fed8685612485565b610ff791906124ba565b9a50806110048585612485565b61100e91906124ba565b99508a158061101b575089155b156110745760405163abd6d26960e01b815260206004820152602260248201527f4445583a20494e53554646494349454e545f4c49515549444954595f4255524e604482015261115160f21b6064820152608401610602565b61107e3084611eb0565b611089878d8d611832565b611094868d8c611832565b6040516370a0823160e01b81523060048201526001600160a01b038816906370a0823190602401602060405180830381865afa1580156110d8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110fc919061243f565b6040516370a0823160e01b81523060048201529095506001600160a01b038716906370a0823190602401602060405180830381865afa158015611143573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611167919061243f565b935061117585858b8b61193d565b811561119e5760065461119a906001600160701b03600160701b820481169116612485565b6009555b604080518c8152602081018c90526001600160a01b038e169133917fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496910160405180910390a35050505050505050506001600a81905550915091565b6000610aa4338484611b45565b6001600160a01b0384166112695760405162461bcd60e51b8152602060048201526024808201527f4b4950373a207472616e736665722066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610602565b6001600160a01b03831661128f5760405162461bcd60e51b8152600401610602906124ce565b6001600160a01b0384166000908152600260209081526040808320338452909152902054600019811461133b578281101561130c5760405162461bcd60e51b815260206004820152601c60248201527f4b4950373a20696e73756666696369656e7420616c6c6f77616e6365000000006044820152606401610602565b611316838261246e565b6001600160a01b03861660009081526002602090815260408083203384529091529020555b611346858585611b45565b61135285858585611f3c565b61136e5760405162461bcd60e51b815260040161060290612510565b5050505050565b600a54600114611398576040516303cb96db60e21b815260040160405180910390fd5b6000600a55600480546005546006546040516370a0823160e01b815230948101949094526001600160a01b0392831693929091169161143b91849186916001600160701b03169083906370a08231906024015b602060405180830381865afa158015611408573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061142c919061243f565b611436919061246e565b611832565b6006546040516370a0823160e01b81523060048201526114839183918691600160701b90046001600160701b0316906001600160a01b038416906370a08231906024016113eb565b50506001600a5550565b428410156114cc5760405162461bcd60e51b815260206004820152600c60248201526b1111560e881156141254915160a21b6044820152606401610602565b6001600160a01b038716600090815260036020526040812080547f0000000000000000000000000000000000000000000000000000000000000000917f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9918b918b918b918761153a8361255e565b909155506040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810187905260e001604051602081830303815290604052805190602001206040516020016115b392919061190160f01b81526002810192909252602282015260420190565b60408051601f198184030181528282528051602091820120600080855291840180845281905260ff88169284019290925260608301869052608083018590529092509060019060a0016020604051602081039080840390855afa15801561161e573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116158015906116545750886001600160a01b0316816001600160a01b0316145b6116995760405162461bcd60e51b81526020600482015260166024820152754445583a20494e56414c49445f5349474e415455524560501b6044820152606401610602565b6116a4898989611ae4565b505050505050505050565b6001600160a01b0383166116d55760405162461bcd60e51b8152600401610602906124ce565b6116e0338484611b45565b6116ec33848484611f3c565b610b585760405162461bcd60e51b815260040161060290612510565b600a5460011461172b576040516303cb96db60e21b815260040160405180910390fd5b6000600a55600480546040516370a0823160e01b8152309281019290925261182b916001600160a01b03909116906370a0823190602401602060405180830381865afa15801561177f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117a3919061243f565b6005546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa1580156117eb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061180f919061243f565b6006546001600160701b0380821691600160701b90041661193d565b6001600a55565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b179052915160009283929087169161188e9190612579565b6000604051808303816000865af19150503d80600081146118cb576040519150601f19603f3d011682016040523d82523d6000602084013e6118d0565b606091505b50915091508180156118fa5750805115806118fa5750808060200190518101906118fa9190612595565b61136e5760405162461bcd60e51b81526020600482015260146024820152731111560e881514905394d1915497d1905253115160621b6044820152606401610602565b6001600160701b0384118061195857506001600160701b0383115b1561197657604051631a93c68960e11b815260040160405180910390fd5b6000611987640100000000426125b7565b60065490915063ffffffff600160e01b90910481168203908116158015906119b757506001600160701b03841615155b80156119cb57506001600160701b03831615155b15611a4c5763ffffffff81166119fc85607086901b600160701b600160e01b03165b6001600160e01b031690611fec565b600780546001600160e01b03929092169290920201905563ffffffff8116611a3484607087901b600160701b600160e01b03166119ed565b600880546001600160e01b0392909216929092020190555b506006805463ffffffff8316600160e01b026001600160e01b036001600160701b03888116600160701b9081026001600160e01b03199095168b83161794909417918216831794859055604080519382169282169290921783529290930490911660208201527f1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1910160405180910390a15050505050565b6001600160a01b0383811660008181526002602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b03831660009081526001602052604090205481811015611bbc5760405162461bcd60e51b815260206004820152602560248201527f4b4950373a207472616e7366657220616d6f756e7420657863656564732062616044820152646c616e636560d81b6064820152608401610602565b6001600160a01b03808516600090815260016020526040808220858503905591851681529081208054849290611bf39084906125cb565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051611c3f91815260200190565b60405180910390a350505050565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663017e7e586040518163ffffffff1660e01b8152600401602060405180830381865afa158015611cae573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611cd291906125e3565b6009546001600160a01b038216158015945091925090611d83578015611d7e576000611d0d610d486001600160701b03808816908916612485565b90506000611d1a83611d97565b905080821115611d7b576000611d30828461246e565b600054611d3d9190612485565b9050600082611d4d856005612485565b611d5791906125cb565b90506000611d6582846124ba565b90508015611d7757611d778782611e07565b5050505b50505b611d8f565b8015611d8f5760006009555b505092915050565b60006003821115611df85750806000611db16002836124ba565b611dbc9060016125cb565b90505b81811015611df257905080600281611dd781866124ba565b611de191906125cb565b611deb91906124ba565b9050611dbf565b50919050565b8115611e02575060015b919050565b80600054611e1591906125cb565b60009081556001600160a01b038316815260016020526040902054611e3b9082906125cb565b6001600160a01b0383166000818152600160205260408082209390935591519091907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90611e8c9085815260200190565b60405180910390a35050565b6000818310611ea75781611ea9565b825b9392505050565b6001600160a01b038216600090815260016020526040902054611ed490829061246e565b6001600160a01b03831660009081526001602052604081209190915554611efc90829061246e565b60009081556040518281526001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001611e8c565b60006001600160a01b0384163b611f5557506001611fe4565b604051634e8c461160e11b81526000906001600160a01b03861690639d188c2290611f8a9033908a9089908990600401612600565b6020604051808303816000875af1158015611fa9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611fcd919061263d565b6001600160e01b031916634e8c461160e11b149150505b949350505050565b6000611ea96001600160701b0383168461265a565b6001600160e01b03198116811461201757600080fd5b50565b60006020828403121561202c57600080fd5b8135611ea981612001565b6001600160a01b038116811461201757600080fd5b60008060008060006080868803121561206457600080fd5b8535945060208601359350604086013561207d81612037565b9250606086013567ffffffffffffffff8082111561209a57600080fd5b818801915088601f8301126120ae57600080fd5b8135818111156120bd57600080fd5b8960208285010111156120cf57600080fd5b9699959850939650602001949392505050565b60005b838110156120fd5781810151838201526020016120e5565b8381111561210c576000848401525b50505050565b6000815180845261212a8160208601602086016120e2565b601f01601f19169290920160200192915050565b602081526000611ea96020830184612112565b6000806040838503121561216457600080fd5b823561216f81612037565b946020939093013593505050565b60008060006060848603121561219257600080fd5b833561219d81612037565b925060208401356121ad81612037565b929592945050506040919091013590565b600080604083850312156121d157600080fd5b82356121dc81612037565b915060208301356121ec81612037565b809150509250929050565b60006020828403121561220957600080fd5b8135611ea981612037565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261223b57600080fd5b813567ffffffffffffffff8082111561225657612256612214565b604051601f8301601f19908116603f0116810190828211818310171561227e5761227e612214565b8160405283815286602085880101111561229757600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600080608085870312156122cd57600080fd5b84356122d881612037565b935060208501356122e881612037565b925060408501359150606085013567ffffffffffffffff81111561230b57600080fd5b6123178782880161222a565b91505092959194509250565b600080600080600080600060e0888a03121561233e57600080fd5b873561234981612037565b9650602088013561235981612037565b95506040880135945060608801359350608088013560ff8116811461237d57600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806000606084860312156123af57600080fd5b83356123ba81612037565b925060208401359150604084013567ffffffffffffffff8111156123dd57600080fd5b6123e98682870161222a565b9150509250925092565b60018060a01b038616815284602082015283604082015260806060820152816080820152818360a0830137600081830160a090810191909152601f909201601f19160101949350505050565b60006020828403121561245157600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b60008282101561248057612480612458565b500390565b600081600019048311821515161561249f5761249f612458565b500290565b634e487b7160e01b600052601260045260246000fd5b6000826124c9576124c96124a4565b500490565b60208082526022908201527f4b4950373a207472616e7366657220746f20746865207a65726f206164647265604082015261737360f01b606082015260800190565b6020808252602e908201527f4b4950373a207472616e7366657220746f206e6f6e204b49503752656365697660408201526d32b91034b6b83632b6b2b73a32b960911b606082015260800190565b600060001982141561257257612572612458565b5060010190565b6000825161258b8184602087016120e2565b9190910192915050565b6000602082840312156125a757600080fd5b81518015158114611ea957600080fd5b6000826125c6576125c66124a4565b500690565b600082198211156125de576125de612458565b500190565b6000602082840312156125f557600080fd5b8151611ea981612037565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061263390830184612112565b9695505050505050565b60006020828403121561264f57600080fd5b8151611ea981612001565b60006001600160e01b0383811680612674576126746124a4565b9216919091049291505056fea2646970667358221220fbc63cd54ce70f98af20b0f29be70eb3bc86cb78b87c9e7fbe124a6e7b4d503864736f6c634300080c0033";

type DexPairConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DexPairConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DexPair__factory extends ContractFactory {
  constructor(...args: DexPairConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DexPair> {
    return super.deploy(overrides || {}) as Promise<DexPair>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DexPair {
    return super.attach(address) as DexPair;
  }
  override connect(signer: Signer): DexPair__factory {
    return super.connect(signer) as DexPair__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DexPairInterface {
    return new utils.Interface(_abi) as DexPairInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DexPair {
    return new Contract(address, _abi, signerOrProvider) as DexPair;
  }
}