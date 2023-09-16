const dotenv = require('dotenv');

dotenv.config();

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const MONGO_URL = process.env.MONGO_URL || '';

module.exports = {
  MONGO_URL,
  connectionParams,
};  