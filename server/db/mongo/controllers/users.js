import passport from 'passport';
import PDFDocument from 'pdfkit';
import fs from 'fs';

import User from '../models/user';
import TestResult from '../models/test_result';


function createPDF() {
  const X_START = 50;
  const X_END = 450;
  let contextY = 0;
  const doc = new PDFDocument({
    size: 'A4', // 595.28 x 841.89 - ref: https://github.com/foliojs/pdfkit/blob/master/docs/paper_sizes.md
    margins : { // by default, all are 72
         top: 72, 
         bottom: 72,
         left: 72,
         right: 72
     },
     layout: 'portrait', // can be 'landscape'
     info: {
         Title: 'title', 
         Author: 'JAC', // the name of the author
         Subject: '', // the subject of the document
     }
  });
  doc.pipe(fs.createWriteStream('out.pdf'));
  // doc.moveTo(0, 20)                             // set the current point
  //  .lineTo(100, 160)                            // draw a line
  //  .quadraticCurveTo(130, 200, 150, 120)        // draw a quadratic curve
  //  .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
  //  .lineTo(400, 90)                             // draw another line
  //  .stroke();                                   // stroke the path

  // these examples are easier to see with a large line width
  doc.lineWidth(20);
  doc.lineJoin('miter')
     .rect(X_START - 30, 75, X_END + 60, 720)
     .stroke();

  // line cap settings
  // doc.lineCap('butt')
  //    .moveTo(50, 20)
  //    .lineTo(100, 20)
  //    .stroke();

  // doc.lineCap('round')
  //    .moveTo(150, 20)
  //    .lineTo(200, 20)
  //    .stroke();

  // // square line cap shown with a circle instead of a line so you can see it
  // doc.lineCap('square')
  //    .moveTo(250, 20)
  //    .circle(275, 30, 15)
  //    .stroke();

  // // line join settings

  // doc.lineJoin('round')
  //    .rect(150, 100, 50, 50)
  //    .stroke();

  // doc.lineJoin('bevel')
  //    .rect(250, 100, 50, 50)
  //    .stroke();

  // doc.circle(100, 50, 50)
  //  .lineWidth(3)
  //  .fillOpacity(0.8)
  //  .fillAndStroke("red", "#900")

  // Create a linear gradient
  // let grad = doc.linearGradient(50, 0, 150, 100);
  // grad.stop(0, 'green')
  //     .stop(1, 'blue');

  // doc.rect(50, 0, 100, 100);
  // doc.fill(grad);

  // Create a radial gradient
  // grad = doc.radialGradient(300, 50, 0, 300, 50, 50);
  // grad.stop(0, 'orange', 0)
  //     .stop(1, 'orange', 1);

  // doc.circle(300, 50, 50);
  // doc.fill(grad);

  contextY += 40;
  doc.fontSize(18);
  doc.fillColor('black');
  doc.text('Assessment Test Report', X_START + 45, contextY);

  contextY += 29; // 69
  doc.fillColor('white');
  doc.text('JAMES AN COLLEGE', X_START + 45, contextY);

  contextY += 3; // 72
  doc.fontSize(10);
  doc.text('Test Date : 3 Dec 2019', X_END - 95, contextY, { 
    width: 165,
    align: 'right'
  });

  contextY += 18; // 90
  doc.fontSize(10);
  doc.fillColor('black');
  doc.text('Head Office : 18 Ninth Ave, Campsie NSW 2914 www.jamesancollege.com', X_START + 45, contextY);

  contextY += 30; // 120
  doc.fontSize(10);
  doc.text('Dear Kim Jeonghyeon,', 50, 120);

  contextY += 25; // 145
  doc.text('Thank you for participating in the James An College Year 4 assessment Test.', X_START, 145);

  contextY += 18; // 162
  doc.text('Your marks are indicated below in detail. (Average socre for 3 subject/s : 20%)', X_START, 162);


  // doc.lineWidth(1);
  // doc.lineJoin('miter')
  //    .rect(50, 175, 490, 55)
  //    .stroke();

  contextY += 18; // 179
  doc.text('English Mark : 10%', X_START, contextY, { 
    width: X_END,
    align: 'left'
  });
  doc.text('Mathematics Mark : 10%', X_START, contextY, { 
    width: X_END,
    align: 'center'
  });
  doc.text('General Ability Mark : 10%', X_START, contextY, { 
    width: X_END,
    align: 'right'
  });
  
  doc.end();
}

createPDF();

export function pdf(req, res) {
  createPDF();
  res.sendStatus(200);
}

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
  pdf,
  login,
  logout,
  signUp,
  submitExam
};
