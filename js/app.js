let user = JSON.parse(localStorage.getItem("kcl-user")) || null;

const register = document.getElementById("register");
const dashboard = document.getElementById("dashboard");
const welcome = document.getElementById("welcome");
const pointsEl = document.getElementById("points");
const content = document.getElementById("content");

function start() {
  const name = document.getElementById("childName").value.trim();
  if (!name) return alert("اكتب اسمك أولاً 😊");

  user = { name, points: 0 };
  save();
  load();
}

function load() {
  if (!user) return;

  register.classList.add("hidden");
  dashboard.classList.remove("hidden");

  welcome.textContent = `مرحبًا ${user.name} 👋`;
  pointsEl.textContent = user.points;
}

function save() {
  localStorage.setItem("kcl-user", JSON.stringify(user));
}

function openSection(type) {
  let html = "";

  if (type === "think") {
    html = `
      <h3>🧠 مهمة تفكير</h3>
      <p>كم ناتج 5 + 3 ؟</p>
      <button onclick="complete()">الإجابة: 8</button>
    `;
  }

  if (type === "design") {
    html = `
      <h3>🎨 مهمة تصميم</h3>
      <p>صمّم بطاقة تهنئة في Canva</p>
      <button onclick="complete()">أنجزت التصميم</button>
    `;
  }

  if (type === "ai") {
    html = `
      <h3>🤖 مهمة ذكاء اصطناعي</h3>
      <p>اطلب من الذكاء الاصطناعي قصة قصيرة</p>
      <a href="https://gemini.google.com" target="_blank">اذهب إلى Gemini</a><br><br>
      <button onclick="complete()">أنجزت المهمة</button>
    `;
  }

  content.innerHTML = html;
}

function complete() {
  user.points += 10;
  pointsEl.textContent = user.points;
  save();
  alert("🎉 أحسنت! حصلت على 10 نقاط");
}

load();
