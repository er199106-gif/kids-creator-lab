let currentUser = loadData('currentUser');

const registrationSection = document.getElementById('registrationSection');
const userProfile = document.getElementById('userProfile');
const navMenu = document.getElementById('navMenu');
const welcomeMessage = document.getElementById('welcomeMessage');
const pointsValue = document.getElementById('pointsValue');
const userLevel = document.getElementById('userLevel');

function registerChild() {
    const name = document.getElementById('childName').value.trim();
    if (!name) return notify("اكتب اسمك أولاً");

    currentUser = {
        name,
        points: 0,
        level: "مبتدئ"
    };

    saveData('currentUser', currentUser);
    loadUser();
}

function loadUser() {
    if (!currentUser) return;

    registrationSection.style.display = "none";
    userProfile.style.display = "block";
    navMenu.style.display = "flex";

    welcomeMessage.textContent = `مرحبًا ${currentUser.name} 👋`;
    pointsValue.textContent = currentUser.points;
    userLevel.textContent = currentUser.level;

    renderPages();
}

function renderPages() {
    document.getElementById('think').innerHTML =
        `<h2>🧠 أفكر</h2><ul>${thinkGames.map(g => `<li>${g}</li>`).join('')}</ul>`;

    document.getElementById('design').innerHTML =
        `<h2>🎨 أصمم</h2><ul>${designTasks.map(t => `<li>${t}</li>`).join('')}</ul>`;

    document.getElementById('ai').innerHTML =
        `<h2>🤖 ذكاء اصطناعي</h2><ul>${aiTasks.map(t => `<li>${t}</li>`).join('')}</ul>`;

    document.getElementById('projects').innerHTML =
        `<h2>🚀 المشاريع</h2><ul>${projects.map(p => `<li>${p}</li>`).join('')}</ul>`;
}

function showPage(id) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function notify(msg) {
    const n = document.getElementById('notification');
    n.textContent = msg;
    n.style.display = 'block';
    setTimeout(() => n.style.display = 'none', 3000);
}

loadUser();
