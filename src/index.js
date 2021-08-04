import styleContent from "./utils/template-style";
import combineTemplate from "./utils/index";
import compile from "./utils/compiler";
import template from "lodash/template";
import chunk from "lodash/chunk";

import getLodop from "./utils/lodop";
import qrcode from "qrcode";

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
const processData = async (temp, data) => {
    const ret = {};
    const items = temp.filter(({ name }) => name);
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
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
        } else if (item.type === "betweenItems") {
            let itemsEntries = data[item.name].map(item => Object.values(item));
            ret[item.name] = itemsEntries;
        } else if (item.type === "title") {
            ret[item.name] = data[item.name];
        } else if (item.type === "text") {
            ret[item.name] = data[item.name];
        } else if (item.type === "img") {
            ret[item.name] = data[item.name];
        } else if (item.type === "imgright") {
            ret[item.name] = data[item.name];
        } else if (item.type = "orderidqrcode") {
            console.log(data[item.name],item.name)
            ret[item.name] = await qrcode.toDataURL(data[item.name])
        }
    }

    return ret;
}

async function printReciept(template$, data$, lodopOptions) {
    const { printerIndex = 0, printMode = "PREVIEW", liscences } = typeof lodopOptions === "number" ? { printerIndex: lodopOptions, printMode: "PRINT" } : (lodopOptions || {});

    const temp$ = compile(template$);
    const temp = combineTemplate(temp$);
    const data = await processData(temp$, data$)

    const printIframe = document.createElement("iframe");
    const meta = document.createElement("meta");
    meta.setAttribute("http-equiv", "Content-Type");
    meta.setAttribute("content", "text/html; charset=utf-8");

    //设置iframe样式
    printIframe.width = "0";
    printIframe.height = "0";
    printIframe.style.display = "none";
    if (navigator.userAgent.indexOf("Firefox") > -1) {
        //firefox兼容性
        printIframe.src = "javascript";
    }
    document.body.append(printIframe);
    //置样式
    printIframe.contentWindow.document.getElementsByTagName("head").item(0).append(meta)
    // printIframe.contentWindow.document.getElementsByTagName("head").item(0).append(printStyle)

    //设置打印样式
    const printStyle = document.createElement("style");
    printStyle.type = 'text/css';
    const LODOP = getLodop(undefined,undefined,liscences);
    if (LODOP) {
        printStyle.innerHTML = styleContent(true);
        printIframe.contentWindow.document.body.append(printStyle);
        printIframe.contentWindow.document.body.innerHTML += template(temp)(data);
        LODOP.PRINT_INIT("");
        LODOP.ADD_PRINT_HTM(0, 0, "100%", "100%", printIframe.contentWindow.document.body.innerHTML);
        LODOP.SET_PRINTER_INDEX(printerIndex);
        LODOP[printMode]();          
    } else {
        printStyle.innerHTML = styleContent();
        console.log(styleContent());
        printIframe.contentWindow.document.body.append(printStyle);
        printIframe.contentWindow.document.body.innerHTML += template(temp)(data);
        const img = printIframe.contentWindow.document.body.querySelector("img");
        if (img) {
            img.onload = () => {
                printIframe.contentWindow.print()
            }
        } else {
            printIframe.contentWindow.print()
        }
    }
    setTimeout(() => { document.body.removeChild(printIframe) }, 100)
}


export default printReciept ;