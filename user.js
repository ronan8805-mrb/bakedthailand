// Member Logic - user.js

document.addEventListener('DOMContentLoaded', () => {
    updateNavAuth();

    // Signup Handling
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('join-name').value;
            const email = document.getElementById('join-email').value;
            const password = document.getElementById('join-pass').value;

            const members = JSON.parse(localStorage.getItem('baked_members') || '[]');

            if (members.find(m => m.email === email)) {
                alert('Email already registered!');
                return;
            }

            const newMember = {
                memberId: 'BKD-' + Math.floor(1000 + Math.random() * 9000),
                name,
                email,
                password,
                status: 'Pending', // Initial status
                purchases: [],
                joinDate: new Date().toLocaleDateString()
            };

            members.push(newMember);
            localStorage.setItem('baked_members', JSON.stringify(members));
            alert('Signup Successful! Your membership is currently under review by the Bake Phuket team.');

            // Auto login for demo
            localStorage.setItem('currentUser', JSON.stringify(newMember));
            window.location.href = 'dashboard.html';
        });
    }

    // Login Handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-pass').value;

            const members = JSON.parse(localStorage.getItem('baked_members') || '[]');
            const user = members.find(m => m.email === email && m.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid Credentials!');
            }
        });
    }
});

function updateNavAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const joinBtn = document.querySelector('.nav-btn-join');
    const userDisplay = document.getElementById('user-display');
    const memberTag = document.getElementById('member-id-tag');

    if (user && joinBtn && userDisplay && memberTag) {
        joinBtn.style.display = 'none';
        userDisplay.style.display = 'flex';
        memberTag.innerText = user.memberId;
    }
}
