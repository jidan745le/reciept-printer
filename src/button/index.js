import { Menu, Dropdown, message } from "antd";
import React from 'react'
const PrinterButton = () => {
    const [selectedKeys, setSelectedKeys] = React.useState([]);

    function handleMenuClick(e) {
        setSelectedKeys([e.key]);
    }

    const menu = (selectedKeys) => (
        <Menu selectedKeys={selectedKeys} onClick={handleMenuClick}>
            <Menu.Item key="1">                
                打印机1
            </Menu.Item>
            <Menu.Item key="2">                
                打印机2
            </Menu.Item>
            <Menu.Item key="3">               
                打印机3
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
            <Dropdown.Button
                onClick={() => message.success("直接打印")}
                overlay={menu(selectedKeys)}>
                打印
            </Dropdown.Button>
        </div>
    );
};

export default PrinterButton;