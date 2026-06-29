// =====================
// ABOUT PAGE
// SHOW/HIDE SKILLS
// =====================
function toggleSkills() {
    const skills = document.getElementById("skills");

    if (skills) {
        skills.style.display = (skills.style.display === "none") ? "block" : "none";
    }
}


// =====================
// EVENTS PAGE
// EVENT COUNTDOWN
// =====================
const countdown = document.getElementById("countdown");

if (countdown) {
    countdown.innerHTML = "Next Event: CSC106 Lab Assessment in 5 days";
}


// =====================
// APPOINTMENTS PAGE
// BOOK APPOINTMENT
// =====================
function bookAppointment() {

    const name = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const purpose = document.getElementById("purpose");
    const messageInput = document.getElementById("message");
    const output = document.getElementById("appointmentMessage");

    if (!name || !email || !phone || !purpose || !messageInput || !output) return;

    if (
        !name.value.trim() ||
        !email.value.trim() ||
        !phone.value.trim() ||
        !purpose.value ||
        !messageInput.value.trim()
    ) {
        output.innerHTML = "❌ Please fill in all fields before submitting.";
        output.style.color = "red";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
        output.innerHTML = "❌ Enter a valid email address.";
        output.style.color = "red";
        return;
    }

    const cleanPhone = phone.value.replace(/\s/g, "");

    if (!cleanPhone.match(/^\+?[0-9]{7,15}$/)) {
        output.innerHTML = "❌ Phone must contain only numbers (7–15 digits, optional +).";
        output.style.color = "red";
        return;
    }

    output.innerHTML = "✅ Message sent successfully!<br>Thank you for contacting us!";
    output.style.color = "green";
    output.style.fontWeight = "bold";

    const inbox = JSON.parse(localStorage.getItem("messages")) || [];

    inbox.push({
        name: name.value,
        email: email.value,
        phone: phone.value,
        purpose: purpose.value,
        message: messageInput.value,
        time: new Date().toLocaleString()
    });

    localStorage.setItem("messages", JSON.stringify(inbox));

    document.getElementById("contactForm").reset();
}


// =====================
// PROJECTS PAGE
// UPDATE PROJECT STATUS
// =====================
function updateProjectStatus(projectId) {

    const project = document.getElementById(projectId);

    if (!project) return;

    if (project.innerHTML === "Pending") {
        project.innerHTML = "In Progress";
    } else if (project.innerHTML === "In Progress") {
        project.innerHTML = "Completed";
    } else {
        project.innerHTML = "Completed";
    }
}


// =====================
// HOME PAGE CLOCK
// =====================
function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
    const dateString = now.toDateString();

    const dateTime = document.getElementById("dateTime");

    if (dateTime) {
        dateTime.innerHTML = `🕒 ${timeString} <br> 📅 ${dateString}`;
    }
}

setInterval(updateClock, 1000);
updateClock();


// =====================
// PLANNER SYSTEM (CLEAN SINGLE VERSION)
// =====================

let tasks = [];

// INIT
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    renderTasks();
    updateProgress();
});


// ADD TASK
function addTask() {

    const input = document.getElementById("newTask");
    const prioritySelect = document.getElementById("taskPriority");

    if (!input || !prioritySelect) return;

    const text = input.value.trim();
    if (text === "") return;

    const task = {
        id: Date.now(),
        text,
        priority: prioritySelect.value,
        completed: false
    };

    tasks.push(task);

    input.value = "";

    saveTasks();
    renderTasks();
    updateProgress();
}


// RENDER TASKS
function renderTasks() {

    const list = document.getElementById("taskList");
    if (!list) return;

    list.innerHTML = "";

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "10px";
        li.style.marginBottom = "8px";
        li.style.background = "#f5f7fb";
        li.style.borderRadius = "8px";

        li.innerHTML = `
            <div style="display:flex; gap:10px; align-items:center;">
                <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${task.id})">

                <span style="text-decoration:${task.completed ? "line-through" : "none"}">
                    ${getPriorityIcon(task.priority)} ${task.text}
                </span>
            </div>

            <button onclick="deleteTask(${task.id})"
                style="background:red;color:white;border:none;padding:5px 8px;border-radius:5px;">
                ❌
            </button>
        `;

        list.appendChild(li);
    });
}


// TOGGLE COMPLETE
function toggleTask(id) {

    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    saveTasks();
    renderTasks();
    updateProgress();
}


// DELETE TASK
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
    updateProgress();
}


// PROGRESS
function updateProgress() {

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const text = document.getElementById("progressText");
    const bar = document.getElementById("progressBar");

    if (text) text.innerText = `${percent}% Completed`;
    if (bar) bar.value = percent;
}


// LOCAL STORAGE SAVE
function saveTasks() {
    localStorage.setItem("plannerTasks", JSON.stringify(tasks));
}


// LOCAL STORAGE LOAD
function loadTasks() {
    const stored = localStorage.getItem("plannerTasks");

    if (stored) {
        tasks = JSON.parse(stored);
    }
}


// PRIORITY ICONS
function getPriorityIcon(priority) {
    switch (priority) {
        case "high": return "🔥";
        case "medium": return "⚡";
        case "low": return "💤";
        default: return "";
    }
}


// =====================
// DARK MODE (FIXED SYSTEM)
// =====================

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    const btn = document.getElementById("darkModeBtn");

    if (btn) {
        btn.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
}

window.addEventListener("DOMContentLoaded", () => {

    const savedTheme = localStorage.getItem("theme");
    const btn = document.getElementById("darkModeBtn");

    // FIRST VISIT DEFAULT = DARK MODE
    if (!savedTheme) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    }

    // APPLY SAVED THEME
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // BUTTON TEXT UPDATE
    if (btn) {
        btn.innerText =
            document.body.classList.contains("dark-mode")
                ? "☀️ Light Mode"
                : "🌙 Dark Mode";
    }
});


// =====================
// PHONE INPUT SAFETY
// =====================
document.addEventListener("DOMContentLoaded", () => {

    const phoneInput = document.getElementById("phone");

    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9+]/g, "");
        });
    }
});

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // runs once only
        }
    });
}, {
    threshold: 0.15
});

// apply observer
cards.forEach(card => {
    observer.observe(card);
});

window.addEventListener("load", function () {
    const loader = document.getElementById("loader");

    if (loader) {
        loader.classList.add("hide");

        setTimeout(() => {
            loader.style.display = "none";
        }, 600);
    }
});

// =====================
// BACK TO TOP BUTTON
// =====================

let topBtn = document.getElementById("topBtn");

window.addEventListener("DOMContentLoaded", function () {

    let topBtn = document.getElementById("topBtn");

    if (!topBtn) return;

    window.addEventListener("scroll", function () {

        if (window.scrollY > 100) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }

    });

    window.scrollToTop = function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

});

window.addEventListener("DOMContentLoaded", function () {

    const links = document.querySelectorAll("nav ul li a");

    let currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {

        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }

    });

});