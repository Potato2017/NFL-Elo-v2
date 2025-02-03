function updateElo() {
  ss = SpreadsheetApp.getActiveSpreadsheet();
  data = ss.getSheetByName('data sheet (nfl)');
  games = ss.getSheetByName('game sheet (nfl)');
  config = ss.getSheetByName('config (nfl)')
  let rows = games.getLastRow();
  let range = games.getRange(1, 1, rows, 5);
  let values = range.getValues();
  var rankings = {};
  const NFLSTD = config.getRange("F3").getValue();
  const SCALE = config.getRange("D3").getValue();
  const CALCTYPE = config.getRange("E3").getValue();
  const PREDICTIONS = config.getRange("A3").getValue() === "Yes"
  const PREDICTIONSTART = config.getRange("B3").getValue();
  
  for (var i = 0; i < values.length; i++) {
    let row = values[i]
    let t1 = row[1]
    let t2 = row[3]
    if (t1 === "" || t2 === "") break;
    if (!Object.keys(rankings).includes(t1)) rankings[t1] = [1500, 1500];
    if (!Object.keys(rankings).includes(t2)) rankings[t2] = [1500, 1500];
    let ro1 = rankings[t1][0]
    let rd1 = rankings[t1][1]
    let ro2 = rankings[t2][0]
    let rd2 = rankings[t2][1]
    let s1 = parseInt(row[2])
    let s2 = parseInt(row[4])
    let qo1 = Math.pow(10, ro1 / 400)
    let qd1 = Math.pow(10, rd1 / 400)
    let qo2 = Math.pow(10, ro2 / 400)
    let qd2 = Math.pow(10, rd2 / 400)
    let cwo1 = qo1 / (qo1 + qd2)
    let cwo2 = qo2 / (qd1 + qo2)
    let cwd1 = 1 - cwo2
    let cwd2 = 1 - cwo1
    var ro1c = 0
    var ro2c = 0
    var rd1c = 0
    var rd2c = 0
    let r1 = (ro1 + rd1) / 2
    let r2 = (ro2 + rd2) / 2
    let q1 = Math.pow(10, r1 / 400)
    let q2 = Math.pow(10, r2 / 400)
    let cw1 = q1 / (q1 + q2)
    let cw2 = q2 / (q1 + q2)
    if (row[2] !== "") {
      if (CALCTYPE === "Baseline Linear") {
        if (s1 > NFLSTD) {
          ro1c = SCALE * (s1 - NFLSTD) * (1 - cwo1)
          rd2c = SCALE * (s1 - NFLSTD) * (0 - cwd2)
        } else {
          ro1c = SCALE * (s1 - NFLSTD) * cwo1
          rd2c = -SCALE * (s1 - NFLSTD) * (1 - cwd2)
        }
        if (s2 > NFLSTD) {
          ro2c = SCALE * (s2 - NFLSTD) * (1 - cwo2)
          rd1c = SCALE * (s2 - NFLSTD) * (0 - cwd1)
        } else {
          ro2c = SCALE * (s2 - NFLSTD) * cwo2
          rd1c = -SCALE * (s2 - NFLSTD) * (1 - cwd1)
        }
      } else if (CALCTYPE === "Baseline Logarithmic") {
        if (s1 > NFLSTD) {
          ro1c = SCALE * logcalc(s1, NFLSTD) * (1 - cwo1)
          rd2c = SCALE * logcalc(s1, NFLSTD) * (0 - cwd2)
        } else {
          ro1c = SCALE * logcalc(s1, NFLSTD) * cwo1
          rd2c = -SCALE * logcalc(s1, NFLSTD) * (1 - cwd2)
        }
        if (s2 > NFLSTD) {
          ro2c = SCALE * logcalc(s2, NFLSTD) * (1 - cwo2)
          rd1c = SCALE * logcalc(s2, NFLSTD) * (0 - cwd1)
        } else {
          ro2c = SCALE * logcalc(s2, NFLSTD) * cwo2
          rd1c = -SCALE * logcalc(s2, NFLSTD) * (1 - cwd1)
        }
      } else if (CALCTYPE === "Score-Correction Linear") {
        if (s1 > predictScore(cwo1)) {
          ro1c = SCALE * (s1 - predictScore(cwo1)) * (1 - cwo1)
          rd2c = SCALE * (s1 - predictScore(cwo1)) * (0 - cwd2)
        } else {
          ro1c = SCALE * (s1 - predictScore(cwo1)) * cwo1
          rd2c = -SCALE * (s1 - predictScore(cwo1)) * (1 - cwd2)
        }
        if (s2 > predictScore(cwo2)) {
          ro2c = SCALE * (s2 - predictScore(cwo2)) * (1 - cwo2)
          rd1c = SCALE * (s2 - predictScore(cwo2)) * (0 - cwd1)
        } else {
          ro2c = SCALE * (s2 - predictScore(cwo2)) * cwo2
          rd1c = -SCALE * (s2 - predictScore(cwo2)) * (1 - cwd1)
        }
      } else if (CALCTYPE === "Score-Correction Logarithmic") {
        if (s1 > predictScore(cwo1)) {
          ro1c = SCALE * logcalc(s1, predictScore(cwo1)) * (1 - cwo1)
          rd2c = SCALE * logcalc(s1, predictScore(cwo1)) * (0 - cwd2)
        } else {
          ro1c = SCALE * logcalc(s1, predictScore(cwo1)) * cwo1
          rd2c = -SCALE * logcalc(s1, predictScore(cwo1)) * (1 - cwd2)
        }
        if (s2 > predictScore(cwo2)) {
          ro2c = SCALE * logcalc(s1, predictScore(cwo2)) * (1 - cwo2)
          rd1c = SCALE * logcalc(s1, predictScore(cwo2)) * (0 - cwd1)
        } else {
          ro2c = SCALE * logcalc(s1, predictScore(cwo2)) * cwo2
          rd1c = -SCALE * logcalc(s1, predictScore(cwo2)) * (1 - cwd1)
        }
      }
      rankings[t1] = [ro1 + ro1c, rd1 + rd1c]
      rankings[t2] = [ro2 + ro2c, rd2 + rd2c]
    }
    if (PREDICTIONS && i >= PREDICTIONSTART - 1) {
      games.getRange(i+1, 7).setValue(predictScore(cwo1));
      games.getRange(i+1, 8).setValue(predictScore(cwo2));
      games.getRange(i+1, 9).setValue(cw1);
      games.getRange(i+1, 10).setValue(cw2);
      games.getRange(i+1, 11).setValue(cw1 > cw2 ? t1 : t2);
    }
  }
  for (i = 0; i < Object.keys(rankings).length; i++) {
    let key = Object.keys(rankings)[i];
    data.getRange(i+1, 1).setValue(key);
    data.getRange(i+1, 3).setValue(rankings[key][0]);
    data.getRange(i+1, 5).setValue(rankings[key][1]);
    data.getRange(i+1, 7).setValue((rankings[key][0] + rankings[key][1]) / 2);
  }
}
function predictScore(cwo) {
  return Math.min(Math.max(21.6 + 10 * Math.tan(-Math.atan(-21.6)*2*(cwo-0.5)), 0), 50)
}
function logcalc(score, baseline) {
  return Math.abs(score - baseline)/(score - baseline)*Math.log10(1+Math.abs(score - baseline));
}
function clearData() {
  ss = SpreadsheetApp.getActiveSpreadsheet();
  data = ss.getSheetByName('data sheet (nfl)');
  let rows = data.getLastRow();
  let range = data.getRange(1, 1, rows, 7);
  range.clear()
}
