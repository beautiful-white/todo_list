let tasks = []; // Массив для хранения задач

// Обработчик для заголовка
document.getElementById('title').addEventListener('click', function () {
    if (this.textContent === 'GOIDA LIST') {
        this.textContent = 'from RUSSIA WITH LOVE';
        this.style.color = '#b71c1c';
    } else {
        this.textContent = 'GOIDA LIST';
        this.style.color = '#d32f2f';
    }
    this.style.transition = 'color 0.5s ease';
});

// Добавление задачи
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Развертывание/свертывание списка "Выполнено"
document.getElementById('completedHeader').addEventListener('click', function () {
    const completedList = document.getElementById('completedList');
    const arrow = document.querySelector('#completedHeader .arrow');
    completedList.classList.toggle('visible');
    arrow.classList.toggle('rotated');
});

let currentEditingTask = null;

// Функция добавления задачи
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const taskList = document.getElementById('taskList');
        const li = document.createElement('li');
        const taskTextNode = document.createElement('span');
        taskTextNode.textContent = taskText;

        const buttons = document.createElement('div');
        buttons.className = 'buttons';

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✅';
        completeBtn.className = 'complete-btn';
        completeBtn.addEventListener('click', function () {
            moveTaskToCompleted(li);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.addEventListener('click', function () {
            li.remove();
            updateCompletedCount();
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', function () {
            currentEditingTask = taskTextNode;
            document.getElementById('editTaskInput').value = taskTextNode.textContent;
            document.getElementById('editPopup').classList.add('visible');
            document.getElementById('editTaskInput').focus();
        });

        buttons.appendChild(completeBtn);
        buttons.appendChild(editBtn);
        buttons.appendChild(deleteBtn);
        li.appendChild(taskTextNode);
        li.appendChild(buttons);
        taskList.prepend(li);
        taskInput.value = '';

        tasks.unshift(li); // Добавляем задачу в начало массива
    }
}

// Перемещение задачи в список "Выполнено"
function moveTaskToCompleted(task) {
    task.classList.add('completed');
    const taskList = document.getElementById('taskList');
    taskList.removeChild(task);
    const completedList = document.getElementById('completedList');
    task.removeChild(task.querySelector('.buttons'));
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.addEventListener('click', function () {
        completedList.removeChild(task);
        updateCompletedCount();
    });

    task.appendChild(deleteBtn);
    completedList.prepend(task);
    updateCompletedCount();
}

// Обновление счетчика выполненных задач
function updateCompletedCount() {
    const completedList = document.getElementById('completedList');
    const completedCount = document.getElementById('completedCount');
    const count = completedList.children.length;
    completedCount.textContent = count;
}

// Обработчики для popup
document.getElementById('saveEditBtn').addEventListener('click', function () {
    const newText = document.getElementById('editTaskInput').value.trim();
    if (newText !== '' && currentEditingTask) {
        currentEditingTask.textContent = newText;
        document.getElementById('editPopup').classList.remove('visible');
    }
});

document.getElementById('cancelEditBtn').addEventListener('click', function () {
    document.getElementById('editPopup').classList.remove('visible');
});

// Обработка клавиш Esc и Enter
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        if (document.getElementById('editPopup').classList.contains('visible')) {
            document.getElementById('editPopup').classList.remove('visible');
        } else {
            // Перемещаем последнюю задачу в список "Выполнено"
            const lastTask = tasks.find(task => !task.classList.contains('completed'));
            if (lastTask) {
                moveTaskToCompleted(lastTask);
            }
        }
    } else if (e.key === 'Enter') {
        if (document.getElementById('editPopup').classList.contains('visible')) {
            document.getElementById('saveEditBtn').click();
        } else {
            addTask();
        }
    }
});