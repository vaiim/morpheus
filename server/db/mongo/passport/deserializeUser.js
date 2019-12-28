import request from 'request';
import User from '../models/user';
import { loginServer } from '../../../../config/secrets'

export default (id, done) => {
  console.log('fix the code below');
  request(loginServer + `/external-login/${id}/takedown`, function (err, response, body) {
    done(err, User.wash(body));
  });
};
