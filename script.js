document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const loginContainer = document.getElementById('login-container');
    const feedbackContainer = document.getElementById('feedback-container');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('login-message');
    const contentDisplay = document.getElementById('content-display');
    const showFeedbackBtn = document.getElementById('show-feedback-btn');
    const showSchemeBtn = document.getElementById('show-scheme-btn');
    const raiseQueryBtn = document.getElementById('raise-query-btn');
    const noQueryBtn = document.getElementById('no-query-btn');
    const queryMessage = document.getElementById('query-message');

    let currentRollNo = null;
    let secureFeedbackPath = null;
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd8j6w2_rMZTeaPH9Z1scWih_8P-UgprDugUW__E85VLQ5nUA/viewform?usp=pp_url&entry.2091676531=ROLLNUMBER_PLACEHOLDER';

    // --- Functions ---
    function showView(view) {
        contentDisplay.innerHTML = ''; // Clear previous content
        const iframe = document.createElement('iframe');

        if (view === 'feedback' && secureFeedbackPath) {
            iframe.src = secureFeedbackPath;
            showFeedbackBtn.classList.add('active');
            showSchemeBtn.classList.remove('active');
        } else if (view === 'scheme') {
            iframe.src = 'marking_scheme.html';
            showSchemeBtn.classList.add('active');
            showFeedbackBtn.classList.remove('active');
        }

        contentDisplay.appendChild(iframe);
    }

    // --- Event Listeners ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rollNo = document.getElementById('rollNo').value.trim();
        const accessCode = document.getElementById('accessCode').value.trim();

        if (!rollNo || !accessCode) {
            loginMessage.textContent = 'Please enter both Roll Number and Access Code.';
            return;
        }

        try {
            const dbResponse = await fetch('database.json');
            const db = await dbResponse.json();

            if (db[rollNo] && db[rollNo].access_code === accessCode) {
                const credentials = rollNo + accessCode;
                const encoder = new TextEncoder();
                const data = encoder.encode(credentials);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                const filePath = `data/${hashHex}.html`;

                const response = await fetch(filePath, { method: 'HEAD' });
                if (response.ok) {
                    currentRollNo = rollNo;
                    secureFeedbackPath = filePath;
                    loginContainer.style.display = 'none';
                    feedbackContainer.style.display = 'block';
                    showView('feedback');
                } else {
                    loginMessage.textContent = 'Feedback file not found.';
                }
            } else {
                loginMessage.textContent = 'Invalid Roll Number or Access Code.';
            }
        } catch (error) {
            console.error('Login error:', error);
            loginMessage.textContent = 'An error occurred. Please try again.';
        }
    });

    showFeedbackBtn.addEventListener('click', () => {
        showView('feedback');
    });

    showSchemeBtn.addEventListener('click', () => {
        showView('scheme');
    });

    raiseQueryBtn.addEventListener('click', () => {
        if (currentRollNo) {
            const prefilledUrl = googleFormUrl.replace('ROLLNUMBER_PLACEHOLDER', currentRollNo);
            window.open(prefilledUrl, '_blank');
        }
    });

    noQueryBtn.addEventListener('click', () => {
        queryMessage.textContent = 'Thank you! Your response has been recorded.';
        queryMessage.style.display = 'block';
        raiseQueryBtn.style.display = 'none';
        noQueryBtn.style.display = 'none';
    });
});