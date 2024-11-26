// Task osztály az egyedi feladatok reprezentálásához
class Task {
    constructor(name) {
        this.name = name;
        this.completed = false;
    }

    toggleCompletion() {
        this.completed = !this.completed;
    }
}

// TaskManager osztály az összes feladat kezeléséhez
class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(taskName) {
        const task = new Task(taskName);
        this.tasks.push(task);
        this.render();
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.render();
    }

    toggleTaskCompletion(index) {
        const task = this.tasks[index];
        task.toggleCompletion();
        this.render();
    }

    render() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Lista kiürítése

        this.tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = `task ${task.completed ? 'completed' : ''}`;

            // Feladat szövege
            const taskText = document.createElement('span');
            taskText.textContent = task.name;
            taskText.addEventListener('click', () => this.toggleTaskCompletion(index));

            // Törlés gomb
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteTask(index));

            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
        });
    }
}

// Inicializálás
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');

    addTaskBtn.addEventListener('click', () => {
        const taskName = taskInput.value.trim();
        if (taskName) {
            taskManager.addTask(taskName);
            taskInput.value = ''; // Input mező kiürítése
        }
    });
});
