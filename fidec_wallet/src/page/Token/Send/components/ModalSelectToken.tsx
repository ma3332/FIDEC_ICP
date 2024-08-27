import {
  Button,
  Col,
  Form,
  Input, 
  Modal,
  Row,
  Select,
  Steps, 
} from "antd"; 
import { useState } from "react";
import { openNotification } from "../../../../utils/helperUtil";

type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

interface Props {
  visible: boolean;
  setVisible: SetStateFunction<boolean>;
  setTokenId721: SetStateFunction<string>;
  setTokenId1155: SetStateFunction<[]>;
  infoNFT: any;
  setAmountTo1155: SetStateFunction<[]>;
  type?: string;
}

const ModalSelectTokenID = ({ 
    visible, 
    setVisible, 
    setTokenId721, 
    setTokenId1155, 
    infoNFT, 
    setAmountTo1155, 
    type 
  }: Props) => { 
  const tokenInfo = infoNFT.tokenInfo;

  const [form] = Form.useForm();  
  const [disabled, setDisabled] = useState<boolean>(true);
  const [disabled1, setDisabled1] = useState<boolean>(true); 
  const [selected, setSelected] = useState<any>();
  const [currentStep, setCurrentStep] = useState<number>(0);

  
  if(type === "ERC721")  return (  
    <Modal 
      style={{top: "160px"}}
      open={visible}
      footer={[
        <Button type="default" key="1" onClick={() => setVisible(false)}>
          Close
        </Button>,
        <Button
          type="primary"
          key="2"
          onClick={() => {
            setTokenId721(form.getFieldValue("tokenId")); 
            setVisible(false);
          }}
          disabled={disabled}
        >
          Confirm
        </Button>,
      ]}
      onCancel={() => setVisible(false)}
      destroyOnClose
      title="Choose Token ID"
    > 
      <Form form={form}>
          <Form.Item name="tokenId"> 
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                options={tokenInfo?.map((tokenId: any, index: number) => ({
                  key: index,
                  value: tokenId,
                  label: tokenId,
                }))}
                onChange={value=>{
                  if(value){
                    setDisabled(false);
                  }else setDisabled(true);
                }}
              /> 
          </Form.Item> 
        </Form> 
    </Modal>
  ) 
  else if(type === "ERC1155") return(
    <Modal
      style={{top: "160px"}}
      open={visible}
      onCancel={() => setVisible(false)}
      destroyOnClose
      title={currentStep === 0 ? "Choose Token ID" : "CHOOSE AMOUNT"} 
      footer={[
        currentStep == 0 && 
        <Button type="default" key="1" onClick={() => {
          setVisible(false)
        }}>
          Close
        </Button>,
        currentStep == 0 && 
        <Button
          type="primary"
          key="2"
          disabled={disabled1}
          onClick={() => {
            setCurrentStep(1)
          }}
        >
          Next
        </Button>,
        currentStep == 1 && 
        <Button type="default" key="1" 
          onClick={() => {
          setCurrentStep(0)
        }}>
        Back
        </Button>,
        currentStep == 1 && 
        <Button
        type="primary"
        key="2" 
        onClick={() => {
          const amount: any = [];  
          form.getFieldValue("tokenId").forEach((item:any, index: number) => {
            if(form.getFieldValue(`amount${index}`)){
              amount.push(form.getFieldValue(`amount${index}`))
            }
          }) 
          if(form.getFieldValue("tokenId").length == amount.length) {
            setTokenId1155(form.getFieldValue("tokenId"));
            setAmountTo1155(amount);
            setVisible(false);

          }else openNotification("Try again", "error");

        }}
        >
          Confirm
        </Button>,
      ]} 
    >
      <Steps
        size="small"
        current={currentStep} 
        className="ant-steps-horizontal"
      >
        <Steps.Step title="Token ID" />
        <Steps.Step title="Amount" />
      </Steps>
      {
        currentStep == 0 ? (
          <Form form={form}>
            <Form.Item name="tokenId"> 
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  options={tokenInfo?.map((item: any, index: number) => ({
                    key: index,
                    value: item.tokenId,
                    label: item.tokenId,
                  }))}
                  onSelect={(value, option) => {
                    setSelected({ ...selected, value });
                  }}
                  maxTagCount={"responsive"}
                  onChange={e=>{ 
                    if(e.length > 0){
                      setDisabled1(false);
                    }else setDisabled1(true);
                  }}
                /> 
            </Form.Item> 
          </Form> 
        )
        :
        (
          <Form form={form}>
            {Object.values(form.getFieldValue("tokenId"))?.map((item: any, index: number) => {
              return (
                <Row gutter={[12, 12]}>
                  <Col xs={16} md={16}>
                    <p style={{ color: "white" }}>{`TokenID ${
                      item ?? ""
                    }`}</p>
                  </Col>

                  <Col xs={8} md={8}>
                    <Form.Item name={`amount${index}`}>
                      <Input 
                        min={1}
                        style={{ width: "100%" }}
                        placeholder="amount" 
                      />
                    </Form.Item> 
                  </Col>
                </Row>
              );
            })}
          </Form> 
          )
        }
      </Modal>
    ) 
};

export default ModalSelectTokenID;
