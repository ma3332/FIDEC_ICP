import { Button, Form, Input } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { openNotification } from "../../../../utils/helperUtil"; 
import format from "../../../../utils/format";
import ABIJsonERC20 from "../../../../data/abiJsonToken/abiERC20.json";

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


const TxERC20 = ({
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
    const { addressERC20 } = tokensState;
    const { addressToken, symbolToken } = addressERC20;  
    const { eip155Address } = accountsState;
    const { address, name } = eip155Address;
    const { network } = networksState;
    const { url } = network;
    const web3 = new Web3(url);
    const abi: any = ABIJsonERC20.abi;  

    const contract = new web3.eth.Contract(abi, addressToken, {
      from: address,
    });
  

    const [form] = Form.useForm();  
    const [estimateGas, setEstimateGas] = useState("0");
    const [totalFee, setTotalFee] = useState("0"); 
    const [checkMax, setCheckMax] = useState<boolean>(false);
    const [balance, setBalance] = useState("0");
    const [messageCheckAmount, setMessageCheckAmount] = useState("");
    const [disable, setDisable] = useState(true); 
 
    const handleItemClick = (index: number) => {
      setActiveItem(index);
      console.log("speed", index);
      if(index==0) setSpeedUp(0.05)
      else if(index==1) setSpeedUp(0.5)
      else if(index==2) setSpeedUp(0.95)
    };

    const getGas = async (gasLimit: number) => {  
      const feeData = await web3.eth.getBlock('latest');
      console.log(feeData);
      const baseFeePerGas = feeData.gasUsed; 
    
      const maxPriorityFeePerGas = 150000000;
      const maxGas = baseFeePerGas + speedUp * maxPriorityFeePerGas; 
      const  GasFee = web3.utils.fromWei((maxGas * gasLimit).toString(), "ether"); 
      setEstimateGas(GasFee.slice(0,10));
    };
    
      
    const getBalance = async () => {
      if(type_send === "ETH"){
        const balance = await web3.eth.getBalance(address);
        setBalance((Number(balance) / 1e18).toString()); 
      }else if(type_send === "Token"){
        const balance = await contract.methods.balanceOf(address).call(); 
        setBalance(balance); 
      }
    };

    const setMaxAmount = async () => {
        const addressTo = addressSend;
        const gasLimit = await web3.eth.estimateGas({ to: addressTo, data: "0x" });
        const feeData = await web3.eth.getBlock('latest');
        const baseFeePerGas =  feeData.baseFeePerGas
        const maxPriorityFeePerGas = 150000000;
        const maxGas = baseFeePerGas + maxPriorityFeePerGas;
        let maxAmount
        if(type_send==="ETH"){
          maxAmount = parseFloat(balance) -
          (parseFloat(maxGas.toString()) * gasLimit) / 10 ** 18;
        console.log("max amount 1", maxAmount);
        }else if(type_send==="Token"){
          maxAmount = balance;
        }
        form.setFieldsValue({
          amount: maxAmount.toString().slice(0, 10),
        });
        setDisable(false);
    };

    const getGasLimit = async (amount: number)=>{
      let data="0x";
      let gasLimit;
      let to;
      if(type_send==="ETH"){
        to = addressSend;
        gasLimit = 21000;
      }else if(type_send==="Token"){
        to = addressToken;
        const _data = await contract.methods.transfer(addressSend, amount);
        data = _data.encodeABI()
        gasLimit = await web3.eth.estimateGas({
          from: address,
          to,
          data,
        }); 
      }
      return { data, to, gasLimit };
    }
  
    const txParam = async () => {  
        const nonce = await web3.eth.getTransactionCount(address); 
        const chainId = await web3.eth.getChainId();
        const feeData = await web3.eth.getBlock('latest'); 
        const baseFeePerGas =  feeData.gasUsed;
        const maxPriorityFeePerGas = 10000000;
        const priorityFeePerGas = speedUp * maxPriorityFeePerGas;
        const maxGas = baseFeePerGas + priorityFeePerGas; 
        let value; 
        
        let amount;
        if (checkMax) {
          if(type_send==="ETH"){
            const maxAmount =
              parseFloat(balance) - (parseFloat(maxGas.toString()) * 21000) / 1e18;
            value = Number(maxAmount) * 10 ** 18; 
          }else if(type_send==="Token"){
            value = balance; 
          }
        } else {
          if(type_send==="ETH"){
            const amount = form.getFieldValue("amount")
            ? form.getFieldValue("amount")
            : 0;
            value = Number(amount) * 10 ** 18;
          }else if(type_send==="Token"){
            amount = form.getFieldValue("amount")
            ? form.getFieldValue("amount")
            : 0;
          value = 0;
          }
        }

        const {data, to, gasLimit} = await getGasLimit(amount);
       
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
          to:to,
          value: type_send==="Token" ? "0x" : web3.utils.numberToHex(value),
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
     
    useEffect(()=>{
      getBalance()
    },[])

    useEffect(()=>{
      if(type_send === "ETH"){ 
        getGas(21000)
      }else if(type_send === "Token"){ 
        getGasLimit(1).then(({gasLimit})=>{
          getGas(gasLimit)
        })
      }
    }, [speedUp, form.getFieldValue("amount"), ])

    return (
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
              <div>
                <p>{type_send === "ETH" ? 
                    `${balance.slice(0, 10)} ETH`
                    : 
                    `${balance} ${symbolToken}`}
                </p>
              </div>
            </div>
            <div className="displayFlex">
              <div>
                <p className="text--bold">
                  Amount{" "}
                  <button
                    className="tag"
                    onClick={() => {
                      setMaxAmount();
                      setCheckMax(true);
                    }}
                  >
                    Max
                  </button>
                </p>
              </div>
              <Form form={form}>
                <Form.Item name="amount">
                  <Input
                    placeholder="Amount"
                    onChange={(e) => {
                      if (Number(e.target.value) >= Number(balance)) {
                        setDisable(true);
                        setMessageCheckAmount("Insufficient funds for gas");
                      } else if (e.target.value && Number(e.target.value) > 0) {
                        setDisable(false);
                        setMessageCheckAmount("");
                      } else {
                        setMessageCheckAmount("");
                        setDisable(true);
                      }
                    }}
                  />
                </Form.Item>
                <h5 style={{ color: "red" }}>{messageCheckAmount}</h5>
              </Form>
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
                <p>Total:</p>
              </div>
              <div className="col">
                <p>{estimateGas} ETH</p>

                <p>{totalFee} ETH</p>
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
                disabled={disable}
                onClick={() => {
                  txParam();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div> 
    )
}

export  default TxERC20;