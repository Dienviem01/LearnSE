// Untuk halaman edit.html (form)
document.addEventListener('DOMContentLoaded', function() {
    const idx = localStorage.getItem('editIdx');
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    // Jika idx tidak ada atau tidak valid, balik ke index.html
    if (idx === null || !todos[idx]) {
        return;
    }
    // Isi form dengan data todo yang akan diedit
    const task = todos[idx];
    document.getElementById('todo-input').value = task.todo || '';
    document.getElementById('begin-input').value = task.begin || '';
    document.getElementById('due-date-input').value = task.due || '';
    document.getElementById('priority-input').value = task.priority || '';
    document.getElementById('genre-input').value = task.genre || '';
    document.getElementById('desc-input').value = task.desc || '';
    // Fungsi klik untuk submit form edit
    document.getElementById('edit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // Validasi input
        const begin = document.getElementById('begin-input').value;
        const due = document.getElementById('due-date-input').value;
        // Validasi tanggal begin dan due
        if (!begin || !due) {
            alert('Begin date dan due date harus diisi!');
            return;
        }

        if (new Date(begin) > new Date(due)) {
            alert('Set the begin date same or less than due date!');
            return;
        }
        // Update todo yang sudah diedit
        todos[idx] = {
            todo: document.getElementById('todo-input').value,
            desc: document.getElementById('desc-input').value,
            begin,
            due,
            priority: document.getElementById('priority-input').value,
            genre: document.getElementById('genre-input').value
        };
        // Simpan kembali ke localStorage
        localStorage.setItem('todos', JSON.stringify(todos));
        localStorage.removeItem('editIdx');
        window.location.href = 'index.html';
    });
});
// Fungsi buat edit task
function editTask(idx) {
    localStorage.setItem('editIdx', idx);
    window.location.href = 'edit.html';
}
