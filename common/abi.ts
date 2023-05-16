const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
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
    inputs: [],
    name: "feeBasePoints",
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
        internalType: "enum CoinFlip.Side",
        name: "_calledSide",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "flip",
    outputs: [],
    stateMutability: "payable",
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
            internalType: "enum CoinFlip.FlipStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "enum CoinFlip.Side",
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
            internalType: "uint256",
            name: "payoutAmount",
            type: "uint256",
          },
          {
            internalType: "enum CoinFlip.Side",
            name: "flipResult",
            type: "uint8",
          },
        ],
        internalType: "struct CoinFlip.Flip",
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
            internalType: "enum CoinFlip.FlipStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "enum CoinFlip.Side",
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
            internalType: "uint256",
            name: "payoutAmount",
            type: "uint256",
          },
          {
            internalType: "enum CoinFlip.Side",
            name: "flipResult",
            type: "uint8",
          },
        ],
        internalType: "struct CoinFlip.Flip",
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
    inputs: [],
    name: "maxWager",
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
    name: "minWager",
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
    stateMutability: "payable",
    type: "receive",
  },
];

export default CONTRACT_ABI;
