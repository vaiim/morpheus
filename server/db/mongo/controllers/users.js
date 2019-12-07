import passport from 'passport';
import PDFDocument from 'pdfkit';
import fs from 'fs';

import User from '../models/user';
import TestResult from '../models/test_result';

function drawTable(doc, x, y) {
  doc.lineWidth(1);
  let grad = doc.linearGradient(x+100, y+100, x+100, y+250);
  grad.stop(0, 'white')
      .stop(1, 'black');

  doc.roundedRect(x, y, 200, 250, 10).fill(grad).stroke();
  doc.roundedRect(x, y, 200, 250, 10).stroke();
  doc.roundedRect(x+5, y+5, 190, 240, 5).fill('black').stroke();

  doc.fillColor('white');

  doc.fontSize(12);
  doc.text('English', x+5, y+5 + 10, { 
    width: 190,
    align: 'center'
  });

  doc.fontSize(8);
  doc.text('Qn. Resp Ans % Topic', x+5, y+5 + 25, { 
    width: 190,
    align: 'left'
  });

  doc.rect(x+8, y+10 + 30, 184, 200, 5).fill('white').stroke();
}

function drawStats(doc, x, y) {
  const sample = [[10, 58.3], [25, 52.4], [25, 63,7]];
  doc.lineWidth(1);

  doc.strokeColor("#DDD");
  for(let i=1;i<5;i++) {
    doc.lineCap('butt')
     .moveTo(x + (190/5)*i, y)
     .lineTo(x + (190/5)*i, y+245)
     .stroke();
    doc.fillColor('black');
    doc.text(i*20 + '%', x + (190/5)*i-5, y+245+5);
  }
  doc.text('0%', x-5, y+245+5);
  doc.text('100%', x + (190/5)*5 -10, y+245+5);

  doc.strokeColor('black');
  const width = 30;
  const gap = 15;
  let contextY = y + gap;
  for(const d of sample) {
    let grad = doc.linearGradient(x, contextY + width/2, x+190 * d[0] / 100, contextY + width/2);
    grad.stop(0, 'white')
        .stop(1, 'black');
    doc.rect(x, contextY, 190 * d[0] / 100, width).fill(grad).stroke();
    doc.rect(x, contextY, 190 * d[0] / 100, width).stroke();
    doc.rect(x, contextY+width, 190 * d[1] / 100, width).fill('white').stroke();
    doc.rect(x, contextY+width, 190 * d[1] / 100, width).stroke();
    doc.fillColor('black');
    doc.text(d[0] + '%', x + 190 * d[0] / 100 + 5, contextY + width/2 -5);
    doc.text(d[1] + '%', x + 190 * d[1] / 100 + 5, contextY + width*1.5 -5);
    contextY += width * 2 + gap;
  }

  doc.rect(x, y, 190, 245).stroke();
}

function createPDF() {
  const X_START = 50;
  const X_END = 450;
  const HEIGHT = 720;
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
     .rect(X_START - 30, 75, X_END + 60, HEIGHT)
     .stroke();

  doc.save();
  doc.fillColor('white')
  doc.rotate(-90)
   .text('James An College - Selective / O.C. / Scholarship / H.S.C. / V.C.E. / Q.C.S. / S.A.C.E. / T.E.E. Specialists - Australia\'s leading college', -(HEIGHT+63), X_END+77);
  doc.restore();

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
  doc.text('Head Office : 18 Ninth Ave, Campsie NSW 2914 www.jamesancollege.com?', X_START + 45, contextY);

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

  contextY += 20;

  doc.lineWidth(1);
  drawTable(doc, X_START, contextY);
  drawTable(doc, X_START + 250, contextY);

  contextY += 270;
  drawTable(doc, X_START, contextY);

  drawStats(doc, X_START + 250, contextY);
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
