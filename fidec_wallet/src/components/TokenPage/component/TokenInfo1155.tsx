import Web3 from "web3";
import { useState, useEffect } from "react"; 
import "../styles.scss";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store/store"; 
import ABIJsonERC1155 from "../../../data/abiJsonToken/abiERC1155.json"; 
 
   
const TokenInfo1155 = (props: any) => { 
  
  const {addressToken, tokenInfo} : any = props.info; 

  const [URI, setURI] = useState<string>('');
 
  const accountsState = useSelector((state: RootState) => state.accounts); 
  const networksState = useSelector((state: RootState)=> state.networks); 
  const {eip155Address}: any = accountsState;
  const { network } = networksState; 
  const {address} : any = eip155Address;
  const {url} : any = network; 

  const web3 = new Web3( url ); 
  const abi : any = ABIJsonERC1155.abi; 
  const contract = new web3.eth.Contract(abi, addressToken, {from: address});
 
  const getTokenURI = async ()=>{
    const uri = await contract.methods.uri(Number(tokenInfo.tokenId)).call(); 
    setURI(uri);
  }

  useEffect(()=>{
    getTokenURI()
  }, [address])
  
  return (  

      <div className="token--item" >  
        <div>
          <p>{tokenInfo.amt_of_tokenId}</p>
          <p>{tokenInfo.tokenId}</p> 
          <p>{URI.slice(0, 12)}...{URI.slice(-6)}</p>
        </div>
      </div>    
  );
};

export default TokenInfo1155;
