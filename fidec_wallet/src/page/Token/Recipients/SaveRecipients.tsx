import "./styles.scss";
import { Button, Form, Input } from "antd";
import { useState } from "react";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux"; 
import { openNotification } from "../../../utils/helperUtil"
import type { RootState } from "../../../store/store";  
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../../components/Navbar";
import BackToHomeText from "../../../components/Footers/Back";

const SaveRecipientsPage = () => {
  const [form] = Form.useForm();

  const [notifiCheckAddress, setNotifiCheckAddress] = useState<string>("")
  const [notifiCheckName, setNotifiCheckName] = useState<string>("")

  const networksState: any = useSelector((state: RootState)=> state.networks);  
  const { network } = networksState;  
  const {url} : any = network;
  const web3 = new Web3(url);
 

  const onFinish = async (values: any) => {
    const checkAddress =  web3.utils.isAddress(values.address);
    if(checkAddress){
      if(values.name){
        console.log(values.name);
        console.log(values.address);
        const {result, message} = await window.Main.handleSaveReceive({name: values.name, address: values.address}); 
        if(result){
          window.history.back()
        }
        openNotification(message, result ? "success" : "warning");
        form.resetFields();
      }else {
        setNotifiCheckName("Please fill the above field");
        form.resetFields();
      }
    } else {
      setNotifiCheckAddress("Not Correct EVM address");
      form.resetFields();
    }

  }

  return (
    <div className="recipients--page">
      <HeaderMain />
      <h2 className="text--title">Save new recipient</h2>
      <div className="input--address">
        <Form form={form} className="form" onFinish={onFinish}>
          <Form.Item
            name="address"
            label={<p className="title">Recipients Address</p>}
            style={{ marginBottom: "20px" }}
          >
            <Input placeholder="Public Address, saved account" />
          </Form.Item>
          <p className="text--response">{notifiCheckAddress}</p>

          <Form.Item
            name="name"
            label={<p className="title">Recipients Nick Name</p>}
          >
            <Input placeholder="This field cannot be empty" />
          </Form.Item>
          <p className="text--response">{notifiCheckName}</p>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="button">
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </div>

      <BackToHomeText/>
      <Navbar />
    </div>
  );
};

export default SaveRecipientsPage;
