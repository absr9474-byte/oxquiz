// ----- Supabase 연동 -----
const SUPABASE_URL = 'https://vqaggjpxalwqrcmdsrbl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxYWdnanB4YWx3cXJjbWRzcmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNzgxOTEsImV4cCI6MjA5MDc1NDE5MX0.0ocsPrLn3MHiESSd94kZKvFx2eSYbUCQadCbPqlHEzk';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ----- 문제 데이터 -----
const quizData = [
  {
    id: 1,
    question: "우리 회사는 업무 목표를 세울 때, 단순한 성과 달성뿐 아니라<br>고객에게 어떤 경험과 가치를 제공하는지까지 연결해 고민하고 있다.",
    correctAnswer: "O",
    explanation: "매년 경영진이 제시하는 고객가치 지향점이 <br>각 부서와 개인 성과목표에 자연스럽게 녹아들 수 있도록, <br><b>고객가치혁신 목표를 각 사업부 및 팀 단위까지 연계하여 수립</b>하고 있습니다."
  },
  {
    id: 2,
    question: "고객만족도 지수(CSI)와 고객 VoC는 영업 조직에서 관리하는 지표이므로, <br>내 업무 개선과는 직접적인 관련이 없다.",
    correctAnswer: "X",
    explanation: "<b>고객만족도 지수와 고객 VoC</b>는 특정 조직만의 지표가 아니라 <b>모든 구성원이 함께 <br>활용해야 할 실행 기준</b>입니다. 고객과 중장기 파트너십 구축을 위해 고객만족도 지수를<br> 지속 모니터링하며 정기적으로 VoC를 수집∙공유하고 있습니다."
  },
  {
    id: 3,
    question: "프로젝트가 종료되면 고객 대응도 마무리되므로, <br>추가적인 제안이나 후속 고민은 꼭 진행할 필요는 없다.",
    correctAnswer: "X",
    explanation: "프로젝트 수행 중 발견한 고객 Painpoint에 기반해 <b>Reflection Memo를 작성</b>하며<br>우리가 제공한 서비스를 돌아보고 프로젝트를 보완/강화하기 위한 추가 제안을 고민합니다.<br> 이러한 <b>후제안 활동</b>은 우리만의 경쟁력이자 고객 중심 업무 프로세스입니다."
  },
  {
    id: 4,
    question: "고객 관련 의사결정은 경험과 직관도 중요하므로, <br>VoC나 행동 데이터 분석까지는 반드시 확인하지 않아도 된다.",
    correctAnswer: "X",
    explanation: "우리의 크고 작은 결정 뒤에는 고객의 생생한 데이터가 있습니다.<br><b>고객 Painpoint가 담긴 VoC</b>부터 <b>행동 데이터</b>까지, 고객과 관련된 모든 정보를<br>분석합니다. 현장에서 쌓은 우리의 경험에 더해 고객 데이터를 함께 고려할 때,<br>고객에게 더 나은 경험을 제공할 수 있습니다."
  },
  {
    id: 5,
    question: "고객 문제 해결에 활용할 수 있는 우리만의 AI Tool을 <br>자율적으로 활용하고 서로 공유하며 AI활용 역량을 강화하고 있습니다.",
    correctAnswer: "O",
    explanation: "고객 데이터를 활용하여 신속하고 정교한 솔루션을 도출할 수 있는 <b>Brand Agent</b>와<br><b>Survey Agent</b>, 업무효율을 극대화하는 <b>Deep Agent Builder</b> 등 우리만의<br>AI Tool이 마련되어 있습니다. 더불어 구성원이 AI Tool을 잘 활용할 수 있도록<br>워크샵과 교육 프로그램도 병행하고 있습니다."
  },
  {
    id: 6,
    question: "고객이 AE를 통해 직접 전달한 의견만 확인해도 충분하며, <br>비정기적으로 다양한 채널에서의 VoC를 수집하며 인사이트를 도출하고 있습니다.",
    correctAnswer: "X",
    explanation: "고객이 AE 담당자에게 직접 전하기 어려운 부분까지 수집하기 위해 <br> 매년 전사 차원의 <b>정기 고객만족도 조사</b>를 시행하고 있습니다. <br>다양한 채널을 통해 고객 데이터를 수집하며 우리가 제공하는 마케팅 서비스에 대한 <br>고객의 기대와 만족도를 촘촘하게 모니터링합니다."
  },
  {
    id: 7,
    question: "고객이 요청한 과업을 정확히 수행하는 것이 가장 중요하며, <br>최종 소비자(End-user) 데이터까지 분석하는 것은 필수는 아니다.",
    correctAnswer: "X",
    explanation: "고객의 타겟인 <b>최종 소비자(End-user)의 행동 데이터까지 폭넓게 수집하고 분석</b>합니다. <br>이렇게 입체적으로 분석된 데이터는 고객의 비즈니스 문제를 근본적으로 해결하는 <br>최적의 솔루션을 도출하는 밑거름이 됩니다."
  },
  {
    id: 8,
    question: "공유된 고객만족도 조사 결과는 참고용 자료이므로, <br>내 업무와 직접 관련이 있을 때만 확인하면 된다.",
    correctAnswer: "X",
    explanation: "고객만족도 조사 결과는 KI 커미티를 통해 경영진과 리더들에게 공유되며, <br>이후 구성원에까지 모두 공유되고 있어요. <br><b>고객의 소리(VoC)</b>는 <b>구성원 모두의 업무 나침반</b>입니다. <br>공유된 고객만족도 결과 속에서 우리 팀, 또는 나의 업무와 연결되는 피드백을 찾아<br>실제 개선으로 이어가 보세요."
  },
  {
    id: 9,
    question: "새로운 고객 경험을 제공할 수 있는 아이디어는 <br>담당 직무와 관련된 영역에서만 제안할 수 있다.",
    correctAnswer: "X",
    explanation: "고객 경험 혁신에는 경계가 없습니다. <br><b>고객을 위한 아이디어라면 누구나 자유롭게</b> 사업부 리더들이나 고객가치혁신팀에게<br>제안해주세요."
  },
  {
    id: 10,
    question: "우리는 고객 중심으로 조직과 역량을 연결하고 고객의 중장기 사업 성공까지 <br>함께 고민하는 든든한 파트너로서 고객과 함께 성장하고 있다.",
    correctAnswer: "O",
    explanation: "LG전자 등 <b>핵심 고객을 중심</b>으로 <b>전문지식/기능/역량을 통합적으로 연결</b>하고, <br>신속•맞춤형으로 대응하기 위해 노력하고 있습니다."
  }
];

