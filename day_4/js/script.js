document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const todo = document.getElementById('todo-input').value;
            const desc = document.getElementById('desc-input').value;
            const begin = document.getElementById('begin-input').value;
            const due = document.getElementById('due-date-input').value;
            const priority = document.getElementById('priority-input').value;
            const genre = document.getElementById('genre-input').value;

            if (!begin || !due) {
                alert('Begin date dan due date harus diisi!');
                return;
            }
            const beginDate = new Date(begin);
            const dueDate = new Date(due);
            if (beginDate > dueDate) {
                alert('Set the begin date same or less than due date!');
                return;
            }

            const todos = JSON.parse(localStorage.getItem('todos') || '[]');
            todos.push({ todo, desc, begin, due, priority, genre });
            localStorage.setItem('todos', JSON.stringify(todos));
            window.location.href = 'main.html';
        });
    }

    const list = document.getElementById('todo-list');
    if (list) {
        renderTodos();
    }

    const historyList = document.getElementById('history-list');
    if (historyList) {
        renderHistory();
    }

    const toggle = document.getElementById('dropup-toggle');
    const menu = document.getElementById('dropup-menu');
    if (toggle && menu) {
        let open = false;
        toggle.addEventListener('click', () => {
            open = !open;
            if (open) {
                menu.classList.remove('opacity-0', 'pointer-events-none');
                menu.classList.add('opacity-100');
            } else {
                menu.classList.add('opacity-0', 'pointer-events-none');
                menu.classList.remove('opacity-100');
            }
        });
    }
});

let editMode = false;
let deleteMode = false;
let currentSortField = 'begin';
let currentSortOrder = 'asc';

function renderTodos() {
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos.sort((a, b) => {
        let fieldA = a[currentSortField] || '';
        let fieldB = b[currentSortField] || '';
        if (currentSortField === 'begin' || currentSortField === 'due') {
            fieldA = fieldA ? new Date(fieldA) : new Date(0);
            fieldB = fieldB ? new Date(fieldB) : new Date(0);
            if (fieldA < fieldB) return currentSortOrder === 'asc' ? -1 : 1;
            if (fieldA > fieldB) return currentSortOrder === 'asc' ? 1 : -1;
            return 0;
        }
        fieldA = fieldA.toString().toLowerCase();
        fieldB = fieldB.toString().toLowerCase();
        if (fieldA < fieldB) return currentSortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return currentSortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    const list = document.getElementById('todo-list');
    if (!list) return;
    if (todos.length === 0) {
        list.innerHTML = '<div class="text-center text-blue-200">No to do yet.</div>';
        return;
    }
    let table = `
    <div class="overflow-x-auto">
    <table class="min-w-full text-blue-100 border-separate border-spacing-y-2 text-center">
        <thead>
            <tr class="bg-[#232946] text-blue-200">
                <th class="py-2 px-3 rounded-l-lg text-center">Task</th>
                <th class="py-2 px-3 text-center">Begin</th>
                <th class="py-2 px-3 text-center">Due</th>
                <th class="py-2 px-3 text-center">Priority</th>
                <th class="py-2 px-3 text-center">Genre</th>
                <th class="py-2 px-3 text-center">Details</th>
                ${editMode ? '<th class="py-2 px-3 rounded-r-lg text-center">Edit</th>' : ''}
                ${deleteMode ? '<th class="py-2 px-3 rounded-r-lg text-center">Delete</th>' : '<th class="py-2 px-3 rounded-r-lg text-center"></th>'}
            </tr>
        </thead>
        <tbody>
    `;
    todos.forEach((item, idx) => {
        table += `
        <tr class="bg-[#232946]/90 border border-blue-900 rounded-xl shadow hover:bg-[#232946] cursor-pointer transition text-center" onclick="showDesc(${idx})">
            <td class="py-2 px-3 font-semibold text-center">${item.todo}</td>
            <td class="py-2 px-3 text-center">${item.begin || '-'}</td>
            <td class="py-2 px-3 text-center">${item.due || '-'}</td>
            <td class="py-2 px-3 text-center">${item.priority || '-'}</td>
            <td class="py-2 px-3 text-center">${item.genre || '-'}</td>
            <td class="py-2 px-3 text-center">
                <button onclick="event.stopPropagation(); showDesc(${idx})" class="text-blue-300 hover:text-blue-400" title="Show Description">
                    <span class="material-icons align-middle">info</span>
                </button>
            </td>
            ${editMode ? `
            <td class="py-2 px-3 text-center">
                <button onclick="event.stopPropagation(); editTask(${idx})" class="text-yellow-400 hover:text-yellow-300" title="Edit Task">
                    <span class="material-icons align-middle">edit</span>
                </button>
            </td>
            ` : ''}
            ${deleteMode ? `
            <td class="py-2 px-3 text-center">
                <button onclick="event.stopPropagation(); deleteTask(${idx})" class="text-red-400 hover:text-red-300" title="Delete Task">
                    <span class="material-icons align-middle">delete</span>
                </button>
            </td>
            ` : '<td></td>'}
        </tr>
        `;
    });
    table += `
        </tbody>
    </table>
    </div>
    `;
    if (editMode || deleteMode) {
        table += `
        <div class="flex justify-center mt-4">
            <button onclick="cancelEditMode()" class="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition">
                <span class="material-icons">cancel</span> Cancel
            </button>
        </div>
        `;
    }
    list.innerHTML = table;
}

function showDesc(idx) {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const item = todos[idx];
    if (!item) return;
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/60 flex items-center justify-center z-50";
    modal.innerHTML = `
        <div class="bg-[#232946] border border-blue-900 rounded-xl p-6 max-w-md w-full text-blue-100 relative text-center">
            <button onclick="this.parentElement.parentElement.remove()" class="absolute top-2 right-3 text-blue-300 hover:text-red-400 text-xl">&times;</button>
            <h2 class="text-xl font-bold mb-2">${item.todo}</h2>
            <div class="mb-2 text-blue-300 text-sm">
                Date: ${item.begin || '-'}${item.due ? ' | Due: ' + item.due : ''}${item.priority ? ' | Priority: ' + item.priority : ''}${item.genre ? ' | Genre: ' + item.genre : ''}
            </div>
            <div class="mb-2">
                <span class="font-semibold">Description:</span>
                <div class="whitespace-pre-line mt-1">${item.desc || '-'}</div>
            </div>
            <div class="mt-4 flex justify-center">
                <button onclick="markAsDone(${idx}); this.closest('.fixed').remove();" class="px-5 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2">
                    <span class="material-icons">check_circle</span> Mark as Done
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}



