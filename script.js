// ===== SYSTEM KOMENTARZY - TYLKO ADMIN MOŻE USUWAĆ =====

let isAdminLoggedIn = false;
let currentUser = null;
let commentsCache = []; // Cache komentarzy

// ⚠️ TOKEN TYLKO LOKALNIE - NIE COMMITUJ GO!
const GITHUB_TOKEN = ''; // <-- Zostaw puste na GitHubie, lokalnie wklej swój token
const GITHUB_USER = 'Magick9k';
const GITHUB_REPO = 'mnstudio-website';

// Funkcja do wczytywania komentarzy
async function loadComments() {
    const container = document.getElementById('comments-container');
    if (!container) {
        console.error('Nie znaleziono kontenera komentarzy!');
        return;
    }
    
    // Pokaż loader
    container.innerHTML = '<div class="loading">Ładowanie komentarzy...</div>';
    
    try {
        const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/comments.json`;
        
        console.log('Ładuję komentarze z:', url);
        
        // Jeśli jest token, używamy go (tylko admin)
        const headers = {};
        if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }
        headers['Accept'] = 'application/vnd.github.v3+json';
        
        const response = await fetch(url, { headers });
        console.log('Odpowiedź API:', response.status, response.statusText);
        
        if (response.status === 404) {
            // Plik comments.json nie istnieje - stworzymy go przy pierwszym komentarzu
            console.log('Plik comments.json nie istnieje - inicjalizuję pustą listę');
            commentsCache = [];
            displayComments([]);
            saveCommentsBackup([]);
            return;
        }
        
        if (response.ok) {
            const data = await response.json();
            console.log('Dane z API:', data);
            
            if (!data.content) {
                throw new Error('Brak zawartości w odpowiedzi API');
            }
            
            // Usuń ewentualne znaki nowej linii z content
            const content = atob(data.content.replace(/\n/g, ''));
            const comments = JSON.parse(content);
            commentsCache = comments;
            
            console.log('Załadowano komentarzy:', comments.length);
            displayComments(comments);
            saveCommentsBackup(comments);
        } else if (response.status === 403 && !GITHUB_TOKEN) {
            // Brak dostępu (brak tokena) - użyj backupu
            console.log('Brak dostępu do API (403) - używam backupu');
            loadCommentsFromBackup();
        } else {
            console.error('Błąd API:', response.status);
            loadCommentsFromBackup();
        }
    } catch (error) {
        console.error('Błąd ładowania komentarzy:', error);
        loadCommentsFromBackup();
    }
}

// Funkcja wyświetlająca komentarze
function displayComments(comments) {
    const container = document.getElementById('comments-container');
    if (!container) return;
    
    if (!comments || comments.length === 0) {
        container.innerHTML = '<div class="no-comments">Brak komentarzy. Bądź pierwszy!</div>';
        return;
    }
    
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
                <strong>${escapeHtml(comment.nick)}</strong>
                <span class="comment-date">${formatDate(comment.date)}</span>
            </div>
            <div class="comment-text">${escapeHtml(comment.text)}</div>
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
        
        if (!response.ok) {
            throw new Error(`Błąd pobierania: ${response.status}`);
        }
        
        const data = await response.json();
        const content = atob(data.content.replace(/\n/g, ''));
        let comments = JSON.parse(content);
        
        // 2. Usuń komentarz
        const initialLength = comments.length;
        comments = comments.filter(c => c.id !== commentId);
        
        if (comments.length === initialLength) {
            alert('Nie znaleziono komentarza do usunięcia');
            return;
        }
        
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
            commentsCache = comments;
            saveCommentsBackup(comments);
            loadComments();
        } else {
            const errorData = await updateResponse.json();
            throw new Error(`Błąd aktualizacji: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        alert('Błąd podczas usuwania komentarza: ' + error.message);
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
        localStorage.setItem('mnstudio_admin_logged', 'true');
        alert('Zalogowano jako administrator!');
        loadComments(); // Przeładuj komentarze z przyciskami usuwania
        showAdminControls();
        return true;
    } else {
        alert('Nieprawidłowe hasło!');
        return false;
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
        
        const commentsSection = document.querySelector('.comments-section');
        if (commentsSection) {
            commentsSection.prepend(adminBtn);
        } else {
            document.body.appendChild(adminBtn);
        }
    }
    
    adminBtn.innerHTML = '<i class="fas fa-crown"></i> Panel Admina (Zalogowany)';
}