// ----- 사업부 옵션 -----
const group2Options = {
  "BX부문": ["BX1", "BX2", "BX3", "BX4", "BX5", "CR담당", "엘베스트사업부", "Integrated Experience Center", "BX직속"],
  "CX부문": ["O2O마케팅사업부", "오디언스전략센터", "커머스AX CoE", "커머스AX사업1실", "커머스AX사업2실", "AX컨텐츠사업실", "컨텐츠마케팅사업실", "CX직속"],
  "LGCC": [],
  "CFO": [],
  "CHO": [],
  "CSO": [],
  "CEO직속": []
};

// ----- 상태 -----
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

// ----- 타이틀 → 퀴즈 시작 -----
$('#start-btn').onclick = () => {
  state = { current: 0, score: 0, userAnswers: [], finished: false };
  renderQuiz();
  showPage('quiz');
  startTimer();
};

function renderQuiz() {
  const q = quizData[state.current];
  $('#question-number').innerText = `${state.current + 1}/${quizData.length}`;
  $('#question-text').innerHTML = q.question;
  $('#answer-feedback').style.display = 'none';
  $('#next-btn').style.display = 'none';
  $$('.ox-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('selected');
  });
  resetTimer();
    // 버튼 텍스트 결정
  if (state.current === quizData.length - 1) {
    $('#next-btn').innerText = '결과 확인하기';
  } else {
    $('#next-btn').innerText = '다음 문제';
  }
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
  ? `<span class="feedback-head">정답입니다!</span><span class="feedback-explanation">${q.explanation}</span>`
  : `<span class="feedback-head" style="color:#b32131;">오답입니다!</span><span class="feedback-explanation">${q.explanation}</span>`;
  fb.className = isCorrect ? 'feedback-correct' : 'feedback-wrong';
  fb.style.display = 'flex';
  
  // ----- 다음 버튼 비활성화 후 7초 뒤 활성화 -----
  const nextBtn = $('#next-btn');
  nextBtn.disabled = true;                  // 비활성화(회색)
  nextBtn.style.display = 'block';
  nextBtn.style.background = "#b0b0b0";
  nextBtn.style.borderColor = "#b0b0b0";

  // 타이머 그라데이션 (left→right)
  let duration = 7000;    // 7초
  let interval = 40;      // ms
  let steps = Math.floor(duration / interval);
  let step = 0;

  const startColor = "#b0b0b0";
  const endColor = "#007BFF";

  function lerpGradient(t) {
    // t: 0~1, left 만큼 파란색 진행
    return `linear-gradient(90deg, ${endColor} 0%, ${endColor} ${t*100}%, ${startColor} ${t*100}%, ${startColor} 100%)`;
  }

  // 그라데이션 애니메이션
  const gradInterval = setInterval(() => {
    step++;
    const t = step / steps;
    nextBtn.style.background = lerpGradient(t);
    nextBtn.style.borderColor = t < 1 ? "#b0b0b0" : endColor;

    if (t >= 1) {
      nextBtn.disabled = false;
      nextBtn.style.background = endColor;
      nextBtn.style.borderColor = endColor;
      clearInterval(gradInterval);
    }
  }, interval);
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
    msg = "👏 잘했습니다! <br>우리 회사의 고객가치혁신 활동에 대해 훌륭하게 이해하고 계시네요.";
    $('#score-msg').style.color = "#27ae60";
  } else {
    msg = "😊 아쉽네요! <br>퀴즈를 다시 한번 풀어보며 우리 회사의 고객가치혁신 활동을 알아볼까요?";
    $('#score-msg').style.color = "#dc3545";
  }
  $('#score-msg').innerHTML = msg;
}

