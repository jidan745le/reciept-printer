import { Menu, Dropdown, message } from "antd";
import React from 'react'
import getLodop from "../utils/lodop";

function getLodopAsync(retryLimit = 10,retryInterval = 150){
    return new Promise((res,rej)=>{
        let time = 0;
        const getIt = (resolve,reject) =>{
            if(time > retryLimit){
                reject({code:500,message:"timeout"})
                return;
            }
            const lodop = getLodop()
            if(!lodop){
                time++;
                setTimeout(() =>getIt(resolve,reject),retryInterval);
            }else{
                resolve({code:200,data:lodop})
                return;
            }           
        }
        getIt(res,rej)
    })
}

const PrinterButton = () => {
    const [selectedKeys, setSelectedKeys] = React.useState([]);
    const [printerList,setList] = React.useState([]);

    const lodop = React.useRef({});
    React.useEffect(()=>{
        getLodopAsync().then(res=> {
            lodop.current = res.data;
            const count = lodop.current.GET_PRINTER_COUNT();
            const printerList = new Array(count).fill(null).map((_,index)=>{
                return {name:lodop.current.GET_PRINTER_NAME(index),key:lodop.current.GET_PRINTER_NAME(index+":DriverName")}
            });
            setList(printerList);
        }).catch(e =>{
            alert(e.message)
        })     
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