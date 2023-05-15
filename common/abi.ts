const internalTypeEnumFlipStatus = "enum CoinFlip.FlipStatus";
const internalTypeEnumSide = "enum CoinFlip.Side";
const internalTypeStructFlip = "struct CoinFlip.Flip";

const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_player",
        type: "address",
      },
    ],
    name: "banPlayer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "collect",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "disable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "disabled",
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
    inputs: [],
    name: "enable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "flip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
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
        name: "_player",
        type: "address",
      },
    ],
    name: "getCurrentFlip",
    outputs: [
      {
        components: [
          {
            internalType: internalTypeEnumFlipStatus,
            name: "status",
            type: "uint8",
          },
          {
            internalType: internalTypeEnumSide,
            name: "calledSide",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "wagerAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "flipFee",
            type: "uint256",
          },
          {
            internalType: internalTypeEnumSide,
            name: "flipResult",
            type: "uint8",
          },
        ],
        internalType: internalTypeStructFlip,
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_player",
        type: "address",
      },
    ],
    name: "getCurrentFlipIndex",
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
        name: "_player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_flipIndex",
        type: "uint256",
      },
    ],
    name: "getFlip",
    outputs: [
      {
        components: [
          {
            internalType: internalTypeEnumFlipStatus,
            name: "status",
            type: "uint8",
          },
          {
            internalType: internalTypeEnumSide,
            name: "calledSide",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "wagerAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "flipFee",
            type: "uint256",
          },
          {
            internalType: internalTypeEnumSide,
            name: "flipResult",
            type: "uint8",
          },
        ],
        internalType: internalTypeStructFlip,
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_player",
        type: "address",
      },
    ],
    name: "incrementCurrentFlip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_player",
        type: "address",
      },
    ],
    name: "isBanned",
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
        internalType: "address",
        name: "_player",
        type: "address",
      },
    ],
    name: "isWinner",
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
        internalType: "address",
        name: "_player",
        type: "address",
      },
      {
        internalType: internalTypeEnumFlipStatus,
        name: "_status",
        type: "uint8",
      },
    ],
    name: "overrideFlipStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feeBasePoints",
        type: "uint256",
      },
    ],
    name: "setFeeBasePoints",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxWager",
        type: "uint256",
      },
    ],
    name: "setMaxWager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minWager",
        type: "uint256",
      },
    ],
    name: "setMinWager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_player",
        type: "address",
      },
    ],
    name: "unbanPlayer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: internalTypeEnumSide,
        name: "_calledSide",
        type: "uint8",
      },
    ],
    name: "wager",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

export default CONTRACT_ABI;
