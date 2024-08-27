// import type { RootState } from "../store/store";
// import { useSelector } from "react-redux";

// const network = () =>{
//   const networksState = useSelector((state: RootState) => state.networks);
//   const { networks } = networksState;
// } 

/**
 * @desc Refference list of eip155 chains
 * @url https://chainlist.org
 */

/**
 * Types
 */
 export type TEIP155Chain = keyof typeof EIP155_CHAINS

 /**
  * Chains
  */
 export const EIP155_MAINNET_CHAINS = {
   'eip155:1': {
     chainId: 1,
     name: 'Ethereum',
     logo: '/chain-logos/eip155-1.png',
     rgb: '99, 125, 234',
     rpc: 'https://cloudflare-eth.com/'
   },
  //  'eip155:43114': {
  //    chainId: 43114,
  //    name: 'Avalanche C-Chain',
  //    logo: '/chain-logos/eip155-43113.png',
  //    rgb: '232, 65, 66',
  //    rpc: 'https://api.avax.network/ext/bc/C/rpc'
  //  },
  //  'eip155:137': {
  //    chainId: 137,
  //    name: 'Polygon',
  //    logo: '/chain-logos/eip155-137.png',
  //    rgb: '130, 71, 229',
  //    rpc: 'https://polygon-rpc.com/'
  //  }
 }
 
 export const EIP155_TEST_CHAINS = {
   'eip155:420': {
     chainId: 420,
     name: 'Ethereum Goerli',
     logo: '/chain-logos/eip155-1.png',
     rgb: '99, 125, 234',
     rpc: 'https://goerli.infura.io/v3/eb4e3ec2fd9c4b92ae0142d44172e91e"'
   },
  //  'eip155:43113': {
  //    chainId: 43113,
  //    name: 'Avalanche Fuji',
  //    logo: '/chain-logos/eip155-43113.png',
  //    rgb: '232, 65, 66',
  //    rpc: 'https://api.avax-test.network/ext/bc/C/rpc'
  //  },
  //  'eip155:80001': {
  //    chainId: 80001,
  //    name: 'Polygon Mumbai',
  //    logo: '/chain-logos/eip155-137.png',
  //    rgb: '130, 71, 229',
  //    rpc: 'https://matic-mumbai.chainstacklabs.com'
  //  }
 }
 
 export const EIP155_CHAINS = { ...EIP155_MAINNET_CHAINS, ...EIP155_TEST_CHAINS }
 
 /**
  * Methods
  */
 export const EIP155_SIGNING_METHODS = {
   PERSONAL_SIGN: 'personal_sign',
   ETH_SIGN: 'eth_sign',
   ETH_SIGN_TRANSACTION: 'eth_signTransaction',
   ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
   ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
   ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
   ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
   ETH_SEND_TRANSACTION: 'eth_sendTransaction'
 }