// 결과→ 응답자 입력폼
$('#to-submit-info-btn').onclick = () => {
  showPage('info');
  resetInfoForm();
};

$('#retry-btn').onclick = () => { showPage('title'); };

// ---- 응답자 정보 & 실행사례 제출 ----

function resetInfoForm() {
  $('#info-form').reset();
  $('#group2').innerHTML = `<option value="">먼저 부문을 선택하세요</option>`;
  $('#group2').disabled = false;
  $('#submit-success').style.display = 'none';
  $('#submit-info-btn').style.display = 'inline-block';
}

// 부문 => 사업부 연동
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
  const group1 = $('#group1').value;
  const group2Elem = $('#group2');
  const group2 = group2Elem.disabled ? '' : group2Elem.value;
  const username = $('#username').value.trim();
  const subjective = $('#subjective').value.trim();

  if(group1 === "") { alert("부문을 선택해 주세요!"); return; }
  if(!group2Elem.disabled && group2 === "") { alert("사업부를 선택해 주세요!"); return; }
  if(!username) { alert("이름을 입력해 주세요!"); return; }
  if(!subjective) { alert("고객가치 실행사례를 입력해 주세요!"); return; }

  $('#submit-info-btn').disabled = true;
  $('#submit-info-btn').innerText = "제출 중…";
  try {
    const { data, error } = await supabase.from('quiz_result').insert([
      {
        group1, 
        group2,
        username,
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
