// Untuk halaman add.html (form)
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

            // --- Validasi tanggal begin dan due ---
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
            // --- Akhir validasi tanggal ---

            const todos = JSON.parse(localStorage.getItem('todos') || '[]');
            todos.push({ todo, desc, begin, due, priority, genre });
            localStorage.setItem('todos', JSON.stringify(todos));
            window.location.href = 'index.html';
        });
    }});