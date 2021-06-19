const style = `@media print {
    @page {
        margin: 0mm;
    }
}

.outer {
    display: flex;
    overflow: hidden;
    word-break: break-all;
    margin-right: 1rem;
}

.line {
    border-bottom: 1px dashed;
}

.low-height {
    line-height:1mm;
}

.table-outer {
    display: flex;
    overflow: hidden;
}

.table-outer-between {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
}

html {
    font-size: 3mm;
}

.reciept-wrapper {
    font-size:3mm;
}

body {
    margin:0mm;
    padding: 9mm;  
    font-family:SimHei;  
}

.inner {
    flex: 1;
    word-break:break-all;
}

.inner2 {
    flex:2;
    word-break:break-all;    
}

.inner4 {
    flex:4;
    word-break:break-all; 
    padding-right: 1rem;
}

.inner3 {
    flex:3;
    word-break:break-all;
    padding-right: 1rem;
}

.title {
    text-align:center;
    font-size: 3mm;
}
`
module.exports = style;