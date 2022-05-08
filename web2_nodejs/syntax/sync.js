var fs = require('fs');


//readFileSync


console.log('A');

// readFile의 결과(파일의 내용)을 result(function의 두번째 인자)로 전달해준다.
// 이후에 Function 함수를 실행해준다.
fs.readFile('syntax/sample.txt','utf-8',function(err,result){
    console.log(result);
});
console.log('C');

// 위의 결과는 A 실행 후, fs.readFIle을 동시에 실행함과 동시에, console.log(C) 를 수행한다.
// 다만 이 때, console.log(C)가 먼저 수행 완료되기 때문에 C가 먼저 출력되게 된다.