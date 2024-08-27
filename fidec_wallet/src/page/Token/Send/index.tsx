import { useState} from "react";
import BackToHomeText from "../../../components/Footers/Back";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain"; 
import Navbar from "../../../components/Navbar";  
import AddressesSend from "./components/AddressesSend";
import InputSearch from "./components/InputSearch"; 
import TxERC20 from "./components/TxERC20";
import TxERC721_1155 from "./components/TxERC721_1155";
import ModalComfirm from "./components/ModalComfirm";
import "./styles.scss";

const items = ["Slow", "Moderate", "Fast"];
 
interface Props {
  type_send: string;
}
 
const Send = ({type_send}: Props) => {  
  const [errorCheckAddress, setErrorCheckAddress] = useState<string>("");
  const [openView, setOpenView] = useState<boolean>(false); 
  const [addressSend, setAddressSend] = useState<string>("");  
  const [confirmDecodeTo, setComfirmDecodeTo] = useState<boolean>(false);
  const [msgHash, setMsgHash] = useState<string>("");
  const [decodeTo, setDecodeTo] = useState<string>("");
  const [speedUp, setSpeedUp] = useState(0.5);
  const [activeItem, setActiveItem] = useState(1);
  const [tx, setTx] = useState<{
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
  }>();
 
  return (
    <div className="send--token--page">
      <HeaderMain />
      <h2 className="text--title">Send {type_send}</h2>
      <InputSearch 
        address={addressSend}
        setAddress={setAddressSend}  
        errorCheckAddress={errorCheckAddress}
        setOpenView={setOpenView}
        setErrorCheckAddress={setErrorCheckAddress}
      /> 
      {
        openView ? 
         ( type_send === "NFT" ?
         <TxERC721_1155
            addressSend={addressSend}
            setOpenView={setOpenView}
            setDecodeTo={setDecodeTo}
            setComfirmDecodeTo={setComfirmDecodeTo}
            setMsgHash={setMsgHash}
            setTx={setTx}
            type_send={type_send}
            items={items}
            speedUp={speedUp}
            setSpeedUp={setSpeedUp}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
         />
         :
         <TxERC20
           addressSend={addressSend}
           setOpenView={setOpenView}
           setDecodeTo={setDecodeTo}
           setComfirmDecodeTo={setComfirmDecodeTo}
           setMsgHash={setMsgHash}
           setTx={setTx}
           type_send={type_send}
           items={items}
           speedUp={speedUp}
           setSpeedUp={setSpeedUp}
           activeItem={activeItem}
           setActiveItem={setActiveItem}
         /> 
         ) 
        :
        <AddressesSend
          addressSend={addressSend}
          setAddressSend={setAddressSend}   
        />
      }
      <ModalComfirm
        decodeTo={decodeTo}
        msgHash={msgHash}
        confirmDecodeTo={confirmDecodeTo}
        setComfirmDecodeTo={setComfirmDecodeTo}
        setOpenView={setOpenView}
        tx={tx}
        type_send={type_send}
      />
      <BackToHomeText />
      <Navbar /> 
    </div>
  );
};

export default Send;
