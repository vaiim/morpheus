import request from 'request';
import User from '../models/user';
import { loginServer } from '../../../../config/secrets'

export default (id, done) => {
  request(loginServer + `/external-user/${id}`, function (err, response, body) {
    done(err, User.wash(body));
  });
};
