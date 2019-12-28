import request from 'request';
import User from '../models/user';
import { loginServer } from '../../../../config/secrets'

export default (username, password, done) => {
  request(loginServer + `/external-login/${username}/${password}`, function (error, response, body) {
    if(error) {
      // something went wrong
      return done(null, false, { message: 'Unexpected error. Try later.' });
    }
    else if(response && response.statusCode === 200) {
      // proceed
      return done(null, User.wash(body));
    }
    else {
      // 401
      return done(null, false, { message: 'Your ID or password combination is not correct.' });
    }
  });
};

// import User from '../models/user';

// export default (email, password, done) => {
//   User.findOne({ email }, (findErr, user) => {
//     if (!user) return done(null, false, { message: `There is no record of the email ${email}.` });
//     return user.comparePassword(password, (passErr, isMatch) => {
//       if (isMatch) {
//         return done(null, user);
//       }
//       return done(null, false, { message: 'Your email or password combination is not correct.' });
//     });
//   });
// };
