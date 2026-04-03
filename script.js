// ----- [Supabase 연동 정보 입력] -----
const SUPABASE_URL = 'https://xxxxxxxx.supabase.co'; // 프로젝트별로 변경
const SUPABASE_KEY = 'eyJ...'; // anon public key 복사(위 설명 참고)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ----- [퀴즈 문제 데이터 샘플] -----
const quizData = [
  {
    id: 1,
    question: "우리 회사는 목표설정을 할 때, 후제안 진행률, 고객만족도 점수와 같은 고객관련 지표도 포함하여 수립해요.",
    correctAnswer: "O",
    explanation: "중장기 파트너십 기반 등 상세 내용..."
  },
  {
    id: 2,
    question: "우리 회사는 고객만족도와 더불어 다양한 유형의 고객평가지표를 지속적으로 관리해요.",
    correctAnswer: "O",
    explanation: "2023년 고객만족도 조사를 도입하여..."
  },
  {
    id: 3,
    question: "우리 회사는 프로젝트가 종료되면, 리플렉션 메모(RM)를 작성하고 후제안을 하는 것처럼 고객가치 중심으로 일하는 방식을 업무프로세스로 체계화하고 있어요.",
    correctAnswer: "O",
    explanation: "우리의 일은 고객 Pain Point에서..."
  }
];

const group2Options = {
  "BX부문": ["BX1", "BX2", "BX3", "BX4", "BX5", "CR담당", "엘베스트사업부", "Integrated Experience Center", "BX직속"],
  "CX부문": ["O2O마케팅사업부", "오디언스전략센터", "커머스AX사업1실", "커머스AX사업2실", "AX컨텐츠사업실", "컨텐츠마케팅사업실", "CX직속"],
  "LGCC": [],
  "CFO": [],
  "CHO": [],
  "CSO": [],
  "CEO직속": []
};

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
  result: $('#result-page'),
  info: $('#user-info-page')
};

function showPage(page) {
  Object.values(pages).forEach(sec => sec.style.display = 'none');
  pages[page].style.display = 'flex';
}

// ---- 타이틀 → 첫 문제 시작 ----
$('#start-btn').onclick = () => {
  state = { current: 0, score: 0, userAnswers: [], finished: false };
  renderQuiz();
  showPage('quiz');
  startTimer();
};

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

$('#next-btn').onclick = () => {
  state.current++;
  if (state.current < quizData.length) {
    renderQuiz();
    startTimer();
  } else {
    state.finished = true;
    showResult();
    showPage('result');
  }
};

function showResult() {
  $('#score-summary').innerText = `총 점수: ${state.score}/${quizData.length}`;
  const percent = (state.score / quizData.length) * 100;
  let msg;
  if (percent >= 80) {
    msg = "👏 잘했습니다! 고객가치에 대해 훌륭하게 이해하고 계시네요.";
    $('#score-msg').style.color = "#27ae60";
  } else {
    msg = "😊 조금만 더! 고객가치 혁신을 위한 추가학습을 추천합니다.";
    $('#score-msg').style.color = "#dc3545";
  }
  $('#score-msg').innerText = msg;
}

// 결과→ 응답자 입력폼 페이지 이동
$('#to-submit-info-btn').onclick = () => {
  showPage('info');
  resetInfoForm();
};

$('#retry-btn').onclick = () => { showPage('title'); };

// ---- 응답자 정보 & 실행사례 제출 ----

function resetInfoForm() {
  $('#info-form').reset();
  $('#group2').innerHTML = `<option value="">먼저 부문을 선택하세요</option>`;
  $('#submit-success').style.display = 'none';
}

// 부문=>사업부 연동
$('#group1').addEventListener('change', function() {
  const v = this.value;
  const options = group2Options[v] || [];
  const group2 = $('#group2');
  group2.innerHTML = '';
  if(options.length) {
    group2.disabled = false;
    group2.required = true;
    for(const op of options) {
      const optEl = document.createElement('option');
      optEl.value = op;
      optEl.innerText = op;
      group2.appendChild(optEl);
    }
    group2.insertAdjacentHTML('afterbegin', `<option value="">사업부 선택</option>`);
  } else {
    group2.disabled = true;
    group2.required = false;
    group2.innerHTML = `<option value="">선택없음</option>`;
  }
});

// 제출 처리
$('#info-form').onsubmit = async function(e){
  e.preventDefault();
  // 유효성 검증
  const group1 = $('#group1').value;
  const group2 = $('#group2').disabled ? '' : $('#group2').value;
  const username = $('#username').value.trim();
  const number = $('#number').value.trim();
  const subjective = $('#subjective').value.trim();

  if(group1 === "") { alert("부문을 선택해 주세요!"); return; }
  if(!$('#group2').disabled && group2 === "") { alert("사업부를 선택해 주세요!"); return; }
  if(!username) { alert("이름을 입력해 주세요!"); return; }
  if(!/^[0-9]{10,11}$/.test(number)) { alert("전화번호를 올바르게 입력해 주세요! (예: 01012345678)"); return; }
  if(!subjective) { alert("고객가치 실행사례를 입력해 주세요!"); return; }

  // 데이터 insert
  $('#submit-info-btn').disabled = true;
  $('#submit-info-btn').innerText = "제출 중…";

  try {
    const { data, error } = await supabase.from('quiz_result').insert([
      {
        group1, 
        group2,
        username,
        number,
        score: state.score,
        subjective
      }
    ]);
    if (error) {
      alert('데이터 저장 오류: ' + error.message);
      $('#submit-info-btn').disabled = false;
      $('#submit-info-btn').innerText = "제출";
      return;
    }
    $('#submit-success').style.display = 'block';
    $('#submit-info-btn').style.display = 'none';
  } catch(e) {
    alert("서버 오류! 다시 시도해 주세요.");
    $('#submit-info-btn').disabled = false;
    $('#submit-info-btn').innerText = "제출";
  }
};

showPage('title');

// ---- 타이머 ----
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