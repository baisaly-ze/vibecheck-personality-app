const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute(
        "data-theme",
        current === "dark" ? "light" : "dark"
    );
};

const questions = [
    {
        text: "You're at a crowded party and your social battery just died. What do you do?",
        options: [
            { text: "Irish exit. I'm gone without a word.", type: "Observer" },
            { text: "Find the host's pet and hang out with it.", type: "Dreamer" },
            { text: "Start cleaning up so I don't have to talk.", type: "Creator" },
            { text: "Make sure my friends are okay, then head out.", type: "Guide" }
        ]
    },
    {
        text: "You've got a free Saturday with absolutely zero plans. What happens?",
        options: [
            { text: "Deep dive into a random topic on Wikipedia.", type: "Observer" },
            { text: "Put on music, lay around, and daydream.", type: "Dreamer" },
            { text: "Finally work on that side project.", type: "Creator" },
            { text: "Text someone to grab a coffee.", type: "Guide" }
        ]
    },
    {
        text: "You're stuck in a messy situation at work/school. What's your first move?",
        options: [
            { text: "Step back. Analyze what went wrong logically.", type: "Observer" },
            { text: "Stress out, then imagine the ideal fix.", type: "Dreamer" },
            { text: "Just start trying things until something works.", type: "Creator" },
            { text: "Check on everyone else involved first.", type: "Guide" }
        ]
    },
    {
        text: "Honestly, what's your most annoying habit?",
        options: [
            { text: "I overthink things to the point of ruining them.", type: "Observer" },
            { text: "I zone out in the middle of conversations.", type: "Dreamer" },
            { text: "I can't relax. I always feel like I should be busy.", type: "Creator" },
            { text: "I offer unsolicited advice when people just want to vent.", type: "Guide" }
        ]
    },
    {
        text: "What makes you instantly lose respect for someone?",
        options: [
            { text: "Refusing to look at facts.", type: "Observer" },
            { text: "Lacking any sense of imagination.", type: "Dreamer" },
            { text: "Being all talk and zero action.", type: "Creator" },
            { text: "Being mean to service workers.", type: "Guide" }
        ]
    },
    {
        text: "You're feeling incredibly burnt out. What brings you back?",
        options: [
            { text: "Learning something completely new.", type: "Observer" },
            { text: "Escaping into a really good movie or game.", type: "Dreamer" },
            { text: "Making something with my hands.", type: "Creator" },
            { text: "An honest conversation with someone I trust.", type: "Guide" }
        ]
    },
    {
        text: "Someone aggressively disagrees with you. How do you handle it?",
        options: [
            { text: "Pick apart their argument rationally.", type: "Observer" },
            { text: "Smile, nod, and mentally leave the room.", type: "Dreamer" },
            { text: "Debate them. I enjoy the back-and-forth.", type: "Creator" },
            { text: "Try to figure out why they're upset.", type: "Guide" }
        ]
    },
    {
        text: "If you could only be remembered for one thing, what is it?",
        options: [
            { text: "Being the smartest person in the room when it mattered.", type: "Observer" },
            { text: "Having a totally unique perspective on life.", type: "Dreamer" },
            { text: "Leaving behind something tangible that I built.", type: "Creator" },
            { text: "Being the person everyone could count on.", type: "Guide" }
        ]
    }
];

const personalities = {
    "Observer": {
        title: "The Overthinker",
        description: "You notice EVERYTHING. Like… stuff people didn’t even mean to show you.",
        realityCheck: "You’re not ‘deep’ all the time — sometimes you’re just stuck in your head for no reason. You overanalyze life so much that you forget to actually live it.",
        strengths: ["Reads people like subtitles", "Calm in chaos", "Notices the tiny details everyone misses"],
        weaknesses: ["Overthinking literally everything", "Mentally replaying conversations at 3AM", "Emotionally offline sometimes"],
        growthAdvice: "Not every thought deserves a 10-slide analysis. Chill a bit."
    },
    "Dreamer": {
        title: "The Main Character",
         description: "You don’t just live life… you *imagine edits for it* while it’s happening.",
        realityCheck: "Life is not a movie scene. Stop waiting for background music.",
        strengths: ["Crazy imagination", "Sees possibilities everywhere", "Vibes hard with their own world"],
        weaknesses: ["Escapes reality a bit too easily", "Starts 10 ideas, finishes 0", "Gets lost in thoughts mid-convo"],
        growthAdvice: "Your ideas are fire… now actually do something with one of them."
    },
     "Creator": {
        title: "The Chaos Builder",
        description: "You don’t wait. You just start building and pray it works out later.",
        realityCheck: "Burnout isn’t a personality trait, bro.",
        strengths: ["Gets things done fast", "Builds from scratch like it’s nothing", "High-energy problem solver"],
        weaknesses: ["Forgets rest exists", "Hates slowing down", "Turns everything into a project"],
        growthAdvice: "Rest is not laziness. It’s literally part of the grind."
     },

    "Guide": {
        title: "The Therapist Friend",
        description: "Everyone comes to you like you’re customer support for emotions.",
        realityCheck: "You can’t fix everyone and still be fine yourself.",
        strengths: ["People instantly trust you", "Emotionally aware", "Good listener (even when tired)"],
        weaknesses: ["Forgets their own needs", "Says yes too much", "Emotionally drained but still helping others"],
        growthAdvice: "You’re allowed to choose yourself sometimes."
    }
};

