var http = require('http');
var fs = require('fs');
var url = require('url'); // 웹의 url요청
var qs = require('querystring');
function templateHTML(title, list, body,control){
  return  `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB_MAIN</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';
        var i = 0;
        while(i<filelist.length)
        {
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i += 1;
        }
        list += '</ul>';
  return list;
}


const { isUndefined } = require('util');


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query; //req의 쿼리데이터 저장
    
    var pathname = url.parse(_url,true).pathname;
    if (pathname === '/') // pathname = root라면 , 즉 pathname이 따로 없다면 ! 
    {
      if(queryData.id === undefined){ //(쿼리가 없는)메인페이지의 경우 
        fs.readdir('./data',function(err, filelist){
        var title=  'Welcome';
        var description = 'Hello, Node.js';

        var list = templateList(filelist);
        // 페이지 작성
        var template = templateHTML(title,list,`<h2>${title}</h2>${description}`,
        `<a href = "/create">create<a/>`);
        response.writeHead(200);  // 200 = 파일 성공적으로 전송 완료
        response.end(template); // 페이지 전송
        })
      } 
      else{ //메인 페이지가 아닌 경우
        fs.readdir('./data',function(err, filelist){
          fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title,list, `<h2>${title}</h2>${description}`,
            `<a href = "/create">create<a/> 
            <a href="/update?id=${title}">update</a>
            <form action ="delete_process" method = "post" >
            <input type = "hidden" name = "id" value = "${title}">
            <input type = "submit" value = "delete">
            </form>`);
            response.writeHead(200);  // 200 = 파일 성공적으로 전송 완료
            response.end(template);
          });
        });
      }
    }
    else if(pathname==='/create')
    {
      if(queryData.id === undefined){ //(쿼리가 없는)메인페이지의 경우 
        fs.readdir('./data',function(err, filelist){
        var title=  'WEB - create';
        var list = templateList(filelist);
        // 페이지 작성
        var template = templateHTML(title,list,`          
          <form action = "/create_process" method = "post"> 
              <p><input type = "text" name = "title" placeholder = "title"></p>
              <p>
                  <textarea name = "description" placeholder = "description"></textarea>
              </p>
              <p>
                  <input type= "submit">
              </p>
          </form>
        `,'');
        response.writeHead(200);  // 200 = 파일 성공적으로 전송 완료
        response.end(template); // 페이지 전송
        })
      } 
    }
    else if (pathname === '/create_process')
    {
      var body = '';
      // 적정 수준의 데이터를 수신할 때마다, 아래의 callback 함수의 data에 정보 전달
      request.on('data', function(data){
        body += data; // 콜백함수 실행때마다 데이터를 바디에 저장
      });
      // 더 이상 들어올 데이터가 없으면 아래의 콜백함수 실행함
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`,description,'utf8',
        function(err){
          // 302 = 리다이렉션, 위치 = /?id = title 인 주소 
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
      });
    }
    else if (pathname === '/update'){
      fs.readdir('./data',function(err, filelist){
        fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title,list, 
            `
            <form action = "/update_process" method = "post"> 
              <input type= "hidden"  name= "id" value= "${title}">
              <p><input type = "text" name = "title" placeholder = "title" value = "${title}"></p>
              <p>
                  <textarea name = "description" placeholder = "description">${description}</textarea>
              </p>
              <p>
                  <input type= "submit">
              </p>
            </form>
            `,
            `<a href = "/create">create<a/> <a href="/update?id=${title}">update</a>`);
          response.writeHead(200);  // 200 = 파일 성공적으로 전송 완료
          response.end(template);
        });
      });
    }
    else if (pathname === '/update_process'){
      var body = '';
      // 적정 수준의 데이터를 수신할 때마다, 아래의 callback 함수의 data에 정보 전달
      request.on('data', function(data){
        body += data; // 콜백함수 실행때마다 데이터를 바디에 저장
      });
      // 더 이상 들어올 데이터가 없으면 아래의 콜백함수 실행함
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`,`data/${title}`,function(err){
          fs.writeFile(`data/${title}`,description,'utf8',function(err){
            response.writeHead(302,{Location: `/?id=${title}`});
            response.end();
          });
        });
      });
    }
    else if(pathname==='/delete_process'){
      var body = '';
      // 적정 수준의 데이터를 수신할 때마다, 아래의 callback 함수의 data에 정보 전달
      request.on('data', function(data){
        body += data; // 콜백함수 실행때마다 데이터를 바디에 저장
      });
      // 더 이상 들어올 데이터가 없으면 아래의 콜백함수 실행함
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        fs.unlink(`data/${id}`,function(err){
          //삭제 끝나면 홈으로 보내기
          response.writeHead(302,{Location: `/`});
          response.end();
        });
      });
    }
    else{
      response.writeHead(404);  // 404 = 파일 찾을 수 없다
      response.end('Not found');
    }

    
});
app.listen(3000);