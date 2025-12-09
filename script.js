// ===== SYSTEM KONT - PEŁNY KOD =====

// ⚠️ ZMIENIĆ TE WARTOŚCI NA SWOJE!
const GITHUB_TOKEN = 'TU_WKLĘJ_SWÓJ_TOKEN_GITHUB';
const GITHUB_USER = 'Magick9k';
const GITHUB_REPO = 'mnstudio-website';

// ZMIENNE
let allUsers = {};
let currentUser = null;
let isAdminLoggedIn = false;

// ZABRONIONE SŁOWA
const BAD_WORDS = [
    'nigger', 'nigga', 'n-word', 'n!gga', 'n!gger',
    'cunt', 'pussy', 'fuck', 'shit', 'bitch',
    'asshole', 'dick', 'whore', 'slut',
    'kurwa', 'chuj', 'pierdol', 'jebany',
    'penis', 'vagina', 'sex', 'seks',
    'nazi', 'hitler', 'kkk', 'rape'
];

// INICJALIZACJA
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addAccountButton, 1000);
    loadUsers();
    
    const savedUser = localStorage.getItem('mnstudio_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUI();
        if (currentUser.isAdmin) isAdminLoggedIn = true;
    }
});

// DODANIE PRZYCISKU KONTA
function addAccountButton() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu || document.getElementById('account-btn')) return;
    
    const accountBtn = document.createElement('button');
    accountBtn.className = 'nav-btn';
    accountBtn.id = 'account-btn';
    accountBtn.innerHTML = '<i class="fas fa-user"></i> <span>Konto</span>';
    accountBtn.onclick = showAccountModal;
    
    const setupBtn = document.getElementById('setup-btn');
    setupBtn ? navMenu.insertBefore(accountBtn, setupBtn) : navMenu.appendChild(accountBtn);
}

function updateUI() {
    const accountBtn = document.getElementById('account-btn');
    if (!accountBtn) return;
    
    accountBtn.innerHTML = currentUser ? 
        `<i class="fas fa-user-circle"></i> <span>${currentUser.nick}</span>` :
        '<i class="fas fa-user"></i> <span>Konto</span>';
}

// ŁADOWANIE UŻYTKOWNIKÓW
async function loadUsers() {
    try {
        const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/users.json`;
        const headers = {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        };
        
        const response = await fetch(url, { headers });
        
        if (response.ok) {
            const data = await response.json();
            const content = atob(data.content.replace(/\n/g, ''));
            allUsers = JSON.parse(content);
            console.log('Załadowano użytkowników:', Object.keys(allUsers).length);
            localStorage.setItem('mnstudio_users_backup', content);
        } else {
            loadFromLocal();
        }
    } catch (error) {
        console.error('Błąd ładowania:', error);
        loadFromLocal();
    }
}

function loadFromLocal() {
    const backup = localStorage.getItem('mnstudio_users_backup');
    allUsers = backup ? JSON.parse(backup) : {};
}

async function saveUsers() {
    try {
        const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/users.json`;
        const headers = {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        };
        
        const check = await fetch(url, { headers });
        let sha = null;
        
        if (check.ok) {
            const data = await check.json();
            sha = data.sha;
        }
        
        const content = JSON.stringify(allUsers, null, 2);
        const contentBase64 = btoa(unescape(encodeURIComponent(content)));
        
        const body = {
            message: `Aktualizacja: ${new Date().toLocaleString()}`,
            content: contentBase64,
            branch: 'main'
        };
        
        if (sha) body.sha = sha;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            localStorage.setItem('mnstudio_users_backup', JSON.stringify(allUsers));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd zapisu:', error);
        return false;
    }
}

// MODAL KONTA
function showAccountModal() {
    if (!document.getElementById('account-modal')) createAccountModal();
    document.getElementById('account-modal').style.display = 'flex';
    updateAccountModal();
}

