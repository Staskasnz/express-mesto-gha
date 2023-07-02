const { JWT_SECRET = '561180f5b01e642b5a3763dde29d1d0066f8e0b2' } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1/mestodb' } = process.env;

module.exports = {
  JWT_SECRET,
  DB_ADDRESS,
};
