import SignClient from '@walletconnect/sign-client'

export let signClient: SignClient

export async function createSignClient() {
  signClient = await SignClient.init({
    projectId: 'c3e4ffbd63f2e311a064de7eea4096cb',
    relayUrl: 'wss://relay.walletconnect.com',
    metadata: {
      name: "Card Wallet",
      description: "Card Wallet",
      url: "#",
      icons: ['https://avatars.githubusercontent.com/u/37784886']
    }
  })
}