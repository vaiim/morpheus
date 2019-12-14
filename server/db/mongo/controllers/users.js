import passport from 'passport';
import PDFDocument from 'pdfkit';
import fs from 'fs';

import User from '../models/user';
import TestResult from '../models/test_result';

function drawTable(doc, x, y) {
  const tableWidth = 220;
  const tableHeight = 245;
  let grad = doc.linearGradient(x+100, y+100, x+100, y+tableHeight);
  grad.stop(0, 'white')
      .stop(1, 'black');

  doc.lineWidth(1);
  doc.roundedRect(x, y, tableWidth, tableHeight, 10).fill(grad).stroke();
  doc.roundedRect(x, y, tableWidth, tableHeight, 10).stroke();
  doc.roundedRect(x+5, y+5, tableWidth - 10, tableHeight-10, 5).fill('black').stroke();

  doc.fillColor('white');
  doc.fontSize(12);
  doc.font('Times-Bold').text('English', x, y + 5 + 4, { 
    width: tableWidth,
    align: 'center',
    characterSpacing: 0.5
  });

  const colWidths = [15, 25, 20, 30, 15, 60];
  let xStart = x + 10;
  doc.fontSize(8);
  doc.font('Times-Roman');
  doc.text('Qn.', xStart, y+25, { 
    width: colWidths[0] + 10,
    align: 'center'
  });

  xStart += colWidths[0] + 10;
  doc.text('Resp', xStart, y+25, { 
    width: colWidths[1],
    align: 'center'
  });

  xStart += colWidths[1];
  doc.text('Ans', xStart, y+25, { 
    width: colWidths[2],
    align: 'center'
  });

  xStart += colWidths[2];
  doc.text('%', xStart, y+25, { 
    width: colWidths[3],
    align: 'center'
  });

  xStart += colWidths[3];
  doc.text('', xStart, y+25, { 
    width: colWidths[4],
    align: 'right'
  });

  doc.text('Topic', xStart + 5, y+25, { 
    width: colWidths[5],
    align: 'left'
  });

  doc.rect(x+8, y+10 + 25, tableWidth - 16, tableHeight-42, 5).fill('white').stroke();
  
  doc.fillColor('black');
  for(let i=0;i<10;i++) {
    doc.rect(x+11, y+38+17*i, tableWidth - 22, 8.5).fill('#CCC').stroke();
  }

  doc.fill('black');
  doc.fontSize(7);
  const cellWidths = [15, 20, 8, 20, 27, 16, 60];
  for(let i=0;i<20;i++) {
    xStart = x+8;
    doc.text(i+1+'.', xStart, y+40+8.5*i, { 
      width: cellWidths[0],
      align: 'right'
    });
    
    xStart += cellWidths[0] + 2;
    doc.text('A', xStart, y+40+8.5*i, { 
      width: cellWidths[1],
      align: 'right'
    });

    xStart += cellWidths[1];
    if(i%2 === 0) {
      doc.lineWidth(1.5);
      doc.lineCap('butt')
       .moveTo(xStart + 5, y+40+8.5*i + 1)
       .lineTo(xStart + 8.5, y+40+8.5*i + 4.5)
       .moveTo(xStart + 8.5, y+40+8.5*i + 1)
       .lineTo(xStart + 5, y+40+8.5*i + 4.5)
       .stroke();
   } 
   else {
    doc.lineWidth(1);
    doc.lineCap('butt')
     .moveTo(xStart + 5, y+40+8.5*i + 2.5)
     .lineTo(xStart + 6.5, y+40+8.5*i + 4)
     .lineTo(xStart + 8.5, y+40+8.5*i)
     .stroke();
   }

    xStart += cellWidths[2];
    doc.text('D', xStart, y+40+8.5*i, { 
      width: cellWidths[3],
      align: 'right'
    });
    
    xStart += cellWidths[3];
    doc.text('80%', xStart, y+40+8.5*i, { 
      width: cellWidths[4],
      align: 'right'
    });
    
    xStart += cellWidths[4];

    xStart += cellWidths[5];
    doc.text('GRAMMAR', xStart, y+40+8.5*i, { 
      width: cellWidths[6],
      align: 'left'
    });

  }
  doc.fontSize(11);
  doc.text('Score : 2/20 =', x + 30, y+222, { 
    width: 125,
    align: 'right'
  });
  doc.lineWidth(0.5);
  doc.fillColor('black');
  doc.ellipse(x + 187, y+227, 27, 15).stroke();
  doc.ellipse(x + 187, y+227, 27, 15).fill('white').stroke();

  doc.fontSize(20);
  doc.fillColor('black');
  doc.font('server/BodoniUltraFLF-Italic.ttf')
  doc.text('65%', x + 162, y+215, { 
    width: 55,
    align: 'center'
  });
  doc.font('Times-Roman');
}

