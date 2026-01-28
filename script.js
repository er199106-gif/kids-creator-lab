// المتغيرات العامة
let currentUser = null;
let userPoints = 0;
let completedGames = 0;
let completedDesignTasks = 0;
let completedAITasks = 0;
let completedProjects = 0;

// حالة الألعاب والمهام
let gamesStatus = Array(30).fill(false);
let designTasksStatus = Array(30).fill(false);
let aiTasksStatus = Array(30).fill(false);
let projectsStatus = Array(4).fill(false);

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    setupEventListeners();
    updateUI();
});

function loadUserData() {
    // تحميل بيانات المستخدم من localStorage
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        userPoints = currentUser.points || 0;
        
        // تحميل تقدم الألعاب والمهام
        const savedGames = localStorage.getItem('gamesStatus');
        if (savedGames) {
            gamesStatus = JSON.parse(savedGames);
            completedGames = gamesStatus.filter(status => status).length;
        }
        
        const savedDesignTasks = localStorage.getItem('designTasksStatus');
        if (savedDesignTasks) {
            designTasksStatus = JSON.parse(savedDesignTasks);
            completedDesignTasks = designTasksStatus.filter(status => status).length;
        }
        
        // ... وهكذا لباقي الأنواع
    }
}

function saveUserData() {
    if (currentUser) {
        currentUser.points = userPoints;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('gamesStatus', JSON.stringify(gamesStatus));
        localStorage.setItem('designTasksStatus', JSON.stringify(designTasksStatus));
        // ... وهكذا
    }
}

function updateUI() {
    if (currentUser) {
        // إخفاء قسم التسجيل وإظهار الملف الشخصي
        document.getElementById('registrationSection').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('welcomeMessage').textContent = `مرحبًا ${currentUser.name}!`;
        document.getElementById('pointsValue').textContent = userPoints;
        
        // إظهار قائمة التنقل إذا كانت مخفية
        document.getElementById('navLinks').style.display = 'flex';
    } else {
        // إظهار قسم التسجيل وإخفاء الملف الشخصي
        document.getElementById('registrationSection').style.display = 'block';
        document.getElementById('userProfile').style.display = 'none';
        
        // إخفاء قائمة التنقل أو إظهارها جزئياً
        // يمكنك ضبط هذا حسب التصميم
    }
}

// دوال التسجيل وإضافة النقاط، إلخ.
