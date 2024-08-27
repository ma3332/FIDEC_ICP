import {EIP155_SIGNING_METHODS } from '../data/EIP155Data'  
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import { SignClientTypes } from '@walletconnect/types'
import { getSdkError } from '@walletconnect/utils'; 
  
export async function approveEIP155Request( 
   requestEvent : any
) {
  const { params, id} = requestEvent
  const {request } = params 
  

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN: 
      try { 
        const signedMessage =  requestEvent?.signedMessage; 
        return formatJsonRpcResult(id, signedMessage);
      } catch (error) { 
        alert(error.message);
        return formatJsonRpcError(id, error.message);
      }
       

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION: 
    try { 
      const hash = requestEvent?.hash; 
      console.log("hashTx: ", hash); 
      return formatJsonRpcResult(id, hash)
       
    } catch (error) {
      console.error(error)
      alert(error.message)
      return formatJsonRpcError(id, error.message)
    }
      

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      try { 
        const signature = requestEvent?.rawTransaction;
        console.log(signature)
        return formatJsonRpcResult(id, signature)
      } catch (error) {
        console.error(error)
        alert(error.message)
        return formatJsonRpcError(id, error.message)
      }
      

    default:
      throw new Error(getSdkError('INVALID_METHOD').message)
  }
}

export function rejectEIP155Request(request: SignClientTypes.EventArguments['session_request']) {
  const { id } = request

  return formatJsonRpcError(id, getSdkError('USER_REJECTED_METHODS').message)
}