function drawStats(doc, x, y) {
  const sample = [[10, 58.3], [25, 52.4], [25, 63.7]];
  const height = 235;
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

  doc.save();
  doc.rotate(90);
  doc.translate(y, -x);
  let grad = doc.linearGradient(50, -statWidth-13, 50, -statWidth-2);
  grad.stop(0, 'black')
      .stop(1, 'white');
  doc.rect(88, -statWidth-13, 11, 11).fill(grad).stroke();
  doc.fillColor('black');
  doc.font('Times-Bold');
  doc.text('English', gap, 4, {width: width*2, align: 'center'});
  doc.text('Maths', (gap+width)*2, 4, {width: width*2, align: 'center'});
  doc.text('G.A.', width + (gap+width)*3, 4, {width: width*2, align: 'center'});
  doc.lineWidth(0.5);
  doc.rect(0, -statWidth-15, height, 15).stroke();
  doc.text('YOUR MARK :', 0, -statWidth-12, {width: 84, align: 'right'});
  doc.rect(88, -statWidth-13, 11, 11).stroke();
  doc.text('AVERAGE MARK :', 0, -statWidth-12, {width: 210, align: 'right'});
  doc.rect(214, -statWidth-13, 11, 11).stroke();
  doc.restore();

  doc.rect(x, y, statWidth, height).stroke();
}

function createPDF() {
  const X_START = 50;
  const X_END = 450;
  const HEIGHT = 710;
  let contextY = 0;
  const doc = new PDFDocument({
    size: 'A4', // 595.28 x 841.89 - ref: https://github.com/foliojs/pdfkit/blob/master/docs/paper_sizes.md
    margins : { // by default, all are 72
         top: 72, 
         bottom: 52,
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

  let grad = doc.linearGradient(X_START - 20, 80 + 30, X_START - 20, HEIGHT - 10);
  grad.stop(0, 'white')
      .stop(1, 'black');
  doc.lineWidth(1);
  doc.lineJoin('miter')
     .rect(X_START - 40.3, 77, 20.6, HEIGHT + 3)
     .fill(grad)
     .stroke();

  doc.image('server/jac_1.png', 9, 16, {width: 85});

  doc.lineWidth(1);
  const barStartX = 73;
  const barStartY = 60;
  const barWidth = 22;
  doc.polygon([barStartX, barStartY], [barStartX + barWidth, barStartY], [barStartX + barWidth, barStartY + 20], [barStartX + 10, barStartY + 20]).fill('black');

  doc.save();
  doc.font('Times-Bold');
  doc.fontSize(11);
  doc.fillColor('white');
  doc.rotate(-90)
   .text('James An College - Selective / O.C. / Scholarship / H.S.C. / V.C.E. / Q.C.S. / S.A.C.E. / T.E.E. Specialists - Australia\'s Leading Coaching College', -(HEIGHT+56), X_END+76);
  doc.restore();

  contextY += 38;
  doc.fontSize(21);
  doc.fillColor('black');
  doc.font('Times-Bold').text('Assessment Test Report', X_START + 45, contextY, {characterSpacing: 1});

  contextY += 26; // 69
  doc.fontSize(18);
  doc.fillColor('white');
  doc.font('Helvetica-Bold').text('JAMES AN COLLEGE', X_START + 45, contextY);

  contextY += 2; // 72
  doc.fontSize(11);
  doc.font('Times-Roman').text('Test Date : 3 Dec 2019', X_END - 95, contextY, { 
    width: 165,
    align: 'right'
  });

  contextY += 20; // 90
  doc.fontSize(10);
  doc.fillColor('black');
  doc.font('Times-Bold');
  doc.text('Head Office : 18 Ninth Ave, Campsie NSW 2914  ', X_START + 45, contextY, { continued: true, characterSpacing: 0.5 });
  doc.text('www.jamesancollege.com', {characterSpacing: 0});

  contextY += 32;
  doc.fontSize(10);
  doc.font('Times-Roman').text('Dear Kim Jeonghyeon,', 50, contextY, {characterSpacing: 0.3});

  contextY += 22; // 145
  doc.text('Thank you for participating in the James An College Year 4 assessment Test.', X_START, contextY);

  contextY += 17; // 162
  doc.text('Your marks are indicated below in detail. (Average socre for 3 subject/s : 20%)', X_START, contextY);


  // doc.lineWidth(1);
  // doc.lineJoin('miter')
  //    .rect(50, 175, 490, 55)
  //    .stroke();

  contextY += 16; // 179
  doc.font('Times-Bold');
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

  contextY += 265;
  drawTable(doc, X_START - 5, contextY);

  drawStats(doc, X_START + 235, contextY);

  contextY += 265;
  doc.font('Times-Roman');
  doc.text('Thank you once again for taking part in James An College Assessment Test.', X_START, contextY);

  contextY += 20;
  doc.text('JAC COM Victoria James An College', X_START, contextY);

  contextY += 33;
  doc.fillColor('white');
  doc.text('16C/77-79 Ashley St. Braybrook VIC 3019', X_START - 20, contextY);

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
