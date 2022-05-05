const testFolder = './data';
var fs = require('fs');


//filelist 변수에 배열형식으로 (data 폴더 내의)파일 목록을 저장한다.
fs.readdir(testFolder, function(err,filelist){
    console.log(filelist);
})