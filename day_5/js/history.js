document.addEventListener('DOMContentLoaded', function() {
    // Untuk halaman history.html (history)
    const historyList = document.getElementById('history-list');
    if (historyList) {
        renderHistory();
    }
});
// Fungsi buat hapus task dari tabel dan pindah ke history
function deleteTask(idx) {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    const deletedTask = { ...todos[idx], status: 'Deleted' };
    history.push(deletedTask);
    todos.splice(idx, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('history', JSON.stringify(history));
    renderTodos();
}
// Fungsi buat nampilin history
function renderHistory() {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    const list = document.getElementById('history-list');
    if (!list) return;
    if (history.length === 0) {
        list.innerHTML = '<div class="text-center text-blue-200">No history yet.</div>';
        return;
    }
    // Nampilin tabel history
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
                <th class="py-2 px-3 rounded-r-lg text-center">Details</th>
            </tr>
        </thead>
        <tbody>
    `;
    // Nampilin setiap item di history
    history.forEach((item, idx) => {
        table += `
        <tr class="bg-[#232946]/90 border border-blue-900 rounded-xl shadow hover:bg-[#232946] cursor-pointer transition text-center" onclick="showHistoryDesc(${idx})">
            <td class="py-2 px-3 font-semibold text-center">${item.todo}</td>
            <td class="py-2 px-3 text-center">${item.begin || '-'}</td>
            <td class="py-2 px-3 text-center">${item.due || '-'}</td>
            <td class="py-2 px-3 text-center">${item.priority || '-'}</td>
            <td class="py-2 px-3 text-center">${item.genre || '-'}</td>
            <td class="py-2 px-3 text-center">
                <button onclick="event.stopPropagation(); showHistoryDesc(${idx})" class="text-blue-300 hover:text-blue-400" title="Show Description">
                    <span class="material-icons align-middle">info</span>
                </button>
            </td>
        </tr>
        `;
    });
    table += `
        </tbody>
    </table>
    </div>
    `;
    list.innerHTML = table;
}
// Fungsi buat nampilin deskripsi dari history
function showHistoryDesc(idx) {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    const item = history[idx];
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
            <div class="mt-4">
                <span class="font-semibold">Status:</span>
                <span class="ml-2 ${item.status === 'Completed' ? 'text-green-400' : 'text-red-400'}">${item.status || '-'}</span>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}
// Fungsi buat hapus semua history
function clearHistory() {
    localStorage.removeItem('history');
    renderHistory();
}