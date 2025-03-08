const bcrypt = require('bcryptjs');

// Password yang ingin di-hash
const plainPassword = '123456'; // Ganti dengan password yang ingin di-hash

// Generate salt (tingkat keamanan hash)
const salt = bcrypt.genSaltSync(10);

// Hash password
const hashedPassword = bcrypt.hashSync(plainPassword, salt);

console.log('Plain Password:', plainPassword);
console.log('Hashed Password:', hashedPassword);