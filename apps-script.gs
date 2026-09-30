/**
 * 마법 원정대: 원과 부채꼴 — 구글 시트 수신용 Apps Script
 *
 * 설치 방법
 * 1. 구글 시트를 새로 만들고 [확장 프로그램] > [Apps Script]를 엽니다.
 * 2. 이 파일 내용을 모두 붙여 넣고 저장합니다.
 * 3. [배포] > [새 배포] > 유형: 웹 앱
 *    - 실행 사용자: 나
 *    - 액세스 권한: 모든 사용자
 * 4. 발급된 웹 앱 URL(…/exec)을 index.html의 GOOGLE_SHEET_API_URL에 넣습니다.
 *
 * 시트 구성
 * - '학습기록': 받은 기록을 한 줄씩 모두 쌓습니다.
 * - '학생별현황': 학번마다 가장 최근 상태 한 줄만 유지합니다.
 */
const LOG_SHEET = '학습기록';
const SUMMARY_SHEET = '학생별현황';
const EVENT_NAMES = { login: '입장', progress: '문제 풀이', complete: '원정 완주', manual: '직접 보냄' };

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const log = getSheet_(ss, LOG_SHEET,
      ['받은 시각', '구분', '학번', '푼 문제 수', '정답 문제 수', '도토리', '칭찬도장', '누적 도토리', '학습 일시'], 3);
    log.appendRow([
      new Date(),
      EVENT_NAMES[data.event] || data.event || '',
      String(data.studentId || ''),
      Number(data.solvedCount) || 0,
      Number(data.correctCount) || 0,
      Number(data.acorns) || 0,
      Number(data.stamps) || 0,
      Number(data.totalAcorns) || 0,
      data.timestamp || ''
    ]);

    const sum = getSheet_(ss, SUMMARY_SHEET,
      ['학번', '푼 문제 수', '정답 문제 수', '도토리', '칭찬도장', '완주 여부', '최근 학습 일시'], 1);
    const row = [
      String(data.studentId || ''),
      Number(data.solvedCount) || 0,
      Number(data.correctCount) || 0,
      Number(data.acorns) || 0,
      Number(data.stamps) || 0,
      (Number(data.solvedCount) || 0) >= 20 ? '완주' : '',
      data.timestamp || ''
    ];
    const ids = sum.getLastRow() > 1 ? sum.getRange(2, 1, sum.getLastRow() - 1, 1).getValues().flat().map(String) : [];
    const idx = ids.indexOf(row[0]);
    if (idx >= 0) sum.getRange(idx + 2, 1, 1, row.length).setValues([row]);
    else sum.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// 브라우저에서 웹 앱 URL을 열면 연결 상태를 확인할 수 있습니다.
function doGet() {
  return json_({ ok: true, message: '마법 원정대 기록 수신기가 작동 중이에요.' });
}

function getSheet_(ss, name, headers, idCol) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#e6f1d6');
    sh.setFrozenRows(1);
    sh.getRange(1, idCol, sh.getMaxRows(), 1).setNumberFormat('@'); // 학번을 텍스트로
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