function createAccountModal() {
    const modalHTML = `
    <div id="account-modal" class="modal">
        <div class="modal-content account-modal">
            <div class="modal-header">
                <h3><i class="fas fa-user"></i> Panel Konta</h3>
                <button class="close-modal" onclick="closeAccountModal()">&times;</button>
            </div>
            
            <div class="modal-body">
                <div id="login-section">
                    <h4><i class="fas fa-sign-in-alt"></i> Logowanie</h4>
                    <div class="form-group">
                        <input type="text" id="login-nick" placeholder="Twój nick" class="form-input">
                    </div>
                    <div class="form-group">
                        <input type="password" id="login-password" placeholder="Hasło" class="form-input">
                    </div>
                    <button class="account-action-btn login-btn" onclick="login()">
                        <i class="fas fa-sign-in-alt"></i> Zaloguj
                    </button>
                    <button class="account-action-btn register-btn" onclick="showRegister()">
                        <i class="fas fa-user-plus"></i> Załóż konto
                    </button>
                    <button class="account-action-btn forgot-btn" onclick="showForgotPassword()">
                        <i class="fas fa-key"></i> Zapomniałem hasła
                    </button>
                </div>
                
                <div id="register-section" style="display: none;">
                    <h4><i class="fas fa-user-plus"></i> Rejestracja</h4>
                    <div class="form-group">
                        <input type="text" id="register-nick" placeholder="Wybierz nick" class="form-input">
                        <small>3-20 znaków, bez zabronionych słów</small>
                    </div>
                    <div class="form-group">
                        <input type="password" id="register-password" placeholder="Hasło" class="form-input">
                        <small>Minimum 6 znaków</small>
                    </div>
                    <div class="form-group">
                        <input type="password" id="register-confirm" placeholder="Potwierdź hasło" class="form-input">
                    </div>
                    <div class="form-group">
                        <select id="secret-question" class="form-input">
                            <option value="">Wybierz pytanie bezpieczeństwa</option>
                            <option value="Jakie jest Twoje ulubione zwierzę?">Jakie jest Twoje ulubione zwierzę?</option>
                            <option value="Gdzie się urodziłeś?">Gdzie się urodziłeś?</option>
                            <option value="Jakie jest Twoje ulubione jedzenie?">Jakie jest Twoje ulubione jedzenie?</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="text" id="secret-answer" placeholder="Odpowiedź" class="form-input">
                        <small>Na wypadek zapomnienia hasła</small>
                    </div>
                    <div class="button-group">
                        <button class="account-action-btn back-btn" onclick="showLogin()">
                            <i class="fas fa-arrow-left"></i> Wróć
                        </button>
                        <button class="account-action-btn confirm-register-btn" onclick="register()">
                            <i class="fas fa-check"></i> Załóż konto
                        </button>
                    </div>
                </div>
                
                <div id="profile-section" style="display: none;">
                    <div class="profile-header">
                        <div class="avatar-large">${currentUser ? currentUser.nick.charAt(0).toUpperCase() : '?'}</div>
                        <h4 id="profile-nick">${currentUser ? currentUser.nick : ''}</h4>
                        <div class="user-badge">${currentUser && currentUser.isAdmin ? '👑 Admin' : '👤 Użytkownik'}</div>
                    </div>
                    
                    <div class="profile-info">
                        <p><i class="fas fa-calendar"></i> Dołączył: ${currentUser ? new Date(currentUser.createdAt).toLocaleDateString() : ''}</p>
                    </div>
                    
                    <div class="profile-actions">
                        <button class="profile-action-btn" onclick="showChangePasswordForm()">
                            <i class="fas fa-key"></i> Zmień hasło
                        </button>
                        ${currentUser && currentUser.isAdmin ? `
                        <button class="profile-action-btn admin-btn" onclick="showAdminPanel()">
                            <i class="fas fa-crown"></i> Panel Admina
                        </button>
                        ` : ''}
                        <button class="profile-action-btn logout-btn" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i> Wyloguj
                        </button>
                    </div>
                </div>
                
                <div id="forgot-section" style="display: none;">
                    <h4><i class="fas fa-key"></i> Odzyskiwanie hasła</h4>
                    <div class="form-group">
                        <input type="text" id="forgot-nick" placeholder="Twój nick" class="form-input">
                    </div>
                    <div class="form-group">
                        <p id="security-question-text"></p>
                        <input type="text" id="security-answer" placeholder="Twoja odpowiedź" class="form-input">
                    </div>
                    <button class="account-action-btn" onclick="recoverPassword()">
                        <i class="fas fa-unlock"></i> Odzyskaj dostęp
                    </button>
                    <button class="account-action-btn back-btn" onclick="showLogin()">
                        <i class="fas fa-arrow-left"></i> Wróć
                    </button>
                </div>
                
                <div id="change-password-section" style="display: none;">
                    <h4><i class="fas fa-key"></i> Zmiana hasła</h4>
                    <div class="form-group">
                        <input type="password" id="current-password" placeholder="Aktualne hasło" class="form-input">
                    </div>
                    <div class="form-group">
                        <input type="password" id="new-password" placeholder="Nowe hasło" class="form-input">
                    </div>
                    <div class="form-group">
                        <input type="password" id="confirm-new-password" placeholder="Potwierdź nowe hasło" class="form-input">
                    </div>
                    <button class="account-action-btn" onclick="changePassword()">
                        <i class="fas fa-save"></i> Zmień hasło
                    </button>
                    <button class="account-action-btn back-btn" onclick="showProfile()">
                        <i class="fas fa-arrow-left"></i> Wróć
                    </button>
                </div>
                
                <div class="privacy-note">
                    <p><i class="fas fa-shield-alt"></i> <strong>Twoje dane są bezpieczne!</strong></p>
                    <p>• Hasła są szyfrowane<br>• Nie sprzedajemy żadnych danych<br>• Dane służą tylko do komentowania<br>• Możesz usunąć konto w każdej chwili</p>
                </div>
            </div>
        </div>
    </div>
    
    <style>
    .account-modal { max-width: 500px; }
    .form-input {
        width: 100%;
        padding: 12px 15px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #444488;
        border-radius: 8px;
        color: white;
        font-family: 'Oxanium', sans-serif;
        margin: 8px 0;
    }
    .form-input:focus {
        outline: none;
        border-color: #00ff88;
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
    }
    .account-action-btn {
        width: 100%;
        padding: 12px;
        margin: 8px 0;
        border: none;
        border-radius: 8px;
        font-family: 'Orbitron', sans-serif;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .login-btn {
        background: linear-gradient(45deg, #00ff88, #0088ff);
        color: white;
    }
    .register-btn {
        background: rgba(136, 136, 255, 0.2);
        border: 2px solid #8888ff;
        color: #8888ff;
    }
    .forgot-btn {
        background: rgba(255, 170, 0, 0.2);
        border: 2px solid #ffaa00;
        color: #ffaa00;
    }
    .back-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #666;
        color: #ccc;
    }
    .account-action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
    }
    .avatar-large {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #00ff88, #0088ff);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: bold;
        color: white;
        margin: 0 auto 15px;
    }
    .user-badge {
        background: rgba(0, 255, 136, 0.2);
        border: 1px solid #00ff88;
        color: #00ff88;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: bold;
        display: inline-block;
        margin-top: 5px;
    }
    .profile-action-btn {
        width: 100%;
        padding: 12px;
        margin: 5px 0;
        background: rgba(136, 136, 255, 0.2);
        border: 2px solid #8888ff;
        color: #8888ff;
        border-radius: 8px;
        font-family: 'Orbitron', sans-serif;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .profile-action-btn:hover {
        background: rgba(136, 136, 255, 0.4);
    }
    .logout-btn {
        background: rgba(255, 0, 100, 0.2);
        border-color: #ff0064;
        color: #ff0064;
    }
    .admin-btn {
        background: rgba(255, 170, 0, 0.2);
        border-color: #ffaa00;
        color: #ffaa00;
    }
    .privacy-note {
        margin-top: 20px;
        padding: 15px;
        background: rgba(30, 30, 60, 0.5);
        border-radius: 10px;
        border: 1px solid #444488;
        font-size: 12px;
        color: #aaa;
    }
    .privacy-note strong {
        color: #00ff88;
    }
    .button-group {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }
    .button-group button {
        flex: 1;
    }
    small {
        color: #888;
        font-size: 12px;
        display: block;
        margin-top: 3px;
    }
    </style>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function updateAccountModal() {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const profileSection = document.getElementById('profile-section');
    const forgotSection = document.getElementById('forgot-section');
    const changePasswordSection = document.getElementById('change-password-section');
    
    if (!loginSection) return;
    
    [loginSection, registerSection, profileSection, forgotSection, changePasswordSection]
        .forEach(section => section.style.display = 'none');
    
    if (currentUser) {
        profileSection.style.display = 'block';
        const avatar = profileSection.querySelector('.avatar-large');
        const nick = profileSection.querySelector('#profile-nick');
        const badge = profileSection.querySelector('.user-badge');
        const joinDate = profileSection.querySelector('.profile-info p');
        
        if (avatar) avatar.textContent = currentUser.nick.charAt(0).toUpperCase();
        if (nick) nick.textContent = currentUser.nick;
        if (badge) badge.textContent = currentUser.isAdmin ? '👑 Admin' : '👤 Użytkownik';
        if (joinDate) joinDate.innerHTML = `<i class="fas fa-calendar"></i> Dołączył: ${new Date(currentUser.createdAt).toLocaleDateString()}`;
    } else {
        loginSection.style.display = 'block';
    }
}

function closeAccountModal() {
    document.getElementById('account-modal').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
}

function showLogin() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('forgot-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

function showProfile() {
    document.getElementById('change-password-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';
}

function showForgotPassword() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('forgot-section').style.display = 'block';
    document.getElementById('security-question-text').textContent = '';
}

function showChangePasswordForm() {
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('change-password-section').style.display = 'block';
}

// FUNKCJE SYSTEMU
function containsBadWords(text) {
    const lowerText = text.toLowerCase();
    return BAD_WORDS.some(word => lowerText.includes(word.toLowerCase()));
}

function validateNick(nick) {
    if (nick.length < 3 || nick.length > 20) return 'Nick musi mieć 3-20 znaków';
    if (containsBadWords(nick)) return 'Nick zawiera niedozwolone słowa';
    if (!/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ_\- ]+$/.test(nick)) return 'Nick może zawierać tylko litery, cyfry, spacje i _-';
    if (allUsers[nick]) return 'Ten nick jest już zajęty';
    return null;
}

function validatePassword(password) {
    if (password.length < 6) return 'Hasło musi mieć co najmniej 6 znaków';
    return null;
}

// LOGOWANIE
async function login() {
    const nick = document.getElementById('login-nick').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!nick || !password) {
        alert('Wpisz nick i hasło!');
        return;
    }
    
    if (!allUsers[nick]) {
        alert('Nieprawidłowy nick lub hasło!');
        return;
    }
    
    if (allUsers[nick].password !== password) {
        alert('Nieprawidłowy nick lub hasło!');
        return;
    }
    
    currentUser = {
        nick: nick,
        isAdmin: allUsers[nick].isAdmin || false,
        createdAt: allUsers[nick].createdAt
    };
    
    localStorage.setItem('mnstudio_current_user', JSON.stringify(currentUser));
    
    if (currentUser.isAdmin) {
        isAdminLoggedIn = true;
    }
    
    updateUI();
    updateAccountModal();
    closeAccountModal();
    showNotification('Zalogowano pomyślnie!', 'success');
    
    // Auto-uzupełnij nick w komentarzach
    document.getElementById('comment-nick').value = nick;
    document.getElementById('personal-comment-nick').value = nick;
}

// REJESTRACJA
async function register() {
    const nick = document.getElementById('register-nick').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const question = document.getElementById('secret-question').value;
    const answer = document.getElementById('secret-answer').value.trim();
    
    const nickError = validateNick(nick);
    if (nickError) {
        alert(nickError);
        return;
    }
    
    const passError = validatePassword(password);
    if (passError) {
        alert(passError);
        return;
    }
    
    if (password !== confirm) {
        alert('Hasła nie pasują do siebie!');
        return;
    }
    
    if (!question || !answer) {
        alert('Wybierz pytanie bezpieczeństwa i podaj odpowiedź!');
        return;
    }
    
    if (containsBadWords(answer)) {
        alert('Odpowiedź zawiera niedozwolone słowa!');
        return;
    }
    
    // Utwórz użytkownika
    allUsers[nick] = {
        password: password,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        secretQuestion: question,
        secretAnswer: answer
    };
    
    // Zapisz na GitHub
    const saved = await saveUsers();
    if (!saved) {
        alert('Błąd zapisu. Spróbuj ponownie.');
        delete allUsers[nick];
        return;
    }
    
    // Zaloguj automatycznie
    currentUser = {
        nick: nick,
        isAdmin: false,
        createdAt: allUsers[nick].createdAt
    };
    
    localStorage.setItem('mnstudio_current_user', JSON.stringify(currentUser));
    
    updateUI();
    showLogin();
    setTimeout(() => {
        updateAccountModal();
    }, 100);
    
    showNotification('Konto utworzone pomyślnie!', 'success');
}

// ODZYSKIWANIE HASŁA
async function recoverPassword() {
    const nick = document.getElementById('forgot-nick').value.trim();
    const answer = document.getElementById('security-answer').value.trim();
    
    if (!nick) {
        alert('Wpisz swój nick!');
        return;
    }
    
    const user = allUsers[nick];
    if (!user) {
        alert('Nie znaleziono użytkownika!');
        return;
    }
    
    // Jeśli nie ma pytania, pokaż je
    if (!document.getElementById('security-question-text').textContent) {
        document.getElementById('security-question-text').textContent = user.secretQuestion;
        return;
    }
    
    // Sprawdź odpowiedź
    if (!answer || user.secretAnswer.toLowerCase() !== answer.toLowerCase()) {
        alert('Nieprawidłowa odpowiedź!');
        return;
    }
    
    // Zapytaj o nowe hasło
    const newPassword = prompt('Podaj nowe hasło (min. 6 znaków):');
    if (!newPassword || newPassword.length < 6) {
        alert('Hasło musi mieć co najmniej 6 znaków!');
        return;
    }
    
    const confirmPassword = prompt('Potwierdź nowe hasło:');
    if (newPassword !== confirmPassword) {
        alert('Hasła nie pasują do siebie!');
        return;
    }
    
    // Zmień hasło
    user.password = newPassword;
    
    // Zapisz zmiany
    const saved = await saveUsers();
    if (!saved) {
        alert('Błąd zapisu. Spróbuj ponownie.');
        return;
    }
    
    showNotification('Hasło zmienione pomyślnie!', 'success');
    showLogin();
}

// ZMIANA HASŁA
async function changePassword() {
    if (!currentUser) return;
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Wypełnij wszystkie pola!');
        return;
    }
    
    const user = allUsers[currentUser.nick];
    if (!user) {
        alert('Błąd: użytkownik nie istnieje!');
        logout();
        return;
    }
    
    if (user.password !== currentPassword) {
        alert('Aktualne hasło jest nieprawidłowe!');
        return;
    }
    
    const passError = validatePassword(newPassword);
    if (passError) {
        alert(passError);
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Hasła nie pasują do siebie!');
        return;
    }
    
    // Zmień hasło
    user.password = newPassword;
    
    // Zapisz zmiany
    const saved = await saveUsers();
    if (!saved) {
        alert('Błąd zapisu. Spróbuj ponownie.');
        return;
    }
    
    showNotification('Hasło zmienione pomyślnie!', 'success');
    showProfile();
}

// WYLOGOWANIE
function logout() {
    currentUser = null;
    isAdminLoggedIn = false;
    localStorage.removeItem('mnstudio_current_user');
    updateUI();
    showNotification('Wylogowano pomyślnie!', 'info');
    showLogin();
}

// PANEL ADMINA
function showAdminPanel() {
    if (!isAdminLoggedIn) {
        alert('Nie masz uprawnień administratora!');
        return;
    }
    
    const adminHTML = `
    <div id="admin-panel-modal" class="modal">
        <div class="modal-content admin-modal">
            <div class="modal-header">
                <h3><i class="fas fa-crown"></i> Panel Admina</h3>
                <button class="close-modal" onclick="closeAdminPanel()">&times;</button>
            </div>
            
            <div class="modal-body">
                <div class="admin-section">
                    <h4><i class="fas fa-users"></i> Zarządzanie użytkownikami (${Object.keys(allUsers).length})</h4>
                    <div class="users-list">
                        ${Object.entries(allUsers).map(([nick, data]) => `
                            <div class="user-item ${data.isAdmin ? 'admin-user' : ''}">
                                <div class="user-info">
                                    <strong>${nick}</strong>
                                    <span class="user-type">${data.isAdmin ? '👑 Admin' : '👤 Użytkownik'}</span>
                                    <span class="user-date">${new Date(data.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div class="user-actions">
                                    ${!data.isAdmin ? `
                                    <button class="admin-action-btn" onclick="makeAdmin('${nick}')">
                                        <i class="fas fa-crown"></i> Nadaj admina
                                    </button>
                                    ` : ''}
                                    <button class="admin-action-btn delete-btn" onclick="deleteUser('${nick}')">
                                        <i class="fas fa-trash"></i> Usuń
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <style>
    .users-list {
        max-height: 400px;
        overflow-y: auto;
        padding: 10px;
        background: rgba(20, 20, 40, 0.7);
        border-radius: 10px;
        border: 1px solid #444488;
    }
    .user-item {
        background: rgba(40, 40, 80, 0.8);
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 10px;
        border-left: 4px solid #8888ff;
    }
    .user-item.admin-user {
        border-left-color: #ffaa00;
        background: rgba(255, 170, 0, 0.1);
    }
    .user-info {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
    }
    .user-type {
        background: rgba(0, 255, 136, 0.2);
        border: 1px solid #00ff88;
        color: #00ff88;
        padding: 3px 10px;
        border-radius: 10px;
        font-size: 12px;
    }
    .user-date {
        color: #888;
        font-size: 12px;
        margin-left: auto;
    }
    .user-actions {
        display: flex;
        gap: 10px;
    }
    .admin-action-btn {
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        font-family: 'Orbitron', sans-serif;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.3s;
    }
    .admin-action-btn {
        background: rgba(136, 136, 255, 0.2);
        border: 1px solid #8888ff;
        color: #8888ff;
    }
    .admin-action-btn.delete-btn {
        background: rgba(255, 0, 100, 0.2);
        border: 1px solid #ff0064;
        color: #ff0064;
    }
    .admin-action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
    }
    </style>`;
    
    document.body.insertAdjacentHTML('beforeend', adminHTML);
    document.getElementById('admin-panel-modal').style.display = 'flex';
}

function closeAdminPanel() {
    const modal = document.getElementById('admin-panel-modal');
    if (modal) modal.remove();
}

async function makeAdmin(nick) {
    if (!confirm(`Czy na pewno chcesz nadać uprawnienia admina użytkownikowi ${nick}?`)) return;
    
    allUsers[nick].isAdmin = true;
    const saved = await saveUsers();
    
    if (saved) {
        showNotification(`Nadano uprawnienia admina dla ${nick}`, 'success');
        closeAdminPanel();
        setTimeout(showAdminPanel, 300);
    }
}

async function deleteUser(nick) {
    if (nick === 'MarekNarty') {
        alert('Nie możesz usunąć głównego konta admina!');
        return;
    }
    
    if (!confirm(`Czy na pewno chcesz usunąć konto ${nick}?`)) return;
    
    delete allUsers[nick];
    const saved = await saveUsers();
    
    if (saved) {
        showNotification(`Usunięto konto ${nick}`, 'success');
        closeAdminPanel();
        setTimeout(showAdminPanel, 300);
    }
}

// POWIADOMIENIA
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(40, 40, 80, 0.95);
        border-radius: 10px;
        padding: 15px 20px;
        min-width: 300px;
        z-index: 9999;
        border: 2px solid;
        transform: translateX(400px);
        transition: transform 0.3s;
        backdrop-filter: blur(10px);
    `;
    
    if (type === 'success') {
        notification.style.borderColor = '#00ff88';
        notification.style.background = 'rgba(0, 255, 136, 0.1)';
    } else if (type === 'error') {
        notification.style.borderColor = '#ff0064';
        notification.style.background = 'rgba(255, 0, 100, 0.1)';
    } else {
        notification.style.borderColor = '#00aaff';
        notification.style.background = 'rgba(0, 170, 255, 0.1)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }, 3000);
}

// AUTOMATYCZNE UZUPEŁNIANIE NICKU W KOMENTARZACH
document.addEventListener('DOMContentLoaded', function() {
    // Obsługa auto-uzupełniania
    setInterval(() => {
        if (currentUser) {
            const commentNick = document.getElementById('comment-nick');
            const personalCommentNick = document.getElementById('personal-comment-nick');
            
            if (commentNick && !commentNick.value) commentNick.value = currentUser.nick;
            if (personalCommentNick && !personalCommentNick.value) personalCommentNick.value = currentUser.nick;
        }
    }, 1000);
});

console.log('System kont załadowany! Token GitHub:', GITHUB_TOKEN ? '✅ Ustawiony' : '❌ Brak tokenu!');
