const Insta = require('instamojo-nodejs');
Insta.setKeys(process.env.INSTA_API_KEY, process.env.INSTA_SECRET_KEY)
Insta.isSandboxMode(true);

export default Insta;