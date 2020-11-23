const http = require('http');
http.createServer((request,response) => {
    let body = [];
    request.on('error',(err)=>{
        console.error(err);
    }).on('data',(chunk)=>{
        body.push(chunk);
    }).on('end',()=>{
        body=Buffer.concat(body).toString();
        console.log("body",body);
        response.writeHead(200,{'Content-Type':'text/html'});
        response.end(`<html lang="en">
        <head>
            <title>state_machine</title>
            <style>
                body #name {
                    color: red;
                }
            </style>
        </head>
        <body>
            <h1 id="name">hello</h1>
            <span>world</span>
            <h2>list1</h2>
        </body>
        </html>`);
    })
}).listen(8088)

console.log('server started');