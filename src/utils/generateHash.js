//generateHash.js 해시값 생성 담당 유틸리티 함수 제공
//동영상파일로부터 해시값을 생성하는 기능-암호화 라이브러리나 해시함수를 사용하여 해시값을 생성
const crypto = require('crypto');
const fs = require('fs');

// 동영상 파일로부터 해시값을 생성하는 함수
function generateHash(videoFilePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(videoFilePath);

    stream.on('data', (data) => {
      hash.update(data);
    });

    stream.on('end', () => {
      const generatedHash = hash.digest('hex');
      resolve(generatedHash);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = generateHash;
