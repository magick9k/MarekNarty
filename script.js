// ===== GLOBAL VARIABLES =====
let partyActive = false;
let chaosLevel = 0;
let flyingButtons = [];
let partyInterval;
let colorInterval;
let buttonsCount = 0;
let colorsCount = 0;

// ===== PAGE LOAD =====
window.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    }, 2000);
    
    // Setup event listeners
    setupEventListeners();
    
    // Show home page by default
    showPage('home');
    
    // Play background music (optional)
    // playBackgroundMusic();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('home-btn').addEventListener('click', () => showPage('home'));
    document.getElementById('games-btn').addEventListener('click', () => showPage('games'));
    document.getElementById('social-btn').addEventListener('click', () => showPage('social'));
    
    // Don't Click button - starts the party!
    document.getElementById('dont-click-btn').addEventListener('click', startParty);
    
    // Party controls
    document.getElementById('more-chaos-btn').addEventListener('click', addMoreChaos);
    document.getElementById('stop-party-btn').addEventListener('click', stopParty);
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Copy email on click
    document.querySelector('.social-card.email').addEventListener('click', copyEmail);
}

// ===== PAGE NAVIGATION =====
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const pageElement = document.getElementById(pageName + '-page');
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    // Play click sound
    playSound('click');
}

// ===== GAME INFO MODALS =====
function showGameInfo(game) {
    const modal = document.getElementById(game + '-info-modal');
    if (modal) {
        modal.style.display = 'flex';
        playSound('click');
    }
}

function closeModal(game) {
    const modal = document.getElementById(game + '-info-modal');
    if (modal) {
        modal.style.display = 'none';
        playSound('click');
    }
}

// ===== PARTY SYSTEM (Don't Click!) =====
function startParty() {
    if (partyActive) return;
    
    partyActive = true;
    chaosLevel = 1;
    buttonsCount = 0;
    colorsCount = 0;
    
    // Show party screen
    const partyScreen = document.getElementById('party-screen');
    partyScreen.classList.remove('party-hidden');
    
    // Start party music
    const partySound = document.getElementById('party-sound');
    partySound.volume = 0.3;
    partySound.currentTime = 0;
    partySound.play();
    
    // Start chaos intervals
    partyInterval = setInterval(addFlyingButton, 500);
    colorInterval = setInterval(changeColors, 1000);
    
    // Initial buttons
    for (let i = 0; i < 10; i++) {
        setTimeout(() => addFlyingButton(), i * 100);
    }
    
    // Update stats
    updatePartyStats();
    
    // Make buttons draggable
    makeButtonsDraggable();
    
    // Add mouse wheel rotation
    document.addEventListener('wheel', rotateButtons);
}

function stopParty() {
    if (!partyActive) return;
    
    partyActive = false;
    
    // Hide party screen
    const partyScreen = document.getElementById('party-screen');
    partyScreen.classList.add('party-hidden');
    
    // Stop intervals
    clearInterval(partyInterval);
    clearInterval(colorInterval);
    
    // Stop music
    const partySound = document.getElementById('party-sound');
    partySound.pause();
    
    // Remove all flying buttons
    const container = document.getElementById('flying-buttons-container');
    container.innerHTML = '';
    flyingButtons = [];
    
    // Reset chaos
    chaosLevel = 0;
    updatePartyStats();
    
    playSound('click');
}

function addMoreChaos() {
    if (!partyActive) return;
    
    chaosLevel++;
    if (chaosLevel > 10) chaosLevel = 10;
    
    // Add more buttons
    for (let i = 0; i < 5; i++) {
        addFlyingButton();
    }
    
    // Speed up intervals
    clearInterval(partyInterval);
    clearInterval(colorInterval);
    
    const speed = Math.max(100, 1000 - (chaosLevel * 80));
    partyInterval = setInterval(addFlyingButton, speed);
    colorInterval = setInterval(changeColors, Math.max(200, 1000 - (chaosLevel * 90)));
    
    updatePartyStats();
    playSound('click');
}

function addFlyingButton() {
    if (!partyActive) return;
    
    const container = document.getElementById('flying-buttons-container');
    if (!container) return;
    
    // Create button
    const button = document.createElement('button');
    button.className = 'flying-button';
    
    // Random properties
    const texts = [
        "NIE KLIKAJ!", "IMPREZA!", "CHAOS!", "🎉", "🎊", 
        "MÓWIŁEM!", "STOP!", "WIĘCEJ!", "HULAJ!", "TAŃCZ!",
        "KOLORY!", "DŹWIĘK!", "MIGAJ!", "KRĘĆ!", "LATAJ!"
    ];
    
    const colors = [
        '#ff0064', '#ff3300', '#ffaa00', '#ffff00', '#00ff88',
        '#00aaff', '#0088ff', '#8800ff', '#ff00ff', '#ffffff'
    ];
    
    const text = texts[Math.floor(Math.random() * texts.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Style button
    button.textContent = text;
    button.style.color = color;
    button.style.background = bgColor;
    button.style.border = `3px solid ${color}`;
    button.style.fontSize = `${14 + Math.random() * 10}px`;
    button.style.boxShadow = `0 0 ${10 + chaosLevel * 5}px ${color}`;
    
    // Random position
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    // Random rotation
    const rotation = Math.random() * 360;
    
    // CSS variables for animation
    button.style.setProperty('--tx', `${x}px`);
    button.style.setProperty('--ty', `${y}px`);
    button.style.setProperty('--tr', `${rotation}deg`);
    
    // Animation
    button.style.animation = `buttonFly 0.5s ease-out forwards, buttonFloat 3s infinite ease-in-out`;
    
    // Click event - makes it more chaotic
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Change color
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        this.style.color = newColor;
        this.style.borderColor = newColor;
        this.style.boxShadow = `0 0 ${20 + chaosLevel * 5}px ${newColor}`;
        
        // Play sound
        playSound('click');
        
        // Small explosion effect
        createExplosion(e.clientX, e.clientY, newColor);
        
        // Increment counters
        buttonsCount++;
        colorsCount++;
        updatePartyStats();
    });
    
    // Add to container
    container.appendChild(button);
    flyingButtons.push(button);
    
    // Update stats
    buttonsCount++;
    updatePartyStats();
}

