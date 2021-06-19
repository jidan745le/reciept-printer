//小票模板引擎
//tokenizer
const tokenizer = (str) => {
    let i = 0;
    const tokens = [];
    while (i < str.length) {
        if (str[i] === "<") {
            let tag = "<";
            let closeFlag = false;
            i++;
            if (str[i] === "/") {
                closeFlag = true;
            }
            tag += str[i];

            while (str[i] != ">" && /[\w\/\s]/.test(str[i]) && i < str.length) {
                i++;
                tag += str[i]
            }

            if (["<>", "</>"].includes(tag)) {
                throw TypeError("Expected tag to have content.");
            }

            if (closeFlag) {
                tokens.push({ type: "close", value: tag.match(/<\/(\w+)>/)[1], raw: tag })
            } else if (/<(\w+)\s*\/>/.test(tag)) {
                tokens.push({ type: "complete", value: tag.match(/<(\w+)\s*\/>/)[1], raw: tag })
            } else {
                tokens.push({ type: "open", value: tag.match(/<(\w+)>/)[1], raw: tag })
            }
            i++;
            continue;

        }
        if (/\w/.test(str[i])) {
            let tag = "";
            while (/\w/.test(str[i])) {
                tag += str[i]
                i++;
            }
            tokens.push({ type: "text", raw: tag })

            continue;

        }

        if (/\s/.test(str[i])) {
            i++;
            continue;
        }

        throw new TypeError('I dont know what this character is: ' + str[i]);
    }
    return tokens;
}

//parser
const parse = arr => {
    const stack = [];
    const ret = [];
    arr.forEach((item, i) => {
        if (item.type === "open") {
            stack.push(item);
            return;
        }

        if (item.type === "close") {
            const top = stack.length - 1
            if (stack[top].type === "open" && stack[top].value === item.value) {
                if (arr[i - 1].type == "text" && arr[i - 2].type == "open") {
                    ret.push({
                        type: item.value,
                        name: arr[i - 1].raw
                    })
                    stack.pop()
                } else if (arr[i - 1].type == "open" && arr[i - 1].value == item.value) {
                    ret.push({
                        type: item.value
                    })
                    stack.pop()
                } else {
                    throw TypeError("Maybe the format is wrong!")
                }
            } else {
                throw TypeError("Maybe the format is wrong!")
            }
        }

        if (item.type === "complete") {
            ret.push({ type: item.value })
            return;
        }
    })

    if (!!stack.length) {
        throw TypeError("Maybe the format is wrong!")
    }
    return ret;

}

module.exports = str => parse(tokenizer(str));




