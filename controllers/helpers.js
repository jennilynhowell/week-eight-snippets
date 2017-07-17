const crypto = require('crypto');

module.exports = {
  createPasswordObject: (password, salt='') => {
    salt = salt || crypto.randomBytes(Math.ceil(32 * 3 / 4)).toString('base64').slice(0, 8);

    let hash = crypto.pbkdf2Sync(password, salt, 100, 256, 'sha256');
    let hashString = hash.toString('base64');

    let iterations = 100;

    return {iterations: iterations, salt: salt, hash: hashString};
  }
};
