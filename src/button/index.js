import { Menu, Dropdown, message } from "antd";
import React from 'react'
import getLodop from "../utils/lodop";

const PrinterButton = () => {
    const [selectedKeys, setSelectedKeys] = React.useState([]);
    const [printerList,setList] = React.useState([]);

    const lodop = React.useRef({});
    React.useEffect(()=>{
        lodop.current = getLodop();
        const count = lodop.current.GET_PRINTER_COUNT();
        const printerList = new Array(count).fill(null).map((_,index)=>{
            return {name:lodop.GET_PRINTER_NAME(index),key:lodop.GET_PRINTER_NAME(index+":DriverName")}
        });
        setList(printerList);
    },[])


    function handleMenuClick(e) {
        setSelectedKeys([e.key]);
    }

    const menu = (selectedKeys) => (
        <Menu selectedKeys={selectedKeys} onClick={handleMenuClick}>
            {
                printerList.map(({name,key}) => {
                   return <Menu.Item key={key}>                
                        {name}
                    </Menu.Item>
                })
            }      
        </Menu>
    );

    return (
        <div>
            <Dropdown.Button
                placement="topCenter"
                onClick={() => message.success("直接打印")}
                overlay={menu(selectedKeys)}>
                打印
            </Dropdown.Button>
        </div>
    );
};

export default PrinterButton;