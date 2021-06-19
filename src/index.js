const styleContent = require("./utils/template-style");
const combineTemplate = require("./utils/index");
const compile = require("./utils/compiler");
const { chunk, template } = require("lodash");
function adjustSequence(entries, series) {
    //组织顺序
    const mapping = new Map();
    entries.forEach(item => {
        mapping.set(item[0], item)
    })
    //     console.log(mapping)
    return series.map(item => mapping.get(item))

}
//temp 是组装后的temp data是处理后的data
//data的结构
//basic是[[],[[],[]]]这样的结构
//items是{items:[[],[]],headers:[...]}这样的结构
//所以要写一个转置层，处理后台给到的数据
function processData(temp, data) {
    const ret = {};
    temp.filter(({ name }) => name).forEach(item => {
        //三种类型，三种处理方式(数据结构)
        if (item.type === "layout") {
            ret[item.name] = Object.entries(data[item.name] || {});
        } else if (item.type === "layout2") {
            ret[item.name] = chunk(Object.entries(data[item.name]), 2)
        } else if (item.type === "items") {
            const values = data[item.name];
            const { items, sequence, headers } = values;
            let itemsEntries = items.map(item => Object.entries(item));
            itemsEntries = itemsEntries
                .map(item => adjustSequence(item, sequence)
                    .map(([_, item]) => item))
            ret[item.name] = { items: itemsEntries, headers }
        }else if(item.type === "betweenItems"){
            let itemsEntries = data[item.name].map(item => Object.values(item));
            ret[item.name] = itemsEntries;
        } else if (item.type === "title") {
            ret[item.name] = data[item.name];
        } else if(item.type === "text"){
            ret[item.name] = data[item.name];
        }
    })
    return ret;
}

function printReciept(template$, data$) {
    const temp$ = compile(template$);
    const temp = combineTemplate(temp$);
    const data = processData(temp$, data$)

    const printIframe = document.createElement("iframe");
    const meta = document.createElement("meta");
    meta.setAttribute("http-equiv","Content-Type");
    meta.setAttribute("content","text/html; charset=utf-8");
   
    //设置打印样式
    const printStyle = document.createElement("style");
    printStyle.type = 'text/css';
    printStyle.innerHTML = styleContent;
    
    //设置iframe样式
    printIframe.width = "0";
    printIframe.height = "0";
    printIframe.style.display = "none";
    if(navigator.userAgent.indexOf("Firefox") > -1){
        //firefox兼容性
        printIframe.src="javascript";
    }
    document.body.append(printIframe);
    //置样式
    printIframe.contentWindow.document.getElementsByTagName("head").item(0).append(meta)
    printIframe.contentWindow.document.getElementsByTagName("head").item(0).append(printStyle)

     printIframe.contentWindow.document.body.innerHTML = template(temp)(data);
     printIframe.contentWindow.print()
     setTimeout(() => { document.body.removeChild(printIframe) }, 100)
}


module.exports = printReciept;