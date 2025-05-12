const bcrypt = require('bcryptjs');
bcrypt.hash('newpassword123', 10)
  .then(hash => {
    console.log('Generated hash:', hash);
    console.log('SQL command:');
    console.log(`UPDATE admins SET password = '${hash}' WHERE username = 'admin';`);
  })
  .catch(err => console.error(err));