import { truncate } from '../../../../utils/helperUtil';
import { Card, Avatar, Typography, Button, Tooltip } from 'antd';
import { LinkOutlined, DeleteOutlined} from '@ant-design/icons'; 

const { Text } = Typography;

/**
 * Types
 */
interface IProps {
    logo?: string
    name?: string
    url?: string
    onDelete: () => Promise<void>
}

/**
 * Component
 */
export default function SessionCard({ logo, name, url, onDelete }: IProps) {

    return (
        <Card
            bordered
            bodyStyle={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            padding: "18px",
            minHeight: '52px', 
            width: "324px", 
            height: "52px"
            }}
            style={{
            position: 'relative',
            marginBottom: '$6',
            }}
        >
            <Avatar src={logo} />
            <div style={{ flex: 1 }}>
            <Text strong style={{ marginLeft: 9 }}>
                {name}
            </Text> 
            </div>
            <Tooltip title="Delete" placement="left">
            <Button type="text" danger onClick={onDelete} style={{ minWidth: 'auto' }}>
                <DeleteOutlined />
            </Button>
            </Tooltip>
        </Card>
    )
  }