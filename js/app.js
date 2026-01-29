let user = JSON.parse(localStorage.getItem("kcl-user"));

const register = document.getElementById("register");
const dashboard = document.getElementById("dashboard");
const welcome = document.getElementById("welcome");
const pointsEl = document.getElementById("points");
const content = document.getElementById("content");

const LEVEL_POINTS = [0, 30, 70, 120];

function start() {
  const name = document.getElementById("childName").value.trim();
  if (!name) return alert("اكتب اسمك أولاً 😊");

  user = {
    name,
    points: 0,
    level: 1,
    completed: []
  };

  save();
  load();
}

function load() {
  if (!user) return;

  register.classList.add("hidden");
  dashboard.classList.remove("hidden");

  welcome.textContent = `مرحبًا ${user.name} 👋 (المستوى ${user.level})`;
  pointsEl.textContent = user.points;
}

function save() {
  localStorage.setItem("kcl-user", JSON.stringify(user));
}

function openSection(type) {
  let tasks = [];

  if (type === "think") {
    tasks = [
      { id: "t1", text: "5 + 3 = ؟", answer: "8", level: 1 },
      { id: "t2", text: "10 - 4 = ؟", answer: "6", level: 2 },
      { id: "t3", text: "3 × 3 = ؟", answer: "9", level: 3 }
    ];
  }

  if (type === "design") {
    tasks = [
      { id: "d1", text: "صمّم بطاقة تهنئة", level: 1 },
      { id: "d2", text: "صمّم بوستر تعليمي", level: 2 },
      { id: "d3", text: "صمّم منشور إنستغرام", level: 3 }
    ];
  }

  if (type === "ai") {
    tasks = [
      { id: "a1", text: "اطلب قصة قصيرة", level: 1 },
      { id: "a2", text: "اسأل عن حيوان مفضل", level: 2 },
      { id: "a3", text: "اطلب فكرة لعبة", level: 3 }
    ];
  }

  renderTasks(tasks, type);
}

function renderTasks(tasks, type) {
  let html = `<h3>${type === "think" ? "🧠 أفكر" : type === "design" ? "🎨 أصمم" : "🤖 ذكاء اصطناعي"}</h3>`;

  tasks.forEach(task => {
    const locked = task.level > user.level;
    const done = user.completed.includes(task.id);

    html += `
      <div class="task ${locked ? "locked" : ""}">
        <p>${task.text}</p>
        ${
          locked
            ? `<span>🔒 مقفل</span>`
            : done
            ? `<span>✅ منجز</span>`
            : `<button onclick="completeTask('${task.id}', ${task.level})">أنجزت</button>`
        }
      </div>
    `;
  });

  content.innerHTML = html;
}

function completeTask(id, level) {
  if (user.completed.includes(id)) return;

  user.completed.push(id);
  user.points += 10;

  if (user.points >= LEVEL_POINTS[user.level]) {
    user.level++;
    alert(`🎉 ممتاز! وصلت للمستوى ${user.level}`);
  }

  save();
  load();
  content.innerHTML = "<p>✅ تم حفظ التقدم</p>";
}
