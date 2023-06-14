const databaseService = require('../services/databaseService');

// 유저 로그인 핸들러
const login = (req, res) => {
  const { username, password } = req.body;

  // MariaDB에서 사용자 정보를 조회하는 쿼리 실행
  const query = `SELECT * FROM user WHERE username = ? AND password = ?`;
  databaseService.connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // 결과가 있는 경우 유저 정보 반환
    if (results.length > 0) {
      const user = results[0];
      res.status(200).json({ user });
    } else {
      // 결과가 없는 경우 로그인 실패 응답
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
};

module.exports = {
  login,
};

/* // 유저 정보 저장
async function saveUser(req, res) {
  try {
    const { u_id, u_pwd, u_phone, u_alias, u_email } = req.body;

    const userData = {
      u_id,
      u_pwd,
      u_phone,
      u_alias,
      u_email,
    };

    // 데이터베이스에 유저 정보 저장
    await databaseService.saveUserData(userData);

    res.status(200).json({ message: 'User data saved successfully.' });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Error occurred while saving user data.' });
  }
}

// 로그인
async function login(req, res) {
  try {
    const { u_id, u_pwd } = req.body;

    // 유저 정보 조회
    const userData = await databaseService.getUserData({ u_id });

    if (!userData) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 저장된 비밀번호와 입력한 비밀번호 비교
    if (u_pwd !== userData.u_pwd) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user data.' });
  }
}

module.exports = {
  saveUser,
  login,
};
 */