import Web3 from "web3";
import { useState, useEffect } from "react";
// import AxieIcon from "../images/axie-infinity.png";
import { RightOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "../styles.scss";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store/store";
import { setAddressERC721or1155, setInfoNFT721, setInfoNFT1155, setShowInfoNFT, setCheckGetAddressERC } from '../../../store/StoreComponents/Tokens/tokens'; 
import ABIJsonERC721 from "../../../data/abiJsonToken/abiERC721.json";
import ABIJsonERC1155 from "../../../data/abiJsonToken/abiERC1155.json"; 
import { setLoading } from "../../../store/Support/Loading/LoadingSlice";
import { openNotification } from "../../../utils/helperUtil";

const style = {
  position: "absolute" as any,
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "360px",
  height: "200px",
  bgcolor: "#252525",
  boxShadow: 24,
  p: 4,
  borderRadius: "14px",
  textAlign: "center",
  color: "white",
};

 

const TokenGroup = (props: any) => { 
   
  const {addressToken, type, symbol, indexToken, index, logo}: any = props.info; 

  const dispatch = useDispatch();
 
  const [recordToken, setRecordToken] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);  
  const [balance, setBalance] = useState<string>('0');
  const [checkEvent, setCheckEvent] = useState<boolean>(false); 

  const accountsState = useSelector((state: RootState) => state.accounts); 
  const networksState = useSelector((state: RootState)=> state.networks); 
  const {eip155Address} = accountsState;
  const { network } = networksState; 
  const {address}  = eip155Address;
  const {url, ws}  = network; 

  const web3 = new Web3( url ); 
  const web3ws = new Web3(ws);
  const abi721 : any = ABIJsonERC721.abi; 
  const abi1155 : any = ABIJsonERC1155.abi; 
  const id_card = 1; 
 

  const deletToken = async ()=>{  
    try {
      const {result, message} = await window.Main.handleDeleteToken({index: recordToken.indexToken});
      if(result){ 
        setOpen(false); 
        dispatch(setCheckGetAddressERC(true));
      }
      openNotification(message, result ? "success" : "error") 
    } catch (error) {
      console.log(error);
    }
  }

  const dataNFT = async ()=>{
  dispatch(setLoading(true));
  const contract = new web3.eth.Contract(abi721,addressToken, {from: address});

    
  type Token = { 
    setCurrentBlock: number,  
  }

    const token: Partial<Token> = {};
    let id_info_token: string[] = [];
    const id_info_token_receive : string[] = [];
    const id_info_token_send: string[] = [];
    

    const currentBlock = await window.Main.handleGetCurrentBlock({id_card, address, address_contract: addressToken, type: "erc721"}); 
 
    if(currentBlock == 0){
      await contract.getPastEvents("Transfer", {filter: {from: "", to: address}, fromBlock: currentBlock, toBlock: "latest"}).then((result) =>{ 
          if(result.length > 0){  
            result.map((item: any)=>{ 
              id_info_token.push(item?.returnValues.tokenId); 
              token.setCurrentBlock = item.blockNumber;
            })
          }
        })
      await contract.getPastEvents("Transfer", {filter: {from: address, to: ""}, fromBlock: currentBlock, toBlock: "latest"}).then((result) =>{
        if(result.length > 0){
          result.map(data=>{   
            id_info_token = id_info_token.filter((item: any)=>item !== data.returnValues.tokenId)
            if(data.blockNumber > Number(token.setCurrentBlock)){ 
              token.setCurrentBlock = data.blockNumber;
            }
          })
        }
      })
  
      const dataNeedSave = {
        id_card,
        data: [
          {
            address,
            infoNFT: [
              {
                address_contract: addressToken,
                balance: `${id_info_token.length}`,
                currentBlock: token.setCurrentBlock,
                tokenInfo: id_info_token,
              }
            ]
          }
        ]
      } 
  
      const res = await window.Main.handleSaveDataERC({id_card, address, address_contract:addressToken, dataNeedSave: dataNeedSave, type: "erc721"});
      setBalance(res.balance); 
      dispatch(setInfoNFT721(res));
      }else if(currentBlock && currentBlock > 0 ){ 

        await contract.getPastEvents("Transfer", {filter: {from: "", to: address}, fromBlock: currentBlock, toBlock: "latest"}).then((result) => {
          if(result.length > 0) {
            result.forEach((data) => {
              if(data.blockNumber > currentBlock){
                id_info_token_receive.push(data.returnValues.tokenId);
                token.setCurrentBlock = data.blockNumber;
              }
            })
          }
      })

      await contract.getPastEvents("Transfer", {filter: {from: address, to:""}, fromBlock: currentBlock, toBlock: "latest"}).then((result) => {
          if(result.length > 0) {
            result.forEach(data => {
              if(data.blockNumber > currentBlock){
              id_info_token_send.push(data.returnValues.tokenId);
              if(data.blockNumber > Number(token.setCurrentBlock)){ 
                token.setCurrentBlock = data.blockNumber;
              }
            }
            })
          }
      })

     const dataNeedUpdate = {
       id_card,
       address, 
       address_contract: addressToken,
       currentBlock: token.setCurrentBlock ? token.setCurrentBlock : currentBlock, 
       token_receive: id_info_token_receive,
       token_send: id_info_token_send  
     }
      
       const res = await window.Main.handleUpdateDataERC721(dataNeedUpdate);  
       setBalance(res.balance); 
       dispatch(setInfoNFT721(res));  
    }
    dispatch(setLoading(false));
  }

  const dataERC1155 = async ()=>{ 
    dispatch(setLoading(true));
    const contract = new web3.eth.Contract(abi1155, addressToken, {from: address}); 
 
    let info_token_1155: any = [];  
    const info_token_receive: any = [];  
    const info_token_send: any = [];  
    type Token = { 
      setCurrentBlock: number, 
    }

    const token: Partial<Token> = {};

    const currentBlock = await window.Main.handleGetCurrentBlock({id_card, address, address_contract: addressToken, type: "erc1155"});
 

    if(currentBlock == 0) {

      // receive
      //TransferSingle
      await contract.getPastEvents('TransferSingle', {filter: {from: "", to: address}, fromBlock: 0, toBlock: "latest"}).then((result)=>{
        if(result.length > 0){
            result.forEach((data: any)=>{
              info_token_1155.push({
                tokenId: data.returnValues.id,
                amt_of_tokenId: data.returnValues.value
              });
              token.setCurrentBlock = data.blockNumber;  
            })
        }
      })
 
      //TransferBatch
      await contract.getPastEvents('TransferBatch', {filter: {from: "", to: address}, fromBlock: 0, toBlock: "latest"}).then((result)=>{

        if(result.length > 0){
            result.forEach((data: any)=>{
              data.returnValues.ids.forEach((id: string, index1: number)=>{
                info_token_1155.forEach((item: any, index2: number)=>{
                  if(id === item.id){
                    const amt = Number(item.amt_of_tokenId) - Number(data.returnValues.values[index1]);
                    info_token_1155[index2].amt_of_tokenId = amt.toString();
                  }else {
                    info_token_1155.push({
                      tokenId: id,
                      amt_of_tokenId: data.returnValues.values[index1]
                    })
                  }
                })

              }) 
              if(data.blockNumber > Number(token.setCurrentBlock)){ 
                token.setCurrentBlock = data.blockNumber;
              }
            })
        }
      })

      // send
      //TransferSingle
      await contract.getPastEvents('TransferSingle', {filter: {from: address, to: ""}, fromBlock:0, toBlock: "latest"}).then((result)=>{
 
        if(result.length > 0){
          result.forEach((data: any)=>{
            info_token_1155.forEach((item: any, index: number)=>{ 
              if(item.tokenId === data.returnValues.id ){
                const amt_of_tokenId = Number(item.amt_of_tokenId) - Number(data.returnValues.value); 
                if(amt_of_tokenId == 0){ 
                  info_token_1155.splice(index)
                }else {
                  info_token_1155[index].amt_of_tokenId =  amt_of_tokenId.toString();
                }
              }
            }); 
            if(data.blockNumber > token.setCurrentBlock){
              token.setCurrentBlock = data.blockNumber;
            }
          })
        }
      })

      //TransferBatch
      await contract.getPastEvents('TransferBatch', {filter: {from: address, to:""}, fromBlock: 0, toBlock: "latest"}).then((result)=>{
 
        if(result.length > 0){  
          result.forEach((data: any)=>{ 
            data.returnValues.ids.forEach((id: string, index1: number)=>{
              info_token_1155.forEach((item: any, index2: number)=>{
                if(id === item.tokenId){
                  const amt = Number(item.amt_of_tokenId) - Number(data.returnValues.values[index1]);
                  if(amt == 0){
                    const arr1 = info_token_1155.slice(0, indexToken);
                    const arr2 = info_token_1155.slice(indexToken + 1, info_token_1155.length);
                    info_token_1155 = arr1.concat(arr2);
                  }else {
                    info_token_1155[index2].amt_of_tokenId = amt.toString();
                  }
                }
              })
            })
            if(data.blockNumber > Number(token.setCurrentBlock)){ 
              token.setCurrentBlock = data.blockNumber;
            }
          })
        }
      })
   
      const dataNeedSave = {
        id_card,
        data: [
          {
            address,
            infoNFT: [
              {
                address_contract: addressToken,
                sum_amt_tokenId: info_token_1155.length,
                currentBlock: token.setCurrentBlock,
                tokenInfo: info_token_1155
              }
            ]
          }
        ]
      }
   
      const res = await window.Main.handleSaveDataERC({id_card, address, address_contract: addressToken, dataNeedSave: dataNeedSave, type: "erc1155"});
 
      setBalance(res.sum_amt_tokenId);
      dispatch(setInfoNFT1155(res));
      

    }else if(currentBlock > 0){ 


      await contract.getPastEvents("TransferBatch", {filter: {from: "", to: address}, fromBlock: currentBlock + 1, toBlock: "latest"}).then((result) => {
        if(result.length > 0) {
          result.forEach((data) => { 
            data.returnValues.ids.forEach((id: string, index: string)=>{
              info_token_receive.push({
                tokenId: id,
                amt_if_tokenId: data.returnValues.values[index]
              })
            })   
            token.setCurrentBlock = data.blockNumber; 
          })
        }
     });

      await contract.getPastEvents("TransferSingle", {filter: {from: "", to: address}, fromBlock: currentBlock + 1, toBlock: "latest"}).then((result) => {
        if(result.length > 0) {
          result.forEach((data) => { 
              info_token_receive.push({
                tokenId: data.returnValues.id,
                amt_of_tokenId: data.returnValues.value
              });
              if(data.blockNumber > Number(token.setCurrentBlock)){ 
                token.setCurrentBlock = data.blockNumber;
              }
          })
        }
     });

     await contract.getPastEvents("TransferBatch", {filter: {from: address, to:""}, fromBlock: currentBlock + 1, toBlock: "latest"}).then((result) => {
      if(result.length > 0) {
        result.forEach(data => {
          data.returnValues.ids.forEach((id: string, index: number) => {
            info_token_send.push({
              tokenId: id,
              amt_of_tokenId: data.returnValues.values[index]
            })
          })
          if(data.blockNumber > Number(token.setCurrentBlock)){ 
            token.setCurrentBlock = data.blockNumber;
          }
        })
      }
  });

     await contract.getPastEvents("TransferSingle", {filter: {from: address, to:""}, fromBlock: currentBlock + 1, toBlock: "latest"}).then((result) => {
        if(result.length > 0) {
          result.forEach(data => {
            info_token_send.push({
              tokenId: data.returnValues.id,
              amt_of_tokenId: data.returnValues.value
            });
            if(data.blockNumber > Number(token.setCurrentBlock)){ 
              token.setCurrentBlock = data.blockNumber;
            }
          })
        }
    });

    const dataNeedUpdate = {
      id_card,
      address, 
      address_contract: addressToken,
      currentBlock: token.setCurrentBlock ? token.setCurrentBlock : currentBlock,
      token_receive: info_token_receive,
      token_send: info_token_send
    }

    const res = await window.Main.handleUpdateDataERC1155(dataNeedUpdate); 
    setBalance(res.sum_amt_tokenId);
    dispatch(setInfoNFT1155(res));
    }
    dispatch(setLoading(false));
  }

 
  useEffect(()=>{
    
    if(type === "ERC721"){
      const contractws = new web3ws.eth.Contract(abi721, addressToken);

      //event receive
      contractws.events.Transfer({
        // filter options, if any
        filter : {from: "", to: address}
      }, function(error: any, event: any) {
        if (!error) {
          console.log(event.returnValues);
        } else {
          console.error(error);
        }
      })
      .on('data', function(event: any){
        console.log(event); // same results as the optional callback above
        setCheckEvent(!checkEvent);
      })
      .on('changed', function(event: any){
        // remove event from local database
      })
      .on('error', (console.error));

      //event send
      contractws.events.Transfer({
        // filter options, if any
        filter : {from: address, to: ""}
      }, function(error: any, event: any) {
        if (!error) {
          console.log(event.returnValues);
        } else {
          console.error(error);
        }
      })
      .on('data', function(event: any){
        console.log(event); // same results as the optional callback above
        setCheckEvent(!checkEvent);
      })
      .on('changed', function(event: any){
        // remove event from local database
      })
      .on('error', (console.error));

    }else if(type === "ERC1155"){ 
    const contractws = new web3ws.eth.Contract(abi1155, addressToken);

    //event receive TransferSingle
    contractws.events.TransferSingle({
      // filter options, if any
      filter : {from: "", to: address}
    }, function(error: any, event: any) {
      if (!error) {
        console.log(event.returnValues);
      } else {
        console.error(error);
      }
      })
      .on('data', function(event: any){
        console.log(event); // same results as the optional callback above
        setCheckEvent(!checkEvent);
      }) 
      .on('error', (console.error));

      //event send TransferSingle
    contractws.events.TransferSingle({
      // filter options, if any
      filter : {from: address, to: ""}
    }, function(error: any, event: any) {
      if (!error) {
        console.log(event.returnValues);
      } else {
        console.error(error);
      }
      })
      .on('data', function(event: any){
        console.log(event); // same results as the optional callback above
        setCheckEvent(!checkEvent);
      }) 
      .on('error', (console.error));
      

      // event receive TransferBatch
      contractws.events.TransferBatch({ 
        filter : {from: "", to: address}
      }, function(error: any, event: any) {
        if (!error) {
          console.log(event.returnValues);
        } else {
          console.error(error);
        }
        })
        .on('data', function(event: any){
          console.log(event); // same results as the optional callback above
          setCheckEvent(!checkEvent);
        }) 
        .on('error', (console.error));

      // event send TransferBatch
      contractws.events.TransferBatch({ 
        filter : {from: address, to: ""}
      }, function(error: any, event: any) {
        if (!error) {
          console.log(event.returnValues);
        } else {
          console.error(error);
        }
        })
        .on('data', function(event: any){
          console.log(event);  
          setCheckEvent(!checkEvent);
        }) 
        .on('error', (console.error));
      } 
  }, [address]);

  useEffect(()=>{ 
    if(type === "ERC721"){ 
      dataNFT();
    }else if (type === "ERC1155"){ 
      dataERC1155(); 
    }
  },[address, checkEvent, addressToken, url]);

  useEffect(()=>{
    if(index==0){
      dispatch(setAddressERC721or1155({
        addressToken: addressToken, 
        type: type,
        balance,
        symbol: symbol,
        index: indexToken
     }));
    }
  }, [balance])

 
  return ( 
    <div className="token--container"> 
            
      <div className="token--item"  onClick={async ()=> { 
        //  dispatch(setPath("/token/send-token"))
         dispatch(setAddressERC721or1155({
            addressToken: addressToken, 
            type: type,
            balance,
            symbol: symbol,
            index: indexToken
         })); 
         }} > 
        <div>
          <img src={logo} alt="" />
          <p>{balance}</p>
          <p>{type === "ERC721" ? symbol : `${addressToken.slice(0,6)+"..."+ addressToken.slice(-4)}`}</p> 
          <p>{type}</p> 
        </div>
        <div>
          <CloseCircleOutlined
            style={{ marginRight: "10px" }}
            onClick={() => {
              setRecordToken({type, addressToken, indexToken});
              setOpen(true);
            }} // set một state record ở đây, lưu data của token vào
          />
          <RightOutlined onClick={()=>{
            if(Number(balance) > 0){
              dispatch(setShowInfoNFT(true));
            }
          }}/>
        </div>
      </div>  

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            REMOVE TOKEN
          </Typography>

          <p style={{ fontWeight: "400", fontSize: "16px", margin: "20px 0" }}>
            Are you sure you want to remove <br /> {recordToken?.type ?? ""}{" "}
            Token ?
          </p>
          <div className="button-remove-group">
            <button className="btn--remove" onClick={() => setOpen(false)}>
              Back
            </button>
            <button className="btn--remove" onClick={() =>deletToken()}>Confirm</button>
          </div>
        </Box>
      </Modal>
    </div> 
  );
};

export default TokenGroup;
