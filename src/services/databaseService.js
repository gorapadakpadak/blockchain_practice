//database service scripts

const mysql = require('mysql2');

// 마리아DB 연결 설정
const connection = mysql.createConnection({
  host: '3.82.242.31',
  port:'3306',
  user: 'adminMaria',
  password: 'notpwd',
  database: 'rlpdb',
});

// 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MariaDB:', err);
  } else {
    console.log('Connected to MariaDB');
  }
});

//불필요: mysql2의 createConnection로 이미 데이터베이스 연결 설정한 connection객체 사용
//const database = require('path/to/database');

// 영상 ID로 URL 조회
async function getVideoURLByID(videoID) {
  try {
    // DB에서 영상 ID에 해당하는 URL 조회 로직 작성
    const videoURL = await database.query('SELECT url FROM videos WHERE id = ?', [videoID]);

    return videoURL;
  } catch (error) {
    throw error;
  }
}

// // URL로 영상 ID 조회
// async function getVideoIDByUrl(videoURL) {
//   try {
//     // DB에서 영상 URL에 해당하는 ID 조회 로직 작성
//     const videoID = await database.query('SELECT id FROM videos WHERE url = ?', [videoURL]);

//     return videoID;
//   } catch (error) {
//     throw error;
//   }
// }

// 위치 정보 기준으로 사고 당사자 조회 메소드 (videoHelperScript.js 1)
async function getAccidentData(data){

  //있다 -> accident data 제공

  //없다 -> 없다 리턴
}

//위치 정보 기준으로 헬퍼 영상 조회 메소드 (videoRequest.Script.js 1)
async function getHelperData(data){ 
  //있다 -> helper data 제공
  //      안드에서 helper data 중 첨엔 url만 쓰고 선택된애들한테만 요청 알림 보냄
  //      나중에 요청 수락하면 헬퍼 데이터 사고 데이터로 올리기

  //없다 -> 없다 리턴
}

//accident 테이블에 accident 정보 저장
async function saveAccidentData(accidentdata){

}

//helper 테이블에 helper정보 저장
async function saveHelpData(helpData){

}

//목격자 video 저장
async function saveHelperVideo(videoeID,videoURL){

}
//사고당사자 video 저장
async function saveVictimVideo(videoeID,videoURL){
  
}

// Witness 데이터 저장
async function saveWitnessData(witnessData) {
  try {
    const { wv_id, wu_id, wv_url, w_place, upload_uid, w_time } = witnessData;

    const query = 'INSERT INTO witness (wv_id, wu_id, wv_url, w_place, upload_uid, w_time) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [wv_id, wu_id, wv_url, w_place, upload_uid, w_time];

    await connection.query(query, params);
    console.log('Witness data saved successfully.');

    return true;
  } catch (error) {
    console.error('Error saving witness data:', error);
    throw error;
  }
}

// Witness 데이터 조회
async function getWitnessData(wPlace) {
  try {
    //w_place로 조회
    const query = 'SELECT * FROM witness WHERE w_place = ?';
    const result = await connection.query(query, [wPlace]);

    // 조회 결과 반환
    return result;
  } catch (error) {
    console.error('Error getting witness data:', error);
    throw error;
  }
}

async function saveRequestData(requestData) {
  try {
    const { request_no, acc_no, au_id, req_time, accepted } = requestData;

    const query = 'INSERT INTO request (request_no, acc_no, au_id, req_time, accepted) VALUES (?, ?, ?, ?, ?)';
    const params = [request_no, acc_no, au_id, req_time, accepted];

    await connection.query(query, params);
    console.log('Request data saved successfully.');

    return true;
  } catch (error) {
    console.error('Error saving request data:', error);
    throw error;
  }
}

async function getRequestData() {
  try {
    const query = 'SELECT * FROM request';
    const result = await connection.query(query);

    return result;
  } catch (error) {
    console.error('Error retrieving request data:', error);
    throw error;
  }
}

//유저 정보 저장
async function saveUserData(userData){
  try {
    const { u_id, u_pwd, u_phone, u_alias, u_email } = userData;

    const query = 'INSERT INTO user (u_id, u_pwd, u_phone, u_alias, u_email) VALUES (?, ?, ?, ?, ?)';
    const params = [u_id, u_pwd, u_phone, u_alias, u_email];

    //쿼리 실행 완료될 때가지 대기
    await connection.query(query, params);
    console.log('User data saved successfully.');

    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

//유저 정보 조회
async function getUserData(userData){
  try {
    const { u_id } = userData;

    const query = 'SELECT * FROM user WHERE u_id = ?';
    const params = [u_id];

    const [userData] = await connection.query(query, params);

    return userData;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    throw error;
  }
}

module.exports = { 
  getVideoURLByID,
  getVideoIDByUrl,
  saveWitnessData,
  getWitnessData,
  saveRequestData,
  getRequestData,
  saveUserData,
  getUserData,
};