// Panel admina
function showAdminPanel() {
    if (!isAdminLoggedIn) {
        if (!loginAdmin()) return;
    }
    
    // Usuń istniejący panel
    const existingPanel = document.getElementById('admin-panel-overlay');
    if (existingPanel) existingPanel.remove();
    
    const panelHTML = `
        <div id="admin-panel-overlay" class="modal-overlay" onclick="closeAdminPanel()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3><i class="fas fa-crown"></i> Panel Administratora</h3>
                    <button class="close-modal" onclick="closeAdminPanel()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Zalogowany jako: <strong>Admin</strong></p>
                    <p>Liczba komentarzy: ${commentsCache.length}</p>
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="loadComments()">
                            <i class="fas fa-sync"></i> Odśwież komentarze
                        </button>
                        <button class="btn btn-warning" onclick="isAdminLoggedIn = false; localStorage.removeItem('mnstudio_admin_logged'); alert('Wylogowano!'); closeAdminPanel(); location.reload();">
                            <i class="fas fa-sign-out-alt"></i> Wyloguj
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', panelHTML);
}

function closeAdminPanel() {
    const panel = document.getElementById('admin-panel-overlay');
    if (panel) panel.remove();
}

// Backup komentarzy (gdy brak tokena)
function loadCommentsFromBackup() {
    const backup = localStorage.getItem('mnstudio_comments_backup');
    if (backup) {
        try {
            const comments = JSON.parse(backup);
            console.log('Wczytano komentarze z backupu:', comments.length);
            commentsCache = comments;
            displayComments(comments);
        } catch (e) {
            console.error('Błąd parsowania backupu:', e);
            displayComments([]);
        }
    } else {
        console.log('Brak backupu - wyświetlam pustą listę');
        displayComments([]);
    }
}

// Zapisz backup komentarzy
function saveCommentsBackup(comments) {
    localStorage.setItem('mnstudio_comments_backup', JSON.stringify(comments));
}

// Helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicjalizacja systemu komentarzy...');
    
    // Sprawdź czy admin już zalogowany (z localStorage)
    const savedAdmin = localStorage.getItem('mnstudio_admin_logged');
    if (savedAdmin === 'true') {
        isAdminLoggedIn = true;
        console.log('Admin zalogowany z localStorage');
        showAdminControls();
    }
    
    // Załaduj komentarze z opóźnieniem (daj czas na załadowanie DOM)
    setTimeout(() => {
        loadComments();
    }, 500);
    
    // Przycisk logowania admina (ukryty)
    const adminLoginBtn = document.createElement('button');
    adminLoginBtn.className = 'admin-login-hidden';
    adminLoginBtn.innerHTML = '<i class="fas fa-crown"></i>';
    adminLoginBtn.title = 'Logowanie admina';
    adminLoginBtn.onclick = loginAdmin;
    document.body.appendChild(adminLoginBtn);
});

// Style dla komentarzy i admina
const commentStyles = `
    .loading {
        text-align: center;
        padding: 20px;
        color: #888;
        font-style: italic;
    }
    
    .no-comments {
        text-align: center;
        padding: 30px;
        background: rgba(40, 40, 80, 0.3);
        border-radius: 10px;
        color: #888;
    }
    
    .comment {
        background: rgba(30, 30, 60, 0.7);
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 15px;
        border-left: 4px solid #444488;
        transition: all 0.3s;
    }
    
    .comment:hover {
        background: rgba(40, 40, 80, 0.8);
    }
    
    .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .comment-header strong {
        color: #00ff88;
        font-size: 16px;
    }
    
    .comment-date {
        color: #888;
        font-size: 12px;
    }
    
    .comment-text {
        color: #ddd;
        line-height: 1.5;
    }
    
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
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.3s;
    }
    
    .admin-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 170, 0, 0.4);
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
        display: inline-flex;
        align-items: center;
        gap: 5px;
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
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .admin-login-hidden:hover {
        opacity: 1;
    }
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        background: rgba(20, 20, 40, 0.95);
        border-radius: 15px;
        padding: 20px;
        max-width: 500px;
        width: 90%;
        border: 2px solid #ffaa00;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(255, 170, 0, 0.3);
        padding-bottom: 10px;
    }
    
    .close-modal {
        background: none;
        border: none;
        color: #ffaa00;
        font-size: 24px;
        cursor: pointer;
    }
    
    .button-group {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    
    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Orbitron', sans-serif;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex: 1;
    }
    
    .btn-primary {
        background: linear-gradient(45deg, #00ff88, #0088ff);
        color: white;
    }
    
    .btn-warning {
        background: rgba(255, 170, 0, 0.2);
        border: 2px solid #ffaa00;
        color: #ffaa00;
    }
`;

// Dodaj style do strony
if (!document.getElementById('comment-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'comment-styles';
    styleSheet.textContent = commentStyles;
    document.head.appendChild(styleSheet);
}

console.log('System komentarzy załadowany. Tryb admina:', isAdminLoggedIn ? 'Aktywny' : 'Nieaktywny');
