/*
function a(){
    console.log('A');
}*/

// 익명 함수
// 자바스크립트에서는 함수가 값이다.
var a = function(){
    console.log('A');
}


// slowfunc 함수 실행 끝내고, 이후에 callback 함수를 실행함
function slowfunc(callback){
    console.log('B');
    callback();
}


slowfunc(a);