function changeColors() {
    if (!partyActive) return;
    
    // Change colors of all buttons
    const colors = [
        '#ff0064', '#ff3300', '#ffaa00', '#ffff00', '#00ff88',
        '#00aaff', '#0088ff', '#8800ff', '#ff00ff', '#ffffff'
    ];
    
    flyingButtons.forEach(button => {
        if (Math.random() > 0.7) { // 30% chance to change each button
            const color = colors[Math.floor(Math.random() * colors.length)];
            const bgColor = colors[Math.floor(Math.random() * colors.length)];
            
            button.style.color = color;
            button.style.background = bgColor;
            button.style.borderColor = color;
            button.style.boxShadow = `0 0 ${10 + chaosLevel * 5}px ${color}`;
            
            colorsCount++;
        }
    });
    
    // Change party title color
    const partyTitle = document.querySelector('.party-text');
    if (partyTitle) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        partyTitle.style.background = `linear-gradient(45deg, ${color}, ${colors[Math.floor(Math.random() * colors.length)]})`;
        partyTitle.style.webkitBackgroundClip = 'text';
        partyTitle.style.webkitTextFillColor = 'transparent';
    }
    
    updatePartyStats();
}

function createExplosion(x, y, color) {
    const container = document.getElementById('flying-buttons-container');
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animate = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        container.appendChild(particle);
        animate();
    }
}

function makeButtonsDraggable() {
    let isDragging = false;
    let dragButton = null;
    let offsetX = 0;
    let offsetY = 0;
    
    document.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('flying-button')) {
            isDragging = true;
            dragButton = e.target;
            
            const rect = dragButton.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            dragButton.style.cursor = 'grabbing';
            dragButton.style.zIndex = '1000';
            
            e.preventDefault();
        }
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging && dragButton) {
            dragButton.style.position = 'fixed';
            dragButton.style.left = (e.clientX - offsetX) + 'px';
            dragButton.style.top = (e.clientY - offsetY) + 'px';
            dragButton.style.animation = 'none';
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging && dragButton) {
            isDragging = false;
            dragButton.style.cursor = 'pointer';
            dragButton.style.zIndex = '1';
            
            // Restart float animation
            dragButton.style.animation = `buttonFloat 3s infinite ease-in-out`;
            
            dragButton = null;
        }
    });
}

function rotateButtons(e) {
    if (!partyActive) return;
    
    const delta = Math.sign(e.deltaY);
    flyingButtons.forEach(button => {
        const currentRotation = parseFloat(button.style.getPropertyValue('--tr') || 0);
        const newRotation = currentRotation + (delta * 10);
        button.style.setProperty('--tr', `${newRotation}deg`);
    });
}

function updatePartyStats() {
    document.getElementById('button-count').textContent = buttonsCount;
    document.getElementById('color-count').textContent = colorsCount;
    document.getElementById('chaos-level').textContent = chaosLevel;
}

// ===== SOCIAL MEDIA =====
function copyEmail() {
    const email = 'mareknarty@email.com';
    
    // Create temporary input
    const tempInput = document.createElement('input');
    tempInput.value = email;
    document.body.appendChild(tempInput);
    
    // Select and copy
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    
    // Remove temporary input
    document.body.removeChild(tempInput);
    
    // Visual feedback
    const emailCard = document.querySelector('.social-card.email');
    const originalColor = emailCard.style.borderColor;
    
    emailCard.style.borderColor = '#00ff88';
    emailCard.style.boxShadow = '0 0 20px #00ff88';
    
    setTimeout(() => {
        emailCard.style.borderColor = originalColor;
        emailCard.style.boxShadow = 'none';
    }, 1000);
    
    // Alert
    alert('Email skopiowany do schowka: ' + email);
    playSound('click');
}

// ===== AUDIO =====
function playSound(type) {
    let sound;
    
    if (type === 'click') {
        sound = document.getElementById('click-sound');
    } else if (type === 'party') {
        sound = document.getElementById('party-sound');
    }
    
    if (sound) {
        sound.currentTime = 0;
        sound.volume = 0.3;
        sound.play().catch(e => console.log("Audio play failed:", e));
    }
}

// ===== UTILITY FUNCTIONS =====
function playBackgroundMusic() {
    // Optional background music
    // You can add this if you want
}

// Make sure party stops when leaving page
window.addEventListener('beforeunload', function() {
    if (partyActive) {
        stopParty();
    }
});

// Handle window resize for party buttons
window.addEventListener('resize', function() {
    if (partyActive) {
        // Reposition buttons if needed
        flyingButtons.forEach(button => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            button.style.setProperty('--tx', `${x}px`);
            button.style.setProperty('--ty', `${y}px`);
        });
    }
});

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Add tooltips to social media cards
    const socialCards = document.querySelectorAll('.social-card');
    socialCards.forEach(card => {
        if (!card.classList.contains('coming-soon')) {
            card.title = 'Kliknij aby przejść';
        }
    });
});
