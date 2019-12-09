import passport from 'passport';
import PDFDocument from 'pdfkit';
import fs from 'fs';

import User from '../models/user';
import TestResult from '../models/test_result';

function drawTable(doc, x, y) {
  const tableWidth = 220;
  const tableHeight = 240;
  let grad = doc.linearGradient(x+100, y+100, x+100, y+tableHeight);
  grad.stop(0, 'white')
      .stop(1, 'black');

  doc.lineWidth(1);
  doc.roundedRect(x, y, tableWidth, tableHeight, 10).fill(grad).stroke();
  doc.roundedRect(x, y, tableWidth, tableHeight, 10).stroke();
  doc.roundedRect(x+5, y+5, tableWidth - 10, tableHeight-10, 5).fill('black').stroke();

  doc.fillColor('white');
  doc.fontSize(12);
  doc.text('English', x+5, y + 5 + 5, { 
    width: tableWidth,
    align: 'center'
  });

  doc.fontSize(8);
  doc.text('Qn. Resp Ans % Topic', x+5, y+5 + 20, { 
    width: tableWidth,
    align: 'left'
  });
  doc.rect(x+8, y+10 + 25, tableWidth - 16, tableHeight-42, 5).fill('white').stroke();
  
  doc.fillColor('black');
  for(let i=0;i<10;i++) {
    doc.rect(x+11, y+38+17*i, tableWidth - 22, 8.5).fill('#CCC').stroke();
  }
  const colWidths = [15, 25, 20, 30, 15, 60];
  doc.fill('black');
  doc.fontSize(6);
  for(let i=0;i<20;i++) {
    let xStart = x+11;
    doc.text(i+1+'.', xStart, y+40+8.5*i, { 
      width: colWidths[0],
      align: 'right'
    });
    // doc.rect(xStart, y+40+8.5*i, colWidths[0], 8).stroke();

    xStart += colWidths[0];
    doc.text('A x', xStart, y+40+8.5*i, { 
      width: colWidths[1],
      align: 'right'
    });
    // doc.rect(xStart, y+40+8.5*i, colWidths[1], 8).stroke();

    xStart += colWidths[1];
    doc.text('D', xStart, y+40+8.5*i, { 
      width: colWidths[2],
      align: 'right'
    });
    // doc.rect(xStart, y+40+8.5*i, colWidths[2], 8).stroke();
    
    xStart += colWidths[2];
    doc.text('80%', xStart, y+40+8.5*i, { 
      width: colWidths[3],
      align: 'right'
    });
    // doc.rect(xStart, y+40+8.5*i, colWidths[3], 8).stroke();
    
    xStart += colWidths[3];
    // doc.rect(xStart, y+40+8.5*i, colWidths[4], 8).stroke();

    xStart += colWidths[4];
    doc.text('GRAMMAR', xStart, y+40+8.5*i, { 
      width: colWidths[5],
      align: 'left'
    });
    // doc.rect(xStart, y+45+8.5*i, colWidths[5], 8).stroke();

  }
  doc.fontSize(10);
  doc.text('Score : 2/20 =', x + 30, y+215, { 
    width: 125,
    align: 'right'
  });
  doc.lineWidth(0.5);
  doc.fillColor('black');
  doc.ellipse(x + 187, y+220, 27, 15).stroke();
  doc.ellipse(x + 187, y+220, 27, 15).fill('white').stroke();

  doc.fontSize(18);
  doc.fillColor('black');
  doc.text('80%', x + 167, y+213, { 
    width: 50,
    align: 'center'
  });
}

function drawStats(doc, x, y) {
  const sample = [[10, 58.3], [25, 52.4], [25, 63.7]];
  const height = 233;
  const statWidth = 205;
  doc.lineWidth(1);
  doc.fontSize(10);

  doc.strokeColor("#DDD");
  for(let i=1;i<5;i++) {
    doc.lineCap('butt')
     .moveTo(x + (statWidth/5)*i, y)
     .lineTo(x + (statWidth/5)*i, y+height)
     .stroke();
    doc.fillColor('black');
    doc.text(i*20 + '%', x + (statWidth/5)*i-5, y+height+5);
  }
  doc.text('0%', x-5, y+height+5);
  doc.text('100%', x + (statWidth/5)*5 -10, y+height+5);

  doc.strokeColor('black');
  const width = 31;
  const gap = 12;
  let contextY = y + gap;
  for(const d of sample) {
    let grad = doc.linearGradient(x, contextY + width/2, x+statWidth * d[0] / 100, contextY + width/2);
    grad.stop(0, 'white')
        .stop(1, 'black');
    doc.rect(x, contextY, statWidth * d[0] / 100, width).fill(grad).stroke();
    doc.rect(x, contextY, statWidth * d[0] / 100, width).stroke();
    doc.rect(x, contextY+width, statWidth * d[1] / 100, width).fill('white').stroke();
    doc.rect(x, contextY+width, statWidth * d[1] / 100, width).stroke();
    doc.fillColor('black');
    doc.text(d[0] + '%', x + statWidth * d[0] / 100 + 5, contextY + width/2 -5);
    doc.text(d[1] + '%', x + statWidth * d[1] / 100 + 5, contextY + width*1.5 -5);
    contextY += width * 2 + gap;
  }

  doc.rect(x, y, statWidth, height).stroke();
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
     .rect(X_START - 30, 70, X_END + 60, HEIGHT)
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

  contextY += 24; // 69
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
  drawTable(doc, X_START - 5, contextY);
  drawTable(doc, X_START + 235, contextY);

  contextY += 260;
  drawTable(doc, X_START - 5, contextY);

  drawStats(doc, X_START + 235, contextY);

  let grad = doc.linearGradient(X_START - 20, 80 + 30, X_START - 20, HEIGHT - 10);
  grad.stop(0, 'white')
      .stop(1, 'black');
  doc.lineWidth(1);
  doc.lineJoin('miter')
     .rect(X_START - 40.3, 77, 20.6, HEIGHT)
     .fill(grad)
     .stroke();


  doc.image('server/jac_1.png', 9, 16, {width: 85});

  doc.lineWidth(1);
  const barStartX = 73;
  const barStartY = 60;
  const barWidth = 22;
  doc.polygon([barStartX, barStartY], [barStartX + barWidth, barStartY], [barStartX + barWidth, barStartY + 20], [barStartX + 10, barStartY + 20]).fill('black');

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
