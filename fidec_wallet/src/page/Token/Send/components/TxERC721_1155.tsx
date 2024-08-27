import { Button, Form, Input } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { openNotification } from "../../../../utils/helperUtil"; 
import format from "../../../../utils/format";
import ABIJsonERC721 from "../../../../data/abiJsonToken/abiERC721.json";
import ABIJsonERC1155 from "../../../../data/abiJsonToken/abiERC1155.json";
import ModalSelectTokenID from "./ModalSelectToken";



type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>; 


interface Props  { 
    addressSend: string;
    setOpenView: SetStateFunction<boolean>;
    setComfirmDecodeTo: SetStateFunction<boolean>;
    setMsgHash: SetStateFunction<string>;
    setDecodeTo: SetStateFunction<string>;
    setTx: SetStateFunction<{
        chainID: string,
        nonce: string,
        maxPriorityFeePerGas: string,
        maxFeePerGas: string,
        gasLimit: string,
        to: string,
        value: string,
        data: string,
        accessList: [],
        v: string,
        r: string,
        s: string
    }>;
    type_send: string;
    items: string[];
    speedUp: number;
    setSpeedUp: SetStateFunction<number>;
    activeItem: number;
    setActiveItem: SetStateFunction<number>;
}
 

const TxERC721_1155 = ({
        addressSend, 
        setOpenView,
        setComfirmDecodeTo,
        setMsgHash,
        setDecodeTo,
        setTx,
        type_send,
        items,
        speedUp,
        setSpeedUp,
        activeItem, 
        setActiveItem
    }:Props)=>{
         
    const networksState = useSelector((state: RootState) => state.networks);
    const accountsState = useSelector((state: RootState) => state.accounts);
    const tokensState  = useSelector((state: RootState) => state.tokens);
    const { addressERC721or1155, infoNFT721, infoNFT1155 } = tokensState;
    const { addressToken, type, symbolToken }  = addressERC721or1155; 
    const { eip155Address, eip155Addresses } = accountsState;
    const { address, name, indexAccount } = eip155Address;
    const { network } = networksState;
    const { url } = network;
    const web3 = new Web3(url);
    let abi: any;  
    let infoNFT: any;

    if (type === "ERC721") {
        abi = ABIJsonERC721.abi;
        infoNFT = infoNFT721;
    } else if (type === "ERC1155") {
        abi = ABIJsonERC1155.abi;
        infoNFT = infoNFT1155;
    }
     
    const contract = new web3.eth.Contract(abi, addressToken, {
      from: address,
    });
  

    const [form] = Form.useForm();  
    const [estimateGas, setEstimateGas] = useState("0");
    const [totalFee, setTotalFee] = useState("0"); 
    const [checkMax, setCheckMax] = useState<boolean>(false); 
    const [visibleToken, setVisibleToken] = useState<boolean>(false); 
    const [tokenId721, setTokenId721] = useState<string>("");
    const [tokenId1155, setTokenId1155] = useState([]);
    const [amountTo1155, setAmountTo1155] = useState([]); 
    const [disabled, setDisabled] = useState(true);

    const getGas = async (gasLimit: number) => {  
      const feeData = await web3.eth.getBlock('latest');
      const baseFeePerGas = feeData.baseFeePerGas; 
    
      const maxPriorityFeePerGas = 1500000000;
      const maxGas = baseFeePerGas + speedUp * maxPriorityFeePerGas; 
      const  GasFee = web3.utils.fromWei((maxGas * gasLimit).toString(), "ether"); 
      setEstimateGas(GasFee.slice(0,10)); 
    };

    const getGasLimit = async ()=>{
      let data;
      if (type === "ERC721") {
      data = await contract.methods.transferFrom(
          address,
          addressSend,
          Number(tokenId721)
      );
      } else if (type === "ERC1155") { 
        if (tokenId1155.length == 1) {
          data = await contract.methods.safeTransferFrom(
          address,
          addressSend,
          Number(tokenId1155[0]),
          Number(amountTo1155[0]),
          "0x"
          );
        } else {
          const amount: any = [];
          amountTo1155.forEach((item) => {
          amount.push(Number(item));
          });
          data = await contract.methods.safeBatchTransferFrom(
          address,
          addressSend,
          tokenId1155,
          amount,
          "0x"
          );
        }
      } 
      const gasLimit = await web3.eth.estimateGas({
        from: address,
        to: addressToken,
        data: data.encodeABI(),
      });
      return {data: data.encodeABI(), gasLimit};
    }
  
    const txParam = async () => {  
        const nonce = await web3.eth.getTransactionCount(address); 
        const chainId = await web3.eth.getChainId();
        const feeData = await web3.eth.getBlock('latest'); 
        const baseFeePerGas =  feeData.baseFeePerGas;
        const maxPriorityFeePerGas = 1500000000;
        const priorityFeePerGas = speedUp * maxPriorityFeePerGas;
        const maxGas = baseFeePerGas + priorityFeePerGas; 
         
        const {data, gasLimit} = await getGasLimit();

        const _tx: {
            chainID: string,
            nonce: string,
            maxPriorityFeePerGas: string,
            maxFeePerGas: string,
            gasLimit: string,
            to: string,
            value: string,
            data: string,
            accessList: [],
            v: string,
            r: string,
            s: string
        } = {
          chainID:format.formatFieldTx(`0x${chainId.toString(16)}`),
          nonce:format.formatFieldTx(`0x${nonce.toString(16)}`),
          maxPriorityFeePerGas:`0x${priorityFeePerGas.toString(16)}`,
          maxFeePerGas:`0x${maxGas.toString(16)}`,
          gasLimit:`0x${gasLimit.toString(16)}`,
          to:addressToken,
          value:"0x",
          data:data,
          accessList: [],
          v: "0x",
          r: "0x",
          s: "0x",
        };
    
        setTx(_tx); 
    
        const {result, message, decode_to, msgHash} = await window.Main.handleTxParam({ tx: _tx });
        if(result){ 
          setDecodeTo(decode_to);
          setMsgHash(msgHash);
          setComfirmDecodeTo(true);
        }else openNotification(message, "warning"); 
      };

      const handleItemClick = (index: number) => {
        setActiveItem(index);
        console.log("speed", index);
        if(index==0) setSpeedUp(0.05)
        else if(index==1) setSpeedUp(0.5)
        else if(index==2) setSpeedUp(0.95)
      };

      useEffect(()=>{
        if(tokenId721.length | amountTo1155.length){
          setDisabled(false);
          getGasLimit().then(async ({gasLimit})=>{ 
            await getGas(gasLimit)
          })
        }else {
          setDisabled(true);
          getGas(21000)
        }
      }, [amountTo1155, tokenId721, speedUp])
      
    return (
        <>
        <div className="send--token--content">
          <h2 className="text--title">Transaction Information</h2>
          <div className="content--detail">
            <div className="displayFlex">
              <p className="text--bold">From</p>
              <div className="flex-line">
                <p>{name}</p>
                <p>{`${address.slice(0, 6)}...${address.slice(-4)}`}</p>
              </div>
            </div>
            <div className="displayFlex">
              <p className="text--bold">Balance</p> 
            </div>
            <div className="displayFlex"> 
                <div>
                  <p className="text--bold" style={{ marginBottom: "10px" }}>
                    TokenID
                  </p> 
                  <p className="text--bold">
                    Amount 
                  </p> 
                </div>
              {tokenId721.length | tokenId1155.length ? (
                <div>
                  {
                    type == "ERC721" ? (
                      <span>
                        <p style={{ marginTop: "10px" }}>{tokenId721}</p>
                        <p style={{ marginTop: "10px" }}>1</p>
                      </span>
                    ) :
                    <>
                     <p style={{ marginTop: "10px" }}>{tokenId1155.join(', ')}</p>
                     <p style={{ marginTop: "10px" }}>{amountTo1155.join(', ')}</p>
                    </>
                  }
                  <Button
                    style={{ marginTop: "10px" }}
                    type="default"
                    size="small"
                    onClick={() => setVisibleToken(true)}
                  >
                    Choose again
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    type="default"
                    size="large"
                    onClick={() => setVisibleToken(true)}
                  >
                    Click to choose
                  </Button>
                </div>
              )} 
            </div> 
              <p className="text--bold" style={{ fontSize: "14px" }}>
                Transaction Speed
              </p>
              <div className="flex-center">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`item ${index === activeItem ? 'text--active' : ''}`}
                  onClick={() => handleItemClick(index)}
                >
                  <p>{item}</p>
                  {index === activeItem && (
                    <span>{`Likely ${index === 0 ? '30' : index === 1 ? '15' : '10'} seconds`}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex-end">
              <div className="col">
                <p>Gas Estimation:</p>
                {/* <p>Total:</p> */}
              </div>
              <div className="col">
                <p>{estimateGas} ETH</p>

                {/* <p>{totalFee} ETH</p> */}
              </div>
            </div>
            <div className="button--group">
              <Button
                // type="default"
                className="btn btn--blue--cancel"
                onClick={() => {
                  setOpenView(false);
                  form.resetFields(); 
                }}
              >
                Back
              </Button>
              <Button
                type="primary"
                className="btn btn--blue" 
                onClick={() => {
                  txParam();
                }}
                disabled={disabled}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div> 
        {visibleToken && (
            <ModalSelectTokenID
              visible={visibleToken}
              setVisible={setVisibleToken}
              setTokenId721={setTokenId721}
              setTokenId1155={setTokenId1155}
              infoNFT={infoNFT}
              setAmountTo1155={setAmountTo1155}
              type={type}
            />
        )}
    </>
    )
}

export  default TxERC721_1155;