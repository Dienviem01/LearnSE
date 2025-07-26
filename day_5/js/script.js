document.addEventListener('DOMContentLoaded', function() {
    // Untuk halaman main.html (list tabel)
    const list = document.getElementById('todo-list');
    if (list) {
        renderTodos();
    }

    // Buat klik drop up menu munculin menu-menu
    const toggle = document.getElementById('dropup-toggle');
    const menu = document.getElementById('dropup-menu');
    if (toggle && menu) {
        let open = false;
        toggle.addEventListener('click', () => {
            open = !open;
            if(open) {
                menu.classList.remove('opacity-0', 'pointer-events-none');
                menu.classList.add('opacity-100');
            } else {
                menu.classList.add('opacity-0', 'pointer-events-none');
                menu.classList.remove('opacity-100');
            }
        });
    }
});

// Fungsi untuk menu di drop up menu
let editMode = false;
let deleteMode = false;
let currentSortField = 'begin';
let currentSortOrder = 'asc';

// Fungsi buat edit mode
function enableEditMode() {
    editMode = true;
    deleteMode = false;
    renderTodos();
}
// Fungsi buat delete mode
function enableDeleteMode() {
    deleteMode = true;
    editMode = false;
    renderTodos();
}
//Fungsi buat ga jadi edit atau delete, jadi 1 aja buttonnya
function cancelEditMode() {
    editMode = false;
    deleteMode = false;
    renderTodos();
}
// Fungsi untuk buka filter
function openFilterModal() {
    document.getElementById('filter-modal').classList.remove('hidden');
    document.getElementById('sort-field').value = currentSortField;
    document.getElementById('sort-order').value = currentSortOrder;
}
// Fungsi untuk nutup filter
function closeFilterModal() {
    document.getElementById('filter-modal').classList.add('hidden');
}

// Fungsi untuk dalam filter dan sort
document.addEventListener('DOMContentLoaded', function() {
    const filterBtn = document.querySelector('button[title="Filter"]');
    if (filterBtn) {
        filterBtn.onclick = function(e) {
            e.preventDefault();
            openFilterModal();
        };
    }
    // Fungsi untuk submit filter yang ditentukan
    const filterForm = document.getElementById('filter-form');
    if (filterForm) {
        filterForm.onsubmit = function(e) {
            e.preventDefault();
            currentSortField = document.getElementById('sort-field').value;
            currentSortOrder = document.getElementById('sort-order').value;
            closeFilterModal();
            renderTodos();
        };
    }
});

// Fungsi untuk render todos sama nampilin deskripsi todos
function renderTodos() {
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');
    // Ngurutin todos sesuai dengan field dan order yang dipilih
    todos.sort((a, b) => {
        let fieldA = a[currentSortField] || '';
        let fieldB = b[currentSortField] || '';
        // Untuk membandingkan tanggal
        if (currentSortField === 'begin' || currentSortField === 'due') {
            fieldA = fieldA ? new Date(fieldA) : new Date(0);
            fieldB = fieldB ? new Date(fieldB) : new Date(0);
            if (fieldA < fieldB) return currentSortOrder === 'asc' ? -1 : 1;
            if (fieldA > fieldB) return currentSortOrder === 'asc' ? 1 : -1;
            return 0;
        }
        // Untuk membandingkan string
        fieldA = fieldA.toString().toLowerCase();
        fieldB = fieldB.toString().toLowerCase();
        if (fieldA < fieldB) return currentSortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return currentSortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    // Nampilin todos ke dalam list
    const list = document.getElementById('todo-list');
    if (!list) return;
    if (todos.length === 0) {
        list.innerHTML = '<div class="text-center text-blue-200">No to do yet.</div>';
        return;
    }
    // Nampilin tabel todos
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
    // Nampilin setiap todo
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
    // Nampilin akhir tabel
    table += `
        </tbody>
    </table>
    </div>
    `;
    // Fungsi buat tombol cancel kalau dalam mode edit atau delete
    if (editMode || deleteMode) {
        table += `
        <div class="flex justify-center mt-4">
            <button onclick="cancelEditMode()" class="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition">
                <span class="material-icons">cancel</span> Cancel
            </button>
        </div>
        `;
    }
    // Set HTML list dengan tabel yang udah dibuat
    list.innerHTML = table;
}

// Fungsi buat nampilin deskripsi todo
function showDesc(idx) {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const item = todos[idx];
    // If-else untuk ngecek apakah item ada
    if (!item) return;
    // Buat nampilin tampilan deskripsi
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
    // Tambahin tampilan ke body
    document.body.appendChild(modal);
}

// Fungsi buat nandain selesai dan pindahin ke history
function markAsDone(idx) {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    const doneTask = { ...todos[idx], status: 'Completed' };
    history.push(doneTask);
    todos.splice(idx, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('history', JSON.stringify(history));
    renderTodos();
}









