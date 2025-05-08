const mysql = require('mysql2/promise');

// Get data from temp_registrations table
const getTempRegistration = async (sessionID) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [rows] = await connection.execute(
      `SELECT data FROM temp_registrations WHERE session_id = ?`,
      [sessionID]
    );

    await connection.end();

    if (rows.length > 0) {
      return JSON.parse(rows[0].data);
    }

    return null;
  } catch (err) {
    console.error('❌ Error fetching temp registration:', err.message);
    return null;
  }
};

// Delete temp data after successful payment
const deleteTempRegistration = async (sessionID) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await connection.execute(
      `DELETE FROM temp_registrations WHERE session_id = ?`,
      [sessionID]
    );

    await connection.end();
  } catch (err) {
    console.error('❌ Error deleting temp registration:', err.message);
  }
};

module.exports = {
  getTempRegistration,
  deleteTempRegistration
};
