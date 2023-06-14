const databaseService = require('..services/databaseService');

// 유저 정보 저장
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
