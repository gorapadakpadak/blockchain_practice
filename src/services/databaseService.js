//database service scripts

const mysql = require('mysql2');

// 마리아DB 연결 설정
const connection = mysql.createConnection({
  host: '44.202.120.253',
  port: '3306',
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

/* // 영상 ID로 URL 조회
async function getVideoURLByID(videoID) {
  try {
    // DB에서 영상 ID에 해당하는 URL 조회 로직 작성
    const videoURL = await database.query('SELECT url FROM videos WHERE id = ?', [videoID]);

    return videoURL;
  } catch (error) {
    throw error;
  }
}
 */
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

// Request 데이터 저장
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

// Request 데이터 조회
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

//accidentReport  데이터 저장
async function saveAccidentReportData(accidentData) {
  try {
    const { acc_no, au_id, acc_vid, acc_url, acc_place, acc_title, acc_description, acc_time } = accidentData;

    const query = 'INSERT INTO accidentReport (acc_no, au_id, acc_vid, acc_url, acc_place, acc_title, acc_description, acc_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [acc_no, au_id, acc_vid, acc_url, acc_place, acc_title, acc_description, acc_time];

    await connection.query(query, params);
    console.log('Accident data saved successfully.');

    return true;
  } catch (error) {
    console.error('Error saving accident data:', error);
    throw error;
  }
}

//accidentReport  데이터 조회
async function getAccidentReportData(accNo) {
  try {
    const query = 'SELECT * FROM accidentReport WHERE acc_no = ?';
    const params = [accNo];

    const result = await connection.query(query, params);
    const accidentData = result[0];

    return accidentData;
  } catch (error) {
    console.error('Error retrieving accident data:', error);
    throw error;
  }
}

//accidentWitness 데이터 저장
async function saveAccidentWitnessData(wv_id, wu_id, acc_no, au_id) {
  try {
    const query = 'INSERT INTO accidentWitness (wv_id, wu_id, acc_no, au_id) VALUES (?, ?, ?, ?)';
    const params = [wv_id, wu_id, acc_no, au_id];
    await connection.query(query, params);
    console.log('Accident witness data saved successfully.');

    return true;
  } catch (error) {
    console.error('Error saving accident witness data:', error);
    throw error;
  }
}

//accidentWitness 데이터 조회
async function getAccidentWitnessData(acc_no) {
  try {
    const query = 'SELECT wv_id, wu_id, acc_no, au_id FROM accidentWitness WHERE acc_no = ?';
    const params = [acc_no];
    const result = await connection.query(query, params);
    console.log('Accident witness data retrieved successfully.');

    return result;
  } catch (error) {
    console.error('Error retrieving accident witness data:', error);
    throw error;
  }
}


//유저 정보 저장
async function saveUserData(userData) {
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

// accidentHistoryData 데이터 저장
async function saveAccidentHistoryData(historyData) {
  try {
    const { history_id, wv_id, wu_id, acc_no, au_id, status } = historyData;

    const query = 'INSERT INTO accidentHistory (history_id, wv_id, wu_id, acc_no, au_id, status) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [history_id, wv_id, wu_id, acc_no, au_id, status];

    await connection.query(query, params);
    console.log('Accident history data saved successfully.');

    return true;
  } catch (error) {
    console.error('Error saving accident history data:', error);
    throw error;
  }
}

// accidentHistoryData 데이터 조회
async function getAccidentHistoryData(historyId) {
  try {
    const query = 'SELECT * FROM accidentHistory WHERE history_id = ?';
    const result = await connection.query(query, [historyId]);

    return result;
  } catch (error) {
    console.error('Error getting accident history data:', error);
    throw error;
  }
}

//유저 정보 조회
async function getUserData(userData) {
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
/*   getVideoURLByID,
  getVideoIDByUrl, */
  connection,
  saveWitnessData,
  getWitnessData,
  saveRequestData,
  getRequestData,
  saveAccidentReportData,
  getAccidentReportData,
  saveAccidentWitnessData,
  getAccidentWitnessData,
  saveAccidentHistoryData,
  getAccidentHistoryData,
  saveUserData,
  getUserData,
};
