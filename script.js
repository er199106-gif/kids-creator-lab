// ==============================
// إدارة التخزين المحلي
// ==============================

class UserStorage {
    constructor() {
        this.userDataKey = 'creatorLabUserData';
        this.initializeStorage();
    }
    
    initializeStorage() {
        if (!localStorage.getItem(this.userDataKey)) {
            localStorage.setItem(this.userDataKey, JSON.stringify({
                users: {},
                currentUser: null
            }));
        }
    }
    
    saveUser(name, data) {
        const storage = JSON.parse(localStorage.getItem(this.userDataKey));
        storage.users[name] = {
            ...data,
            lastUpdated: new Date().toISOString()
        };
        storage.currentUser = name;
        localStorage.setItem(this.userDataKey, JSON.stringify(storage));
    }
    
    getUser(name) {
        const storage = JSON.parse(localStorage.getItem(this.userDataKey));
        return storage.users[name] || null;
    }
    
    getCurrentUser() {
        const storage = JSON.parse(localStorage.getItem(this.userDataKey));
        if (storage.currentUser) {
            return this.getUser(storage.currentUser);
        }
        return null;
    }
    
    updateUser(name, updates) {
        const storage = JSON.parse(localStorage.getItem(this.userDataKey));
        if (storage.users[name]) {
            storage.users[name] = {
                ...storage.users[name],
                ...updates,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.userDataKey, JSON.stringify(storage));
        }
    }
    
    resetUser(name) {
        const storage = JSON.parse(localStorage.getItem(this.userDataKey));
        if (storage.users[name]) {
            storage.users[name] = {
                name: name,
                points: 0,
                level: "مبتدئ",
                games: {},
                designTasks: {},
                aiTasks: {},
                projects: {},
                gallery: [],
                createdAt: storage.users[name].createdAt || new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.userDataKey, JSON.stringify(storage));
        }
    }
}

// ==============================
// المتغيرات العامة
// ==============================

const storage = new UserStorage();
let currentUser = null;

// ==============================
// تهيئة الموقع
// ==============================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserData();
});

function initializeApp() {
    // تحميل المستخدم الحالي من التخزين
    currentUser = storage.getCurrentUser();
    
    if (currentUser) {
        showUserProfile();
        updateNavigation();
        updateAllSections();
    }
}

function setupEventListeners() {
    // تسجيل الدخول
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('childName').value.trim();
        if (name) {
            registerUser(name);
        }
    });
    
    // التنقل
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // إعادة التعيين
    document.getElementById('resetProgressBtn').addEventListener('click', function() {
        document.getElementById('resetConfirm').style.display = 'block';
    });
    
    document.getElementById('confirmReset').addEventListener('click', function() {
        resetAllProgress();
    });
    
    document.getElementById('cancelReset').addEventListener('click', function() {
        document.getElementById('resetConfirm').style.display = 'none';
    });
    
    // المساعد الذكي
    document.getElementById('chatToggle').addEventListener('click', function() {
        document.getElementById('chatContainer').classList.toggle('active');
    });
    
    document.getElementById('closeChat').addEventListener('click', function() {
        document.getElementById('chatContainer').classList.remove('active');
    });
    
    document.getElementById('sendChat').addEventListener('click', sendChatMessage);
    
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// ==============================
// دوال إدارة المستخدم
// ==============================

