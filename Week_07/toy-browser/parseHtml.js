const css = require('css');
let currentToken =null;
let currentAttribute=null;
let currentTextNode=null;
let stack=[{type:"document",children:[]}];
let rules = [];
function addCssRules(text){
    var ast = css.parse(text);
    rules.push(...ast.stylesheet.rules);
}
// 计算css选择器与元素是否匹配

function match(element, selector){
    if(!selector || !element.attributes){
        return false;
    }
    if(selector.charAt(0) == '#'){
        var attr=element.attributes.filter(attr=>attr.name==="id")[0];
        if(attr && attr.value===selector.replace('#',''))
            return true;
    }else if(selector.charAt(0)=='.'){
        var attr=element.attributes.filter(attr=>attr.name==="class")[0];
        if(attr && attr.value===selector.replace('.',''))
            return true;
    }else {
        if(element.tagName===selector){
            return true;
        }
    }
    return false;
}
// 计算样式优先级
function specificity(selector){
    var p = [0,0,0,0];
    var selectorParts=selector.split(" ");
    for(var part of selectorParts){
        if(part.charAt(0)=="#"){
            p[1]+=1;
        }else if(part.charAt(0)=="."){
            p[2]+=1;
        }else{
            p[3]+=1;
        }
    }
    return p;
}
// 样式优先级比较
function compare(sp1,sp2){
    if(sp1[0]-sp2[0]){
        return sp1[0]-sp2[0];
    }else if(sp1[1]-sp2[1]){
        return sp1[1]-sp2[1]
    }else if(sp1[2]-sp2[2]){
        return sp1[2]-sp2[2]
    }
    return sp1[3]-sp2[3]
}
function computeCSS(element){
    var elements = stack.slice().reverse();
    if(!element.computedStyle){
        element.computedStyle={};
    }
    for(let rule of rules){
        var seletorParts = rule.selectors[0].split(" ").reverse();
        if(!match(element, seletorParts[0])){
            continue;
        }
        let matched=false;
        let j=1;
        for(var i=0;i<elements.length;i++){
            if(match(elements[i],seletorParts[j])){
                j++;
            }
        }
        if(j>=seletorParts.length){
            matched=true;
        }
        if(matched){
            // 如果匹配到，我们要加入
            var sp = specificity(rule.selectors[0]);
            var computedStyle = element.computedStyle;
            for(var declaration of rule.declarations){
                if(!computedStyle[declaration.property])
                    computedStyle[declaration.property]={};
                if(!computedStyle[declaration.property].specificity){
                    computedStyle[declaration.property].value=declaration.value;
                    computedStyle[declaration.property].specificity=sp;
                }else if(compare(computedStyle[declaration.property],sp)<0){
                    computedStyle[declaration.property].value=declaration.value;
                    computedStyle[declaration.property].specificity=sp;
                }
                
            }
            console.log(element.computedStyle);
        }
    }
}
function emit(token){
    let top = stack[stack.length-1];
    if(token.type=="startTag"){
        let element={
            type:"element",
            children:[],
            attributes:[],
        }
        element.tagName=token.tagName;
        for(let p in token){
            if(p!=="type" && p!=="tagName"){
                element.attributes.push({
                    name:p,
                    value:token[p],
                })
            }
        }
        // css计算
        computeCSS(element);
        top.children.push(element);
        // element.parent=top;
        if(!token.isSelfClosing){
            stack.push(element);
        }
        currentTextNode = null;
    }else if(token.type =="endTag"){
        if(top.tagName!==top.tagName){
            throw new Error("Tag start End does't match!")
        }else {
            // 遇到tyle标签时执行，执行添加css规则的操作
            if(top.tagName == "style"){
                addCssRules(top.children[0].content);
            }
            stack.pop();
        }
        currentTextNode=null;
    }else if(token.type ==="text"){
        if(currentTextNode==null){
            currentTextNode={
                type:"text",
                content:'',
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content+=token.content;
    }
}
const EOF=Symbol('EOF');
function data(c){
    if(c==='<'){
        return tagOpen;
    }else if(c===EOF){
        emit({
            type:"EOF"
        })
        return;
    }else{
        emit({
            type:'text',
            content:c
        });
        return data;
    }
}
function tagOpen(c){
    if(c=="/"){
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken={
            type:"startTag",
            tagName:""
        }
        return tagName(c);
    }else return;
}
function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken={
            type:"endTag",
            tagName:""
        }
        return tagName(c)
    }else if(c==='>'){
        throw error("invalid html")
    }else if(c===EOF){
        throw error("invalid html")
    }else {

    }
}
function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c==='/'){
        return selfClosingStartTag;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName+=c;
        return tagName;
    }else if(c=='>'){
        emit(currentToken);
        return data;
    }else{
        return tagName;
    }
}
function beforeAttributeName(c){
    if(c.match(/^[\n\f\t ]$/)){
        return beforeAttributeName;
    }else if(c=='>' || c=="/" || c===EOF){
        return afterAttributeName(c);
    }else if(c=="="){
        throw new Error('invalid AttributeName')
    }else{
        currentAttribute = {
            name:"",
            value:"",
        }
        return attributeName(c);
    }
}
function attributeName(c){
    if(c.match(/^[\n\f\t ]$/) || c=="/" || c==">" || c==EOF){
        return afterAttributeName(c)
    }else if(c=="="){
        return beforeAttributeValue;
    }else if(c=='\u0000'){

    }else if(c=='\"' || c=="'" || c=="<"){

    }else {
        currentAttribute.name+=c;
        return attributeName;
    }
}
function beforeAttributeValue(c){
    if(c.match(/^[\n\f\t ]$/) || c=="/" || c==">" || c==EOF){
        return beforeAttributeValue;
    }else if(c=="\""){
        return doubleQuotedAttributeValue;
    }else if(c=="\'"){
        return singleQuotedAttributeValue;
    }else if(c==">"){
        // return data;
    }else{
        return UnQuotedAttributeValue;
    }
}
function doubleQuotedAttributeValue(c){
    if(c=="\""){
        currentToken[currentAttribute.name]=currentAttribute.value;
        return afterQuotedAttributeName;
    }else if(c =="\u0000"){

    }else if(c==EOF){

    }else {
        currentAttribute.value+=c;
        return doubleQuotedAttributeValue;
    }
}
function singleQuotedAttributeValue(c){
    if(c=="\'"){
        currentToken[currentAttribute.name]=currentAttribute.value;
        return afterQuotedAttributeName;
    }else if(c =="\u0000"){

    }else if(c==EOF){

    }else {
        currentAttribute.value+=c;
        return singleQuotedAttributeValue;
    }
}
function afterQuotedAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c=="/"){
        return selfClosingStartTag;
    }else if(c==">"){
        currentToken[currentAttribute.name]=currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c==EOF){

    }else {
        currentAttribute.value+=c;
        return doubleQuotedAttributeValue;
    }
}
function UnQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name]=currentAttribute.value;
        return beforeAttributeName;
    }else if(c=="/"){
        currentToken[currentAttribute.name]=currentAttribute.value;
        return selfClosingStartTag;
    }else if(c==">"){
        currentToken[currentAttribute.name]=currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c=="\u0000"){

    }else if(c=="\"" || c=="'" || c=="<" || c=="=" || c=='`'){

    }else if(c==EOF){

    }else{
        currentAttribute.value+=c;
        return UnQuotedAttributeValue;
    }
}
function selfClosingStartTag(c){
    if(c==">"){
        currentToken.isSelfClosing=true;
        return data;
    }else if(c==EOF){

    }else{

    }
}

module.exports = function parseHtml(html){
    let state=data;
    for(let c of html){
        state = state(c);
    }
    state=state(EOF);
    return stack[0]
}
