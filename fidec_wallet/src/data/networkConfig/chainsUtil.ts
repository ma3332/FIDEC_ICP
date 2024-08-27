import { EIP155_CHAINS } from './EIP155Data' 
 

export const ALL_CHAINS = {
  ...EIP155_CHAINS
}

export function getChainData(chainId: string | number, networks: [{
  chainID?: number 
}]) {
  if (!chainId) return
  chainId = chainId.toString().includes(':') ? chainId.toString().split(':')[1] : chainId
  return networks.find(chain => chain?.chainID == Number(chainId))
}