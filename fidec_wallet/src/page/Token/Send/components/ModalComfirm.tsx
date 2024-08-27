import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Web3 from "web3";
import * as RLP from "@ethereumjs/rlp";
import { Buffer } from "buffer"; 
import { Button, Form, Input, Modal } from "antd";
import { openNotification } from "../../../../utils/helperUtil";
import { RootState } from "../../../../store/store"; 
  
const TRANSACTION_TYPE_2 = 2;
const TRANSACTION_TYPE_2_BUFFER = Buffer.from(
  TRANSACTION_TYPE_2.toString(16).padStart(2, "0"),
  "hex"
);


type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;
 
interface Props {
    decodeTo: string;
    confirmDecodeTo: boolean;
    setComfirmDecodeTo: SetStateFunction<boolean>;
    setOpenView: SetStateFunction<boolean>; 
    tx: {
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
    };
    msgHash: string;
    type_send: string;

}

const ModalComfirm = ({
       decodeTo, 
       confirmDecodeTo, 
       setComfirmDecodeTo,
       setOpenView,
       tx,
       msgHash,
       type_send
    }: Props)=>{

    const [form] = Form.useForm(); 
    const navigate = useNavigate();
    const [visible, setVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const networksState = useSelector((state: RootState) => state.networks);
    const accountsState = useSelector((state: RootState) => state.accounts);
    const { eip155Address, eip155Addresses } = accountsState;
    const { address, name, indexAccount } = eip155Address;
    const { network } = networksState;
    const { url } = network;
  
    const web3 = new Web3(url);
  

    const sendTransaction = async (pin: string) => { 
        await window.Main.handleSignTransaction({
          msgHash,
          pin,
          index: indexAccount,
        }).then(async (result) => {
          const { sign, v, r, s } = result;
          const txParamSigned = {
            chainID: tx?.chainID,
            nonce: tx?.nonce,
            maxPriorityFeePerGas: tx?.maxPriorityFeePerGas,
            maxFeePerGas: tx?.maxFeePerGas,
            gasLimit: tx?.gasLimit,
            to: tx?.to,
            value: tx?.value,
            data: tx?.data,
            accessList: tx?.accessList,
            v,
            r,
            s,
          };

          const rawTransaction = Buffer.concat([
            TRANSACTION_TYPE_2_BUFFER,
            Buffer.from(RLP.encode(Object.values(txParamSigned))),
          ]);
    
          setIsLoading(false);
          setVisible(false);
          setOpenView(false);
          if(type_send==="NFT"){
            navigate("/nft");
          }else navigate("/");
          openNotification("Sending...", "");
          try {
            const receipt = await web3.eth.sendSignedTransaction(
              `0x${rawTransaction.toString("hex")}`
            );
            const hashTx = receipt.transactionHash;
            window.Main.handleSaveHistoryTransaction({
              id_card: 1,
              txHash: hashTx,
            });
            console.log(hashTx)
            openNotification("Successed", "success"); 
          } catch (err) { 
            console.log(err);
            openNotification("Failed", "error");
          }
        });
      };
    

    return (
      <> 
        <Modal
          style={{top: "40%", minWidth:"320px"}}
          title='Enter your PIN'
          open={visible}
          onCancel={() => setVisible(false)}
          footer={[
              <Button type='default' style={{marginRight: '12px'}} onClick={() => {
                  setIsLoading(false);
                  setVisible(false);
              }}>Cancel</Button>, 
              <Button type='primary' htmlType="submit" onClick={async ()=> {
                const pin = form.getFieldValue('pincode');
                const {result} = await window.Main.handleLogin(pin);
                if(result){ 
                  sendTransaction(pin);
                }else openNotification("Sai mã pin", "error");
                form.resetFields();
              }}>Confirm</Button>
          ]}
          maskClosable={false} 
        > 
          <Form form={form}>
            <Form.Item name="pincode">
              <Input.Password />
            </Form.Item> 
          </Form> 
        </Modal>

        {/* comfirm decode to  */}
        <Modal
          style={{top: "40%",  minWidth:"320px"}}
          title='Comfirm your sent-to address'
          open={confirmDecodeTo} 
          onCancel={() => setVisible(false)}
          footer={[
              <Button type='default' style={{marginRight: '12px'}} onClick={() => {
                  setComfirmDecodeTo(false);
              }}>Cancel</Button>, 
              <Button type='primary' onClick={() => {
                  setComfirmDecodeTo(false);
                  setVisible(true);
              }}>Confirm</Button>
          ]}
          maskClosable={false}
        > 
            <h3 style={{color: 'white'}}>0x{decodeTo}</h3> 
        </Modal> 
      </>
    )
}

export default ModalComfirm;