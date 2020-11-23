function UTF8_Encoding(string){
//  const buf = Buffer.alloc(string.length);
//  for(let i=0;i<string.length;i++){
//      console.log(string.codePointAt(i))
//      buf.fill(string.codePointAt(i),i)
//  }
//  return buf;
let list = [];
for(let i=0;i<string.length;i++){
    let code = string.codePointAt(i);
    if(code<=0xff){
        list.push(code);
    }else if(code<=0x7fff){
        list.push(code>>6 | 0xC0);
        list.push(code & 0x3f | 0x80);
    }else if(0<=0xffff){
        list.push(code >> 12 | 0xE0);
        list.push(code & 0x0fc0 | 0x80);
        list.push(code & 0x3f | 0x80);
    }
}
return Buffer.from(list);
 
// console.log(buf.toString())
}


console.log(UTF8_Encoding("极客时间前端训练营"))