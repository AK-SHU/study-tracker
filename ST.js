// ELEMENTS
const taskInput = document.getElementById("taskInput");
const hoursInput = document.getElementById("hoursInput");
const goalInput = document.getElementById("goalInput");
const totalHoursEl = document.getElementById("totalHours");
const streakEl = document.getElementById("streak");

// DATA
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let goal = localStorage.getItem("goal") || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;

// LOGIN FUNCTION
function login() {
    let name = document.getElementById("username").value;

    if (!name) {
        alert("Enter your name");
        return;
    }

    localStorage.setItem("user", name);

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("app").style.display = "block";

    document.getElementById("welcomeText").innerText = `Hi ${name} 👋`;

    render(); // IMPORTANT
}

// AUTO LOGIN
window.onload = function () {
    let user = localStorage.getItem("user");

    if (user) {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("app").style.display = "block";

        document.getElementById("welcomeText").innerText = `Hi ${user} 👋`;

        render();
    }
};

// SAVE
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD TASK
function addTask() {
    let task = taskInput.value.trim();
    let hours = hoursInput.value;

    if (!task || !hours) return alert("Fill all fields");

    tasks.push({
        task,
        hours: parseInt(hours),
        completed: false,
        date: new Date().toLocaleDateString()
    });

    save();
    taskInput.value = "";
    hoursInput.value = "";

    render();
}

// RENDER
function render() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    let total = 0;
    let today = new Date().toLocaleDateString();

    tasks.forEach((t, i) => {
        let li = document.createElement("li");

        if (t.completed) li.classList.add("completed");

        li.innerHTML = `
            <span onclick="editTask(${i})">${t.task} (${t.hours}h)</span>
            <div>
                <button onclick="toggle(${i})">✔</button>
                <button onclick="del(${i})">❌</button>
            </div>
        `;

        list.appendChild(li);

        if (t.completed && t.date === today) total += t.hours;
    });

    totalHoursEl.innerText = total;

    updateStreak(total);
    updateChart();
}

// TOGGLE
function toggle(i) {
    tasks[i].completed = !tasks[i].completed;
    save();
    render();
}

// DELETE
function del(i) {
    tasks.splice(i, 1);
    save();
    render();
}

// EDIT
function editTask(i) {
    let newTask = prompt("Edit task:", tasks[i].task);
    if (newTask) {
        tasks[i].task = newTask;
        save();
        render();
    }
}

// GOAL
function setGoal() {
    let val = goalInput.value;
    if (!val) return;

    goal = val;
    localStorage.setItem("goal", goal);
    document.getElementById("goal").innerText = goal;
}

// STREAK
function updateStreak(hours) {
    let today = new Date().toLocaleDateString();
    let lastDate = localStorage.getItem("lastDate");

    if (hours > 0) {
        if (lastDate !== today) {
            streak++;
            localStorage.setItem("lastDate", today);
        }
    } else if (lastDate !== today) {
        streak = 0;
    }

    localStorage.setItem("streak", streak);
    streakEl.innerText = streak;
}

// DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// CHART
let chart;

function updateChart() {
    let data = {};

    tasks.forEach(t => {
        if (t.completed) {
            data[t.date] = (data[t.date] || 0) + t.hours;
        }
    });

    let labels = Object.keys(data);
    let values = Object.values(data);

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("chart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Study Hours",
                data: values
            }]
        }
    });
}

// TIMER
let time = 1500;
let timer;

function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        time--;

        let min = Math.floor(time / 60);
        let sec = time % 60;

        document.getElementById("time").innerText =
            `${min}:${sec < 10 ? "0" : ""}${sec}`;

        if (time <= 0) {
            clearInterval(timer);
            alert("Time's up!");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    time = 1500;
    document.getElementById("time").innerText = "25:00";
}