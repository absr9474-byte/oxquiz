// script.js

const quizData = [
  {
    id: 1,
    question: "우리 회사는 목표설정을 할 때, 후제안 진행률, 고객만족도 점수와 같은 고객관련 지표도 포함하여 수립해요.",
    correctAnswer: "O",
    explanation: "중장기 파트너십 기반으로 고객의 성공과 성장을 함께 하는 마케팅 크리에이티브 리딩 파트너라는 고객가치지향점을 설정하고, 2024년부터 조직의 \"사업목표\"(재무목표 및 조직별 성과지표)를 \"수립할 때, 고객가치 지향점 달성\"을 고려하고 있습니다. 이 방향은 모든 경영진뿐만 아니라 고객을 직접 응대하는 구성원에게도 적용되어, 전사 대부분 구성원의 성과지표 및 주요 과제에 고객가치혁신 목표가 연계되어 있습니다."
  },
  {
    id: 2,
    question: "우리 회사는 고객만족도와 더불어 HSAD 추천지수(NPS), 경쟁사 이용 경험에 대한 평가 등 다양한 유형의 고객평가지표를 지속적으로 모니터링하고 관리해요.",
    correctAnswer: "O",
    explanation: "2023년 고객만족도 조사를 도입하여, 매년 고객만족도, HSAD 추천의향(NPS), 경쟁지표 등을 정기적으로 파악하고 성과지표로 관리하고 있습니다. 이러한 평가지표는 경영진뿐 아니라, 고객을 직접 응대하는 구성원의 평가에도 반영되며, 고객에게 큰 감동과 만족을 선사한 프로젝트는 Dash Day를 통해 포상하고 있습니다."
  },
  {
    id: 3,
    question: "우리 회사는 프로젝트가 종료되면, 리플렉션 메모(RM)를 작성하고 후제안을 하는 것처럼 고객가치 중심으로 일하는 방식을 업무프로세스로 체계화하고, 조직문화로도 자리잡아 가고 있어요.",
    correctAnswer: "O",
    explanation: "우리의 일은 고객 Pain Point에서 시작해 고객감동으로 마무리 됩니다. 프로젝트의 중심에는 언제나 고객이 있으며, 모든 의사결정은 고객의 니즈, 고객의 소리(VoC)와 같은 고객 정보에 기반하여 이루어집니다. 고객중심 일하는 방식은 우리가 늘 실천해오던 것으로 우리 몸과 조직에 자연스럽게 배여 있습니다."
  }
];

// 상태 관리 객체
let state = {
  current: 0,
  score: 0,
  userAnswers: [],
  finished: false
};

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

const pages = {
  title: $('#title-page'),
  quiz: $('#quiz-page'),
  result: $('#result-page')
};

function showPage(page) {
  Object.values(pages).forEach(sec => sec.style.display = 'none');
  pages[page].style.display = 'flex';
}

// 타이틀 → 첫 문제 시작
$('#start-btn').onclick = () => {
  state = { current: 0, score: 0, userAnswers: [], finished: false };
  renderQuiz();
  showPage('quiz');
  startTimer();
};

// 퀴즈 화면 렌더
function renderQuiz() {
  const q = quizData[state.current];
  $('#question-number').innerText = `${state.current + 1}/${quizData.length}`;
  $('#question-text').innerText = q.question;
  $('#answer-feedback').style.display = 'none';
  $('#next-btn').style.display = 'none';
  $$('.ox-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('selected');
  });
  resetTimer();
}

// O/X 버튼 클릭 이벤트
$$('.ox-btn').forEach(btn => {
  btn.onclick = function() {
    handleAnswer(btn.dataset.answer, btn);
  };
});

function handleAnswer(userAns, btnEl) {
  $$('.ox-btn').forEach(b => b.disabled = true);
  if(btnEl) btnEl.classList.add('selected');
  const q = quizData[state.current];
  const isCorrect = userAns === q.correctAnswer;
  state.userAnswers[state.current] = userAns;
  if (isCorrect) state.score++;
  const fb = $('#answer-feedback');
  fb.innerHTML = isCorrect
    ? `정답입니다! <br><span style="font-weight:bold">${q.explanation}</span>`
    : `오답입니다! <br><span style="color:#b32131; font-weight:bold">${q.explanation}</span>`;
  fb.className = isCorrect ? 'feedback-correct' : 'feedback-wrong';
  fb.style.display = 'flex';
  $('#next-btn').style.display = 'block';
  stopTimer();
}

// 다음 문제 버튼
$('#next-btn').onclick = () => {
  state.current++;
  if (state.current < quizData.length) {
    renderQuiz();
    startTimer();
  } else {
    showResult();
    showPage('result');
  }
};

// 결과 페이지
function showResult() {
  $('#score-summary').innerText = `총 점수: ${state.score}/${quizData.length}`;
  let trs = '<tr><th>문항</th><th>내 답</th><th>정답</th><th>결과</th></tr>';
  quizData.forEach((q, i) => {
    const ua = state.userAnswers[i] || '-';
    const ok = ua === q.correctAnswer;
    trs += `<tr>
      <td>${i + 1}</td>
      <td>${ua}</td>
      <td>${q.correctAnswer}</td>
      <td>${ok ? 'O' : 'X'}</td>
    </tr>`;
  });
  $('#result-table').innerHTML = trs;
  // 사례 입력 영역, 완료멘트 숨김
  $('#share-area').style.display = 'none';
  $('#share-success').style.display = 'none';
  $('#share-input').value = '';
}

// "다시 풀기" => 타이틀 복귀
$('#retry-btn').onclick = () => {
  showPage('title');
};

// ===============================
// 사례 공유 기능
$('#share-btn').onclick = () => {
  $('#share-area').style.display = 'flex';
  $('#share-success').style.display = 'none';
  $('#share-input').focus();
};

// 주관식 제출
$('#submit-share-btn').onclick = () => {
  const txt = $('#share-input').value.trim();
  if(!txt) {
    alert('사례 내용을 입력해주세요!');
    $('#share-input').focus();
    return;
  }
  $('#share-success').style.display = 'block';
  $('#share-input').value = '';
};
// ===============================

// 타이머 (15초)
let timer = null, timeTotal = 15, timeLeft = 15;
function startTimer() {
  timeLeft = timeTotal;
  updateTimerBar();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerBar();
    if (timeLeft <= 0) {
      stopTimer();
      handleAnswer('', null); // 무응답 처리: 오답 처리
    }
  }, 1000);
}
function stopTimer() {
  clearInterval(timer);
}
function resetTimer(){
  stopTimer();
  $('#timer-bar').style.width = '100%';
}
function updateTimerBar() {
  $('#timer-bar').style.width = `${(timeLeft / timeTotal) * 100}%`;
}

// 최초 진입 시 타이틀
showPage('title');