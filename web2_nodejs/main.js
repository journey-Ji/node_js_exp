var http = require('http');
var fs = require('fs');
var url = require('url'); // 웹의 url요청
const { isUndefined } = require('util');


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query; //req의 쿼리데이터 저장
    
    var pathname = url.parse(_url,true).pathname;
    
    if (pathname === '/') // pathname = root라면 , 즉 pathname이 따로 없다면 ! 
    {
      if(queryData.id === undefined){ 
        fs.readdir('./data',function(err, filelist){
        var title=  'Welcome';
        var description = 'Hello, Node.js';
        var list = '<ul>';
        var i = 0;
        while(i<filelist.length)
        {
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i += 1;
        }
        list += '</ul>';
        var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html>
        `;
        response.writeHead(200);  // 200 = 파일 성공적으로 전송 완료
        response.end(template);
        })
      } 
      else{
        fs.readdir('./data',function(err, filelist){
          var title=  'Welcome';
        var description = 'Hello, Node.js';
        var list = '<ul>';
        var i = 0;
        while(i<filelist.length)
        {
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i += 1;
        }
        list += '</ul>';
        fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
          var title = queryData.id;
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `;
          response.writeHead(200);  // 200 = 파일 성공적으로 전송 완료
          response.end(template);
        });
        
      });
      }
    }
    else{
      response.writeHead(404);  // 404 = 파일 찾을 수 없다
      response.end('Not found');
    }

    
});
app.listen(3000);