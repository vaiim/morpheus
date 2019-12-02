import passport from 'passport';
import User from '../models/user';
import TestResult from '../models/test_result';

/**
 * POST /login
 */
export function login(req, res, next) {
  // Do email and password validation for the server
  passport.authenticate('local', (authErr, user, info) => {
    if (authErr) return next(authErr);
    if (!user) {
      return res.sendStatus(401);
    }
    // Passport exposes a login() function on req (also aliased as
    // logIn()) that can be used to establish a login session
    return req.logIn(user, (loginErr) => {
      if (loginErr) return res.sendStatus(401);
      return res.sendStatus(200);
    });
  })(req, res, next);
}

/**
 * POST /logout
 */
export function logout(req, res) {
  req.logout();
  res.sendStatus(200);
}

export async function submitExam(req, res) {
  const { student, answers } = req.body;
  const userId = req.session && req.session.passport && req.session.passport.user;
  const user = await User.findOne({_id: userId});
  student.name = student.firstName + student.familyName;
  student.grade = student.grade.split(' ')[1];
  const testResult = new TestResult({student, answers, branchName: user.branch.name});
  await testResult.save();
  res.sendStatus(200);

}

/**
 * POST /signup
 * Create a new local account
 */
export function signUp(req, res, next) {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (findErr, existingUser) => {
    if (existingUser) {
      return res.sendStatus(409);
    }

    return user.save((saveErr) => {
      if (saveErr) return next(saveErr);
      return req.logIn(user, (loginErr) => {
        if (loginErr) return res.sendStatus(401);
        return res.sendStatus(200);
      });
    });
  });
}

export default {
  login,
  logout,
  signUp,
  submitExam
};
