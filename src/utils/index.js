const basicTemplate = name => `<div class="reciept-wrapper">
<% 
    ${name}.forEach( function (item) { %>
        <div class="outer">
            <%if(!Array.isArray(item[0])){%>
                <%= item[0] %>:<%= item[1] %>
            <%}else{item.forEach(function(element){%>
               <div class="inner"> <%= element[0] %>:<%= element[1] %></div>
            <% })}%>
        </div>
    <% });
%>
</div>`


//<div class="inner<%if(i===1){%>3<%}else if(i===4){%>2<%}%>"><%= element %></div>

const itemsTemplate = name => ` <div class="reciept-wrapper">
<div class="table-header">
    <div class="table-outer">
      <% ${name}.headers.forEach( function (item,i) { %>            
           <div class="inner<%if(!i){%><%}%>"> <%= item %></div>
        <% })%>    
      </div>
</div>
<div class="low-height"><br/><br/></div>
<div class="table-content">
    <% ${name}.items.forEach(function(item){ %>   
        <div style="word-break:break-all"><%=item[0]%></div>     
        <div class="table-outer">        
        <% item.forEach(function(element,i,arr){if(!!i){%>
            <%if(i===1){%><%=element%><%}else{if(arr[1].length<14){%>&nbsp;<%=element%><%}else{%><%=element%><%}}}})%>
           
       </div>       
       <div class="low-height"><br/></div>
    <% })  %>
</div>
</div>`

const betweenItemsTemplate = name => ` <div class="reciept-wrapper">

<div class="table-content">
    <% ${name}.forEach(function(item){ %>        
        <div class="table-outer-between">
        <% item.forEach(function(element,i){%>
            <div><%= element %></div>
        <%}) %>        
       </div>       
       <div class="low-height"><br/></div>
    <% })  %>
</div>
</div>`


//拼装模板
const combineTemplate = arr => {
    const concatStr = (str,count) => new Array(count).fill(str).join("");
    const typeToTemplatesMapping = type => {
        // basic:basicTemplate,
        // basic2:basicTemplate,//一行两列，只是数据结构不一样
        // items:itemsTemplate,
        // betweenItems:betweenItemsTemplate,
        // br:() => `<div class="low-height"><br/><br/></div>`,
        // line:() => `<div class="low-height"><div class="line"></div></div>`,
        // doubleLine:()=> `<div class="low-height"><div class="line"></div><br/><div class="line"></div></div>`,
        // title:title =>`<div class="title"><%=${title?title:"title"}%></div>`,
        // text:name =>`<div><%=${name}%></div>`
        if(/^layout\d?$/.test(type)){
            return basicTemplate;
        }

        if(/^items$/.test(type)){
            return itemsTemplate;
        }

        if(/^betweenItems$/.test(type)){
            return betweenItemsTemplate;
        }

        if(/^br(\d?)$/.test(type)){
            let [_,count] = type.match(/^br(\d?)$/);
            count = count || 1;

            return ()=>{
                return `<div class="low-height">${concatStr("<br/><br/>",Number(count))}</div>`
            };
        }

        
        if(/^line(\d?)$/.test(type)){
            let [_,count] = type.match(/^line(\d?)$/);
            count = count || 1;
            return ()=>{
                if(count === 1){
                    return `<div class="low-height"><div class="line"></div></div>`
                }
                return `<div class="low-height"><div class="line"></div>${concatStr(`<br/><div class="line"></div>`,count-1)}</div>`
            };
        }

        if(/^title$/.test(type)){
            return title =>`<div class="title"><%=${title}%></div>`
        }

        if(/^text$/.test(type)){
            return name =>`<div><%=${name}%></div>`
        }

        if(/^img$/.test(type)){
            return src =>`<img src="<%=${src}%>" />`
        }

        if(/^imgright$/.test(type)){
            return src =>`<div style="text-align:right"><img style="width:25mm" src="<%=${src}%>" /><div style="text-align:right;margin-right:8mm;font-size:2mm;position:relative;top:-2mm">订单号</div></div>`
        }

        if(/^orderidqrcode$/){
            return src =>`<div style="text-align:right"><img style="width:25mm" src="<%=${src}%>" /><div style="text-align:right;margin-right:8mm;transform:scale(0.8);position:relative;top:-2mm">订单号</div></div>`
        }
    }

    return arr.map(({type,name}) => {
        return typeToTemplatesMapping(type)(name || "")
    }).join("")
}

export default combineTemplate;