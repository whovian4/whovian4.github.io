document.addEventListener('DOMContentLoaded', () => {
    // --- Student Data ---
    // In a real-world application, this would not be stored client-side.
    // But for this static-site approach, it's a workable solution.
    const studentData = {
        'QD2501': '1ETPJ',
        'QD2505': 'YGPQOL',
        'QD2507': 'Z2EIVA',
        'QD2509': '5IVB8H',
        'QD2512': '141KHH',
        'QD2513': '837H4N',
        'QD2514': 'ZZEBEA',
        'QD2515': 'AHTSV6',
        'QD2516': 'T56QTN'
    };

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
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd8j6w2_rMZTeaPH9Z1scWih_8P-UgprDugUW__E85VLQ5nUA/viewform?usp=pp_url&entry.2091676531=ROLLNUMBER_PLACEHOLDER';

    // --- Functions ---
    function showView(view) {
        contentDisplay.innerHTML = ''; // Clear previous content
        const iframe = document.createElement('iframe');

        if (view === 'feedback' && currentRollNo) {
            iframe.src = `feedback/${currentRollNo}.html`;
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
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rollNo = document.getElementById('rollNo').value.trim();
        const accessCode = document.getElementById('accessCode').value.trim();

        // Check credentials
        if (studentData[rollNo] && studentData[rollNo] === accessCode) {
            currentRollNo = rollNo;
            loginContainer.style.display = 'none';
            feedbackContainer.style.display = 'block';
            showView('feedback'); // Show personal feedback by default
        } else {
            loginMessage.textContent = 'Invalid Roll Number or Access Code.';
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