const microTexts = [
    "hmm... interesting 👀",
    "bold choice.",
    "okay, I see you.",
    "makes sense.",
    "didn't expect that!",
    "duly noted 📝"
];

let currentQuestionIndex = 0;
let scores = { Observer: 0, Dreamer: 0, Creator: 0, Guide: 0 };

const views = {
    intro: document.getElementById('intro-view'),
    quiz: document.getElementById('quiz-view'),
    loading: document.getElementById('loading-view'),
    result: document.getElementById('result-view')
};

const startBtn = document.getElementById('start-btn');
const retakeBtn = document.getElementById('retake-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');
const questionCounter = document.getElementById('question-counter');
const microTextEl = document.getElementById('micro-text');

function switchView(from, to) {
    from.classList.add('fade-out');
    setTimeout(() => {
        from.classList.remove('active', 'fade-out');
        to.classList.add('active');
    }, 300);
}

startBtn.addEventListener('click', () => {
    switchView(views.intro, views.quiz);
    renderQuestionFlow();
});

retakeBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    scores = { Observer: 0, Dreamer: 0, Creator: 0, Guide: 0 };
    switchView(views.result, views.intro);
});

function renderQuestionFlow() {
    const q = questions[currentQuestionIndex];

    progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    questionCounter.innerText = `${currentQuestionIndex + 1} / ${questions.length}`;

    optionsContainer.innerHTML = '';
    microTextEl.innerText = '';
    microTextEl.classList.remove('show');

    questionText.innerText = q.text;

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;

        btn.addEventListener('click', () => handleOptionClick(btn, opt.type));
        optionsContainer.appendChild(btn);
    });
}

function handleOptionClick(selectedBtn, type) {
    const allBtns = optionsContainer.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    selectedBtn.classList.add('selected');
    scores[type]++;

    const randomText = microTexts[Math.floor(Math.random() * microTexts.length)];
    microTextEl.innerText = randomText;
    microTextEl.classList.add('show');

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            renderQuestionFlow();
        } else {
            finishQuiz();
        }
    }, 1000);
}

function finishQuiz() {
    switchView(views.quiz, views.loading);
    setTimeout(() => {
        calculateResult();
        switchView(views.loading, views.result);
    }, 2000);
}


function calculateResult() {
    let maxScore = Math.max(...Object.values(scores));

    const topTypes = Object.keys(scores)
        .filter(type => scores[type] >= maxScore - 1);

    let resultTitle = "";
    let resultDesc = "";
    let realityCheck = "";
    let growth = "";
    let strengths = [];
    let weaknesses = [];

    if (topTypes.length === 1) {
        const p = personalities[topTypes[0]];

        resultTitle = p.title;
        resultDesc = p.description;
        realityCheck = p.realityCheck;
        growth = p.growthAdvice;
        strengths = p.strengths;
        weaknesses = p.weaknesses;

    } else if (topTypes.length >= 2) {
        const type1 = topTypes[0];
        const type2 = topTypes[1];

        const p1 = personalities[type1];
        const p2 = personalities[type2];

        if (!p1 || !p2) {
            console.error("Invalid personality type:", type1, type2);
            return;
        }

        resultTitle = `You're a mix of ${p1.title} & ${p2.title}`;
        resultDesc = `${p1.description} At the same time, ${p2.description.toLowerCase()}`;
        realityCheck = `${p1.realityCheck} Also, ${p2.realityCheck.toLowerCase()}`;
        growth = `${p1.growthAdvice} Also, ${p2.growthAdvice.toLowerCase()}`;

        strengths = [...new Set([...p1.strengths, ...p2.strengths])];
        weaknesses = [...new Set([...p1.weaknesses, ...p2.weaknesses])];
    }

    // Apply to UI
    document.getElementById('result-title').innerText = resultTitle;
    document.getElementById('result-desc').innerText = resultDesc;
    document.getElementById('result-reality-check').innerText = `"${realityCheck}"`;
    document.getElementById('result-growth').innerText = growth;

    const strengthsList = document.getElementById('result-strengths');
    strengthsList.innerHTML = '';
    strengths.forEach(s => {
        const li = document.createElement('li');
        li.innerText = s;
        strengthsList.appendChild(li);
    });

    const weaknessesList = document.getElementById('result-weaknesses');
    weaknessesList.innerHTML = '';
    weaknesses.forEach(w => {
        const li = document.createElement('li');
        li.innerText = w;
        weaknessesList.appendChild(li);
    });
}