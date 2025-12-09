// ===== SYSTEM KOMENTARZY - TYLKO ADMIN MOŻE USUWAĆ =====

let isAdminLoggedIn = false;
let currentUser = null;

// ⚠️ TOKEN TYLKO LOKALNIE - NIE COMMITUJ GO!
const GITHUB_TOKEN = ''; // <-- Zostaw puste na GitHubie, lokalnie wklej swój token
const GITHUB_USER = 'Magick9k';
const GITHUB_REPO = 'mnstudio-website';

// Funkcja do wczytywania komentarzy
async function loadComments() {
    try {
        const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/comments.json`;
        
        // Jeśli jest token, używamy go (tylko admin)
        const headers = GITHUB_TOKEN ? {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        } : {};
        
        const response = await fetch(url, { headers });
        
        if (response.ok) {
            const data = await response.json();
            const content = atob(data.content);
            const comments = JSON.parse(content);
            displayComments(comments);
        } else {
            // Jeśli nie ma dostępu (brak tokena), pokaż tylko publiczne komentarze z backupu
            loadCommentsFromBackup();
        }
    } catch (error) {
        console.log('Brak dostępu do API (brak tokena) - wczytuję backup');
        loadCommentsFromBackup();
    }
}

// Funkcja wyświetlająca komentarze
function displayComments(comments) {
    const container = document.getElementById('comments-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        
        // Przycisk usuwania TYLKO dla admina
        const deleteBtn = isAdminLoggedIn ? 
            `<button class="delete-comment-btn" onclick="deleteComment('${comment.id}')">
                <i class="fas fa-trash"></i> Usuń
            </button>` : '';
        
        commentDiv.innerHTML = `
            <div class="comment-header">
                <strong>${comment.nick}</strong>
                <span class="comment-date">${new Date(comment.date).toLocaleString()}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
            ${deleteBtn}
        `;
        
        container.appendChild(commentDiv);
    });
}

// Funkcja usuwania komentarza (TYLKO ADMIN)
async function deleteComment(commentId) {
    if (!isAdminLoggedIn || !GITHUB_TOKEN) {
        alert('Tylko administrator może usuwać komentarze!');
        return;
    }
    
    if (!confirm('Czy na pewno chcesz usunąć ten komentarz?')) return;
    
    try {
        // 1. Pobierz aktualne komentarze
        const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/comments.json`;
        const headers = {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        };
        
        const response = await fetch(url, { headers });
        const data = await response.json();
        const content = atob(data.content);
        let comments = JSON.parse(content);
        
        // 2. Usuń komentarz
        comments = comments.filter(c => c.id !== commentId);
        
        // 3. Wyślij z powrotem
        const updatedContent = JSON.stringify(comments, null, 2);
        const contentBase64 = btoa(unescape(encodeURIComponent(updatedContent)));
        
        const body = {
            message: `Usunięto komentarz ${commentId}`,
            content: contentBase64,
            sha: data.sha,
            branch: 'main'
        };
        
        const updateResponse = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
        });
        
        if (updateResponse.ok) {
            alert('Komentarz usunięty!');
            loadComments();
        }
    } catch (error) {
        alert('Błąd podczas usuwania komentarza');
        console.error(error);
    }
}

// Funkcja logowania admina
function loginAdmin() {
    const password = prompt('Podaj hasło admina:');
    
    // 🔐 Hasło admina - zmień je!
    const ADMIN_PASSWORD = 'moje_tajne_haslo_123';
    
    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        alert('Zalogowano jako administrator!');
        loadComments(); // Przeładuj komentarze z przyciskami usuwania
        showAdminControls();
    } else {
        alert('Nieprawidłowe hasło!');
    }
}

// Pokazuje panel admina po zalogowaniu
function showAdminControls() {
    let adminBtn = document.getElementById('admin-login-btn');
    
    if (!adminBtn) {
        adminBtn = document.createElement('button');
        adminBtn.id = 'admin-login-btn';
        adminBtn.className = 'admin-btn';
        adminBtn.innerHTML = '<i class="fas fa-crown"></i> Panel Admina';
        adminBtn.onclick = showAdminPanel;
        document.querySelector('.comments-section').prepend(adminBtn);
    }
    
    adminBtn.innerHTML = '<i class="fas fa-crown"></i> Panel Admina (Zalogowany)';
}

// Panel admina
function showAdminPanel() {
    if (!isAdminLoggedIn) {
        loginAdmin();
        return;
    }
    
    const panelHTML = `
        <div class="admin-panel">
            <h3><i class="fas fa-crown"></i> Panel Administratora</h3>
            <p>Zalogowany jako: <strong>Admin</strong></p>
            <button onclick="loadComments()"><i class="fas fa-sync"></i> Odśwież komentarze</button>
            <button onclick="isAdminLoggedIn = false; alert('Wylogowano!'); location.reload();">
                <i class="fas fa-sign-out-alt"></i> Wyloguj
            </button>
        </div>
    `;
    
    // Możesz dodać to jako modal lub na stronie
    document.body.insertAdjacentHTML('beforeend', panelHTML);
}

// Backup komentarzy (gdy brak tokena)
function loadCommentsFromBackup() {
    const backup = localStorage.getItem('mnstudio_comments_backup');
    if (backup) {
        const comments = JSON.parse(backup);
        displayComments(comments);
    } else {
        document.getElementById('comments-container').innerHTML = 
            '<p class="no-comments">Brak komentarzy do wyświetlenia</p>';
    }
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    loadComments();
    
    // Przycisk logowania admina (możesz go ukryć w menu)
    const adminLoginBtn = document.createElement('button');
    adminLoginBtn.className = 'admin-login-hidden';
    adminLoginBtn.innerHTML = '<i class="fas fa-crown"></i>';
    adminLoginBtn.title = 'Logowanie admina';
    adminLoginBtn.onclick = loginAdmin;
    document.body.appendChild(adminLoginBtn);
    
    // Sprawdź czy admin już zalogowany (z localStorage)
    const savedAdmin = localStorage.getItem('mnstudio_admin_logged');
    if (savedAdmin === 'true') {
        isAdminLoggedIn = true;
        showAdminControls();
    }
});

// Style dla admina
const adminStyles = `
    .admin-btn {
        background: linear-gradient(45deg, #ffaa00, #ff5500);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-family: 'Orbitron', sans-serif;
        font-weight: bold;
        cursor: pointer;
        margin: 10px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.3s;
    }
    
    .admin-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 170, 0, 0.4);
    }
    
    .admin-panel {
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(20, 20, 40, 0.95);
        border: 2px solid #ffaa00;
        border-radius: 10px;
        padding: 20px;
        z-index: 9999;
        backdrop-filter: blur(10px);
    }
    
    .delete-comment-btn {
        background: rgba(255, 0, 100, 0.2);
        border: 1px solid #ff0064;
        color: #ff0064;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 12px;
        margin-top: 10px;
        transition: all 0.3s;
    }
    
    .delete-comment-btn:hover {
        background: rgba(255, 0, 100, 0.4);
    }
    
    .admin-login-hidden {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 170, 0, 0.2);
        border: 2px solid #ffaa00;
        color: #ffaa00;
        cursor: pointer;
        z-index: 9998;
        opacity: 0.3;
        transition: opacity 0.3s;
    }
    
    .admin-login-hidden:hover {
        opacity: 1;
    }
`;

// Dodaj style do strony
const styleSheet = document.createElement('style');
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);

console.log('System komentarzy załadowany. Tryb admina:', isAdminLoggedIn ? 'Aktywny' : 'Nieaktywny');
