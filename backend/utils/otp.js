const crypto = require('crypto');

function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

module.exports = generateOTP