import passport from 'passport';
import PDFDocument from 'pdfkit';
import fs from 'fs';

import User from '../models/user';
import TestResult from '../models/test_result';
import Reference from '../models/reference';

function drawTable(doc, title, data, x, y) {
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
  doc.font('Times-Bold').text(title, x, y + 5 + 4, { 
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
  const cellWidths = [15, 20, 8, 20, 27, 16, 80];
  let tempY;
  
  if(!data) return;

  for(let i=0; i<20; i++) {
    xStart = x+8;
    tempY = y+40+8.5*i;
    doc.text(i+1+'.', xStart, tempY, { 
      width: cellWidths[0],
      align: 'right'
    });
    
    xStart += cellWidths[0] + 2;
    doc.text(data[i].input || ' ', xStart, tempY, { 
      width: cellWidths[1],
      align: 'right'
    });

    xStart += cellWidths[1];
    if(data[i].correct) {
      doc.lineWidth(1);
      doc.lineCap('butt')
       .moveTo(xStart + 5, tempY + 2.5)
       .lineTo(xStart + 6.5, tempY + 4)
       .lineTo(xStart + 8.5, tempY)
       .stroke();
    } 
    else {
      doc.lineWidth(1.5);
      doc.lineCap('butt')
       .moveTo(xStart + 5, tempY + 1)
       .lineTo(xStart + 8.5, tempY + 4.5)
       .moveTo(xStart + 8.5, tempY + 1)
       .lineTo(xStart + 5, tempY + 4.5)
       .stroke();
    }

    xStart += cellWidths[2];
    doc.text(data[i].answer, xStart, tempY, { 
      width: cellWidths[3],
      align: 'right'
    });
    
    xStart += cellWidths[3];
    doc.text(data[i].average + '%', xStart, tempY, { 
      width: cellWidths[4],
      align: 'right'
    });
    
    xStart += cellWidths[4];

    xStart += cellWidths[5];
    doc.text(data[i].topic, xStart, tempY, { 
      width: cellWidths[6],
      align: 'left'
    });

  }
  const count = data.map(x => x.correct).reduce((a, sum) => a + sum, 0);
  const average = count / data.length * 100
  doc.fontSize(11);
  doc.text(`Score : ${count}/20 =`, x + 30, y+222, { 
    width: 125,
    align: 'right',
    characterSpacing: 0.5
  });
  doc.lineWidth(0.5);
  doc.fillColor('black');
  doc.ellipse(x + 187, y+227, 27, 15).stroke();
  doc.ellipse(x + 187, y+227, 27, 15).fill('white').stroke();

  doc.fontSize(20);
  doc.fillColor('black');
  doc.font('server/BodoniUltraFLF-Italic.ttf')
  doc.text(average + '%', x + 162, y+215, { 
    width: 55,
    align: 'center',
    characterSpacing: 0.5
  });
  doc.font('Times-Roman');
}

function drawStats(doc, data, x, y) {
  const sample = [data.scores['english'], data.scores['math'], data.scores['general']].filter(x => x);
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
  doc.fontSize(11);
  doc.fillColor('black');
  doc.font('Times-Bold');
  doc.text('English', gap, 4, {width: width*2, align: 'center'});
  doc.text('Maths', (gap+width)*2, 4, {width: width*2, align: 'center'});
  doc.text('G.A.', width + (gap+width)*3, 4, {width: width*2, align: 'center'});

  doc.lineWidth(0.5);
  doc.rect(0, -statWidth-15, height, 15).stroke();
  doc.text('YOUR MARK :', 2, -statWidth-12, {width: 86, align: 'right', characterSpacing: 0.4});
  doc.text('AVERAGE MARK :', 2, -statWidth-12, {width: 212, align: 'right', characterSpacing: 0.4});
  doc.rect(216, -statWidth-13, 11, 11).stroke();
  let grad = doc.linearGradient(50, -statWidth-13, 50, -statWidth-2);
  grad.stop(0, 'black')
      .stop(1, 'white');
  doc.rect(90, -statWidth-13, 11, 11).fill(grad).stroke();
  doc.rect(90, -statWidth-13, 11, 11).stroke();
  doc.restore();

  doc.rect(x, y, statWidth, height).stroke();
}

async function createExamData(testResult) {
  const data = {
    grade : testResult.student.grade,
    version: testResult.version || 'init',
    averages: {},
    scores: {},
    counts: {},
  }
  let total = 0;
  const references = await Reference.find({version: data.version, grade: data.grade}).lean();
  for(let reference of references) {
    const title = reference.title;
    data.averages[title] = reference.average;
    let answers = testResult.answers[title];
    data[title] = [...reference.answers];
    let count = 0;
    for(let i=0; i<data[title].length; i++) {
      data[title][i].input = answers[i];
      data[title][i].correct = answers[i] === data[title][i].answer;
      count += data[title][i].correct;
    }
    data.scores[title] = [count / answers.length * 100, reference.average];
    data.counts[title] = count;
    total += count / answers.length * 100;
  }
  data.total = total / Object.keys(data.scores).length;
  return data;
}

async function createPDF(user, student, testResult) {
  const result = await createExamData(testResult);
  const X_START = 65;
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
  doc.pipe(fs.createWriteStream(`./public/assets/${testResult._id}.pdf`));
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

  doc.image('server/jac_1.png', X_START - 41, 16, {width: 85});

  doc.lineWidth(1);
  const barStartX = X_START + 23;
  const barStartY = 60;
  const barWidth = 22;
  doc.polygon([barStartX, barStartY], [barStartX + barWidth, barStartY], [barStartX + barWidth, barStartY + 20], [barStartX + 10, barStartY + 20]).fill('black');

  doc.save();
  doc.font('Times-Bold');
  doc.fontSize(11);
  doc.fillColor('white');
  doc.rotate(-90)
   .text('James An College - Selective / O.C. / Scholarship / H.S.C. / V.C.E. / Q.C.S. / S.A.C.E. / T.E.E. Specialists - Australia\'s Leading Coaching College', 
    -(HEIGHT+56), X_START + 400 + 76);
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
  const today = new Date();
  doc.fontSize(11);
  doc.font('Times-Roman').text(`Test Date : ${today.getDate()} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`, X_START, contextY, { 
    width: X_END + 20,
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
  doc.font('Times-Roman').text('Dear ' + student.name, X_START, contextY, {characterSpacing: 0.3});

  contextY += 22; // 145
  doc.text(`Thank you for participating in the James An College Year ${student.grade} assessment Test.`, X_START, contextY);

  contextY += 17; // 162
  doc.text(`Your marks are indicated below in detail. (Average score for ${Object.keys(result.scores).length} subject/s : ${result.total.toFixed(2)}%)`, X_START, contextY);


  // doc.lineWidth(1);
  // doc.lineJoin('miter')
  //    .rect(50, 175, 490, 55)
  //    .stroke();

  contextY += 16; // 179
  doc.font('Times-Bold');
  doc.text(`English Mark : ${result.scores['english'][0]}%`, X_START, contextY, { 
    width: X_END,
    align: 'left'
  });
  doc.text(`Mathematics Mark : ${result.scores['math'][0]}%`, X_START, contextY, { 
    width: X_END,
    align: 'center'
  });
  doc.text(`General Ability Mark : ${result.scores['general']? result.scores['general'][0] + '%' : 'N/A'}`, X_START, contextY, { 
    width: X_END,
    align: 'right'
  });

  contextY += 20;

  doc.lineWidth(1);
  drawTable(doc, 'English', result.english, X_START - 5, contextY);
  drawTable(doc, 'Mathematics', result.math, X_START + 235, contextY);

  contextY += 265;
  drawTable(doc, 'General Ability', result.general, X_START - 5, contextY);

  drawStats(doc, result, X_START + 235, contextY);

  contextY += 265;
  doc.font('Times-Roman');
  doc.text('Thank you once again for taking part in James An College Assessment Test.', X_START, contextY);

  contextY += 20;
  doc.text(user.branch.name + ' Victoria James An College', X_START, contextY);

  contextY += 33;
  doc.fillColor('white');
  doc.text(user.branch.location, X_START - 20, contextY);

  doc.end();

  return testResult._id;
}

export function pdf(req, res) {
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

export async function exam(req, res) {
  const exam = await TestResult.findOne({_id: req.params.examId}).lean();
  res.json(exam);
}

export async function examList(req, res) {
  const user = req.user;
  const results = await TestResult.find({branchName: user.branch.name}).limit(10).sort({_id: -1}).lean();
  res.json(results);
}

export async function submitExam(req, res) {
  const { student, answers } = req.body;
  const user = req.user;
  student.name = student.firstName + ' ' + student.familyName;
  student.grade = student.grade.split(' ')[1];
  const testResult = new TestResult({student, answers, branchName: user.branch.name});
  await testResult.save();
  const pdf = await createPDF(user, student, testResult);
  res.json({pdf: testResult._id, result: 'ok'});
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
  exam,
  submitExam,
  examList
};
