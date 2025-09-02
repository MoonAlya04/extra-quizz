
document.addEventListener('DOMContentLoaded', () => {

    const questions = [
        { de: "Welche drei Dinge machen dich im Moment besonders glücklich und geben dir viel Energie?", en: "Which three things are currently making you especially happy and giving you lots of energy?" },
        { de: "Welchen Traum hast du, den du unbedingt in den nächsten Jahren erfüllen möchtest?", en: "What dream do you have that you absolutely want to fulfill in the next few years?" },
        { de: "Welcher große Meilenstein wartet deiner Meinung nach als Nächstes in deinem Leben auf dich?", en: "Which major milestone do you think is next in your life?" },
        { de: "Was möchtest du anderen Menschen einmal über dich erzählen können, wenn du erwachsen bist?", en: "What would you like to be able to tell others about yourself when you’re grown up?" },
        { de: "Was würdest du wagen, wenn du überhaupt keine Angst vor Fehlern hättest?", en: "What would you dare to do if you had no fear of making mistakes?" }
    ];

    let currentQuestionIndex = 0;
    let voices = [];

    const questionsContainer = document.getElementById('questions-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressIndicator = document.getElementById('progress-indicator');
    const questionsView = document.getElementById('questions-view');
    const summaryScreen = document.getElementById('summary-screen');
    const summaryContent = document.getElementById('summary-content');
    const moduleHeader = document.getElementById('module-header');


    function populateVoiceList() {
        voices = window.speechSynthesis.getVoices();
    }

    function speakText(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'de-DE';
            utterance.voice = voices.find(voice => voice.lang.startsWith('de')) || null;
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Sorry, your browser doesn't support text-to-speech.");
        }
    }

    function showSummary() {
        questionsView.style.display = 'none';
        moduleHeader.style.display = 'none';
        summaryContent.innerHTML = ''; // Clear previous summary

        const answerInputs = document.querySelectorAll('.answer-input');
        questions.forEach((q, index) => {
            const answer = answerInputs[index].value || "No answer given.";
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
    <strong>${q.en}</strong>
    <p>${answer}</p>
    `;
            summaryContent.appendChild(summaryItem);
        });

        summaryScreen.style.display = 'block';
    }

    function renderQuestions() {
        questionsContainer.innerHTML = '';
        questions.forEach((q, index) => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.dataset.index = index;
            card.innerHTML = `
    <div class="question-header">
        <div class="question-text">
            <span class="lang-de">${q.de}</span>
            <span class="lang-en">${q.en}</span>
        </div>
        <button class="audio-btn" aria-label="Read question aloud">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>
        </button>
    </div>
    <textarea class="answer-input" placeholder="Jot down your cosmic thoughts..."></textarea>
    `;
            questionsContainer.appendChild(card);
        });
        updateUI();
    }

    function updateUI() {
        const offset = -currentQuestionIndex * 100;
        questionsContainer.style.transform = `translateX(${offset}%)`;
        document.querySelectorAll('.question-card').forEach(card => {
            card.classList.toggle('active', parseInt(card.dataset.index) === currentQuestionIndex);
        });
        progressIndicator.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
        prevBtn.disabled = currentQuestionIndex === 0;

        // Change next button to "Finish" on the last question
        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.innerHTML = 'Finish ✨';
        } else {
            nextBtn.innerHTML = `Next <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
        }
    }

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex === questions.length - 1) {
            showSummary();
        } else {
            currentQuestionIndex++;
            updateUI();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateUI();
        }
    });

    questionsContainer.addEventListener('click', (e) => {
        const audioBtn = e.target.closest('.audio-btn');
        if (audioBtn) {
            const card = audioBtn.closest('.question-card');
            const germanText = card.querySelector('.lang-de').textContent;
            const englishText = card.querySelector('.lang-en').textContent;
            speakText(`${germanText}. ${englishText}`);
        }
    });

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    renderQuestions();
});