function registerUser(name) {
    const userData = {
        name: name,
        points: 10,
        level: "مبتدئ",
        games: {},
        designTasks: {},
        aiTasks: {},
        projects: {},
        gallery: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    
    storage.saveUser(name, userData);
    currentUser = userData;
    
    showUserProfile();
    updateNavigation();
    showNotification(`مرحباً ${name}! تم تسجيلك بنجاح. 🎉`, 'success');
}

function loadUserData() {
    if (currentUser) {
        showUserProfile();
        updateNavigation();
    }
}

function showUserProfile() {
    if (!currentUser) return;
    
    document.getElementById('registrationSection').style.display = 'none';
    document.getElementById('userProfile').style.display = 'flex';
    document.getElementById('featuresSection').style.display = 'grid';
    document.getElementById('progressSection').style.display = 'block';
    
    document.getElementById('welcomeMessage').textContent = `مرحباً ${currentUser.name}!`;
    document.getElementById('profilePic').textContent = currentUser.name.charAt(0);
    document.getElementById('pointsValue').textContent = currentUser.points;
    document.getElementById('userLevel').textContent = currentUser.level;
    
    updateProgressBar();
}

function updateNavigation() {
    if (currentUser) {
        document.getElementById('navLinks').style.display = 'flex';
    }
}

function navigateToPage(pageId) {
    // تحديث الروابط النشطة
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // إظهار الصفحة المحددة
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    // تحديث محتوى الصفحة
    if (pageId !== 'home') {
        updatePageContent(pageId);
    }
}

// ==============================
// دوال الصفحات
// ==============================

function updatePageContent(pageId) {
    switch(pageId) {
        case 'think':
            updateThinkPage();
            break;
        case 'design':
            updateDesignPage();
            break;
        case 'ai':
            updateAIPage();
            break;
        case 'projects':
            updateProjectsPage();
            break;
        case 'achievements':
            updateAchievementsPage();
            break;
    }
}

function updateThinkPage() {
    const content = document.getElementById('gamesContent');
    let html = `
        <div class="games-grid">
            <div class="game-type">
                <h3>ألعاب المستوى 1</h3>
                <div class="games-list">
                    ${generateGameItems(1, 10)}
                </div>
            </div>
        </div>
    `;
    content.innerHTML = html;
}

function generateGameItems(start, end) {
    let items = '';
    for (let i = start; i <= end; i++) {
        const completed = currentUser.games[`game${i}`] || false;
        items += `
            <div class="game-item ${completed ? 'completed' : ''}" onclick="playGame(${i})">
                <span>لعبة ${i}</span>
                <span class="game-status ${completed ? 'status-completed' : 'status-available'}">
                    ${completed ? 'مكتملة' : 'متاحة'}
                </span>
            </div>
        `;
    }
    return items;
}

function playGame(gameId) {
    if (!currentUser) return;
    
    showNotification(`تبدأ اللعبة ${gameId}! حاول حل التحدي. 🎮`, 'success');
    
    // محاكاة لعبة بسيطة
    setTimeout(() => {
        if (!currentUser.games[`game${gameId}`]) {
            currentUser.games[`game${gameId}`] = true;
            currentUser.points += 10;
            storage.updateUser(currentUser.name, currentUser);
            showUserProfile();
            updateThinkPage();
            showNotification(`أحسنت! أكملت اللعبة ${gameId} وربحت 10 نقاط! 🎉`, 'success');
        }
    }, 2000);
}

// ==============================
// دوال المساعد الذكي
// ==============================

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // إضافة رسالة المستخدم
    addChatMessage(message, 'user');
    input.value = '';
    
    // رد المساعد
    setTimeout(() => {
        const response = getAIResponse(message);
        addChatMessage(response, 'ai');
    }, 500);
}

function addChatMessage(text, sender) {
    const messages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function getAIResponse(message) {
    const responses = [
        "أهلاً بك! كيف يمكنني مساعدتك اليوم؟",
        "أنت مبدع رائع! استمر في التقدم!",
        "هل تحتاج مساعدة في أحد الألعاب أو المهام؟",
        "يمكنني إرشادك لأفضل طريقة لاستخدام Canva!",
        "تذكر أن التعلم بالممارسة هو الأفضل!"
    ];
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('مرحبا')) {
        return "مرحباً بك! أنا المساعد الذكي. أسألني عن أي شيء!";
    } else if (lowerMessage.includes('لعبة')) {
        return "الألعاب مقسمة إلى 4 مستويات. ابدأ بالمستوى الأول وأكمل 10 ألعاب لفتح المستوى التالي!";
    } else if (lowerMessage.includes('تصميم')) {
        return "للتصميم: 1) زر canva.com 2) اختر 'اشتراك مجاني' 3) ابدأ بالتصميم!";
    } else if (lowerMessage.includes('نقاط')) {
        return `لديك ${currentUser?.points || 0} نقطة. استمر في إكمال المهام لتربح المزيد!`;
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// ==============================
// دوال المساعدة
// ==============================

function updateProgressBar() {
    const total = 30 + 30 + 30 + 4; // ألعاب + تصميم + ذكاء + مشاريع
    const completed = Object.keys(currentUser?.games || {}).length;
    const progress = Math.round((completed / total) * 100);
    
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('progressPercent').textContent = `${progress}%`;
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    
    text.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function resetAllProgress() {
    if (currentUser && confirm("هل أنت متأكد من إعادة جميع المستويات؟")) {
        storage.resetUser(currentUser.name);
        currentUser = storage.getUser(currentUser.name);
        showUserProfile();
        updateAllSections();
        showNotification("تم إعادة جميع المستويات بنجاح! 🆕", 'success');
        document.getElementById('resetConfirm').style.display = 'none';
    }
}

function updateAllSections() {
    updateThinkPage();
    updateDesignPage();
    updateAIPage();
    updateProjectsPage();
    updateAchievementsPage();
}

// وظائف الصفحات الأخرى
function updateDesignPage() {
    document.getElementById('designContent').innerHTML = `
        <div class="design-tasks-container">
            ${Array(30).fill().map((_, i) => `
                <div class="design-task">
                    <h3>مهمة التصميم ${i+1}</h3>
                    <p>وصف المهمة ${i+1}</p>
                    <button class="cta-button" onclick="completeDesignTask(${i+1})">
                        أكمل المهمة
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function completeDesignTask(taskId) {
    if (!currentUser) return;
    currentUser.designTasks[`task${taskId}`] = true;
    currentUser.points += 15;
    storage.updateUser(currentUser.name, currentUser);
    showUserProfile();
    showNotification(`أحسنت! أكملت مهمة التصميم ${taskId}! 🎨`, 'success');
}

// قم بإضافة دوال مماثلة للصفحات الأخرى

// ==============================
// وظائف النافذة
// ==============================

window.showLevel = function(level) {
    alert(`ستشاهد ألعاب المستوى ${level} قريباً!`);
};

window.playGame = playGame;
window.completeDesignTask = completeDesignTask;
