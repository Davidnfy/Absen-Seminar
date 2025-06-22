let currentEditId = null;
let deleteId = null;

const absenForm = document.getElementById('absenForm');
const namaInput = document.getElementById('nama');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const absenTableBody = document.getElementById('absenTableBody');
const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');

function renderTable() {
    const absenData = absenStore.getData();
    absenTableBody.innerHTML = '';
    
    if (absenData.length === 0) {
        absenTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">Tidak ada data absensi</td>
            </tr>
        `;
        return;
    }
    
    absenData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.nama}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.jenisKelamin}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button data-id="${item.id}" class="edit-btn text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button data-id="${item.id}" class="delete-btn text-red-600 hover:text-red-900">Hapus</button>
            </td>
        `;
        absenTableBody.appendChild(row);
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEdit);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
}

function resetForm() {
    absenForm.reset();
    currentEditId = null;
    submitBtn.textContent = 'Simpan';
    submitBtn.className = 'px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 btn-animate';
}

absenForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nama = namaInput.value.trim();
    const jenisKelamin = document.querySelector('input[name="jenisKelamin"]:checked').value;
    
    if (!nama) {
        alert('Nama tidak boleh kosong');
        return;
    }
    
    if (currentEditId) {
        const success = absenStore.updateItem(currentEditId, { nama, jenisKelamin });
        if (success) {
            renderTable();
            resetForm();
            submitBtn.classList.add('bg-green-500');
            setTimeout(() => {
                submitBtn.classList.remove('bg-green-500');
            }, 1000);
        }
    } else {
        absenStore.addItem({ nama, jenisKelamin });
        renderTable();
        resetForm();
        submitBtn.classList.add('bg-green-500');
        setTimeout(() => {
            submitBtn.classList.remove('bg-green-500');
        }, 1000);
    }
});

function handleEdit(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const data = absenStore.getData();
    const item = data.find(item => item.id === id);
    
    if (item) {
        namaInput.value = item.nama;
        document.querySelector(`input[name="jenisKelamin"][value="${item.jenisKelamin}"]`).checked = true;
        
        currentEditId = id;
        submitBtn.textContent = 'Update';
        submitBtn.className = 'px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300 btn-animate';
        
        absenForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleDelete(e) {
    deleteId = parseInt(e.target.getAttribute('data-id'));
    deleteModal.classList.remove('hidden');
}

confirmDeleteBtn.addEventListener('click', function() {
    const deleted = absenStore.deleteItem(deleteId);
    if (deleted) {
        renderTable();
        deleteModal.classList.add('hidden');
        
        if (currentEditId === deleteId) {
            resetForm();
        }
    }
});

cancelDeleteBtn.addEventListener('click', function() {
    deleteModal.classList.add('hidden');
});

resetBtn.addEventListener('click', resetForm);

document.addEventListener('DOMContentLoaded', function() {
    resetForm();
    renderTable();
});

