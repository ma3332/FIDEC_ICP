/**
 * @desc Refference list of eip155 chains
 * @url https://chainlist.org
 */

/**
 * Types
 */
export type TEIP155Chain = keyof typeof EIP155_CHAINS;

/**
 * Chains
 */
export const EIP155_MAINNET_CHAINS = {
  "eip155:1": {
    chainID: 1,
    name: "Mainnet Ethereum",
    url: "https://mainnet.infura.io/v3/eb4e3ec2fd9c4b92ae0142d44172e91e",
    ws: "wss://mainnet.infura.io/ws/v3/eb4e3ec2fd9c4b92ae0142d44172e91e",
    namespace: "eip155",
    symbol: "ETH",
  },
  "eip155:43114": {
    chainID: 43114,
    name: "Avalanche C-Chain",
    url: "https://api.avax.network/ext/bc/C/rpc",
    ws: "",
    namespace: "eip155",
    symbol: "ACC",
  },
  "eip155:137": {
    chainID: 137,
    name: "Polygon",
    url: "https://polygon-rpc.com/",
    ws: "",
    namespace: "eip155",
    symbol: "Poly",
  },
  "eip155:10": {
    chainID: 10,
    name: "Optimism",
    url: "https://mainnet.optimism.io",
    ws: "",
    namespace: "eip155",
    symbol: "Opti",
  },
  "eip155:324": {
    chainID: 324,
    name: "zkSync Era",
    url: "https://mainnet.era.zksync.io/",
    ws: "",
    namespace: "eip155",
    symbol: "ZkE",
  },
  "eip155:56": {
    chainID: 56,
    name: "Binance Smart Chain Mainnet",
    url: "https://bsc-dataseed.bnbchain.org",
    ws: "",
    namespace: "eip155",
    symbol: "BSC",
  },
};

export const EIP155_TEST_CHAINS = {
  "eip155:5": {
    chainID: 5,
    name: "Goerli Ethereum",
    url: "https://goerli.infura.io/v3/eb4e3ec2fd9c4b92ae0142d44172e91e",
    ws: "wss://goerli.infura.io/ws/v3/eb4e3ec2fd9c4b92ae0142d44172e91e",
    namespace: "eip155",
    symbol: "Goerli",
  },
  "eip155:43113": {
    chainID: 43113,
    name: "Avalanche Fuji",
    url: "https://api.avax-test.network/ext/bc/C/rpc",
    ws: "",
    namespace: "eip155",
    symbol: "tAvF",
  },
  "eip155:80001": {
    chainID: 80001,
    name: "Polygon Mumbai",
    url: "https://matic-mumbai.chainstacklabs.com",
    ws: "",
    namespace: "eip155",
    symbol: "tPoli",
  },
  "eip155:420": {
    chainID: 420,
    name: "Optimism Goerli",
    url: "https://goerli.optimism.io",
    ws: "",
    namespace: "eip155",
    symbol: "tOpti",
  },
  "eip155:280": {
    chainID: 280,
    name: "zkSync Era Testnet",
    url: "https://testnet.era.zksync.dev/",
    ws: "",
    namespace: "eip155",
    symbol: "tZkE",
  },
  "eip155:97": {
    chainID: 97,
    name: "Binance Smart Chain Testnet",
    url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    ws: "",
    namespace: "eip155",
    symbol: "tBSC",
  },
};

export const EIP155_CHAINS = {
  ...EIP155_MAINNET_CHAINS,
  ...EIP155_TEST_CHAINS,
};

/**
 * Methods
 */
export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: "personal_sign",
  ETH_SIGN: "eth_sign",
  ETH_SIGN_TRANSACTION: "eth_signTransaction",
  ETH_SEND_RAW_TRANSACTION: "eth_sendRawTransaction",
  ETH_SEND_TRANSACTION: "eth_sendTransaction",
};
