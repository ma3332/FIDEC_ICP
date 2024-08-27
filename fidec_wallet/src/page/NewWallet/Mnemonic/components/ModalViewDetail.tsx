import { type FormInstance, Modal, Row, Col } from "antd";
import "../styles.scss";

const ModalViewDetail = (props: {
  visible: boolean;
  setVisible: any;
  form: FormInstance<any>;
}) => {
  const { visible, setVisible, form } = props;

  return (
    <Modal
      title={"View Detail"}
      open={visible}
      onCancel={() => setVisible(false)}
    >
      <Row gutter={[12, 6]}>
        {Object.keys(form.getFieldsValue())?.map((item, index) => {
          return (
            <Col xs={8} md={8}>
              <p style={{ color: "white" }}>{index}</p>
            </Col>
          );
        })}
      </Row>
    </Modal>
  );
};

export default ModalViewDetail;
