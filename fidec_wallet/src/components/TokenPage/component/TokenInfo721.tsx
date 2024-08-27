import Web3 from "web3";
import { useState, useEffect } from "react"; 
import "../styles.scss";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store"; 
import ABIJsonERC721 from "../../../data/abiJsonToken/abiERC721.json"; 

  
const TokenInfo721 = (props: any) => { 
  
  const {addressToken, tokenId} : any = props.info;   

  const [tokenURI, setTokenURI] = useState<string>('');
 
  const accountsState = useSelector((state: RootState) => state.accounts); 
  const networksState = useSelector((state: RootState)=> state.networks); 
  const {eip155Address}: any = accountsState;
  const { network } = networksState; 
  const {address} : any = eip155Address;
  const {url} : any = network;  

  const web3 = new Web3( url ); 
  const abi : any = ABIJsonERC721.abi; 
  const contract = new web3.eth.Contract(abi, addressToken, {from: address});
  
  const getTokenURI = async ()=>{
    const uri = await contract.methods.tokenURI(Number(tokenId)).call();  
    setTokenURI(uri);
  }

  useEffect(()=>{
    getTokenURI()
  }, [address])
  
  return (  

      <div className="token--item" >  
        <div>
          <p>1</p>
          <p>{tokenId}</p> 
          <p>{tokenURI.slice(0, 16)}...{tokenURI.slice(-6)}</p>
        </div>
      </div>    
  );
};

export default TokenInfo721;
