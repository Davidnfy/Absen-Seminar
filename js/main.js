const API_URL = window.API_URL || 'http://localhost:5000/api/absen';

// DOM Elements
const absenForm = document.getElementById('absenForm');
const namaInput = document.getElementById('nama');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const absenTableBody = document.getElementById('absenTableBody');

let currentEditId = null;

// Fetch data dari server
async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Render tabel
function renderTable(data) {
    absenTableBody.innerHTML = '';
    
    if (!data.length) {
        absenTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">Tidak ada data absensi</td>
            </tr>
        `;
        return;
    }
    
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.nama}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.jenis_kelamin}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button data-id="${item.id}" class="edit-btn text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button data-id="${item.id}" class="delete-btn text-red-600 hover:text-red-900">Hapus</button>
            </td>
        `;
        absenTableBody.appendChild(row);
        
        // Tambahkan event listener
        row.querySelector('.edit-btn').addEventListener('click', () => handleEdit(item));
        row.querySelector('.delete-btn').addEventListener('click', () => handleDelete(item.id));
    });
}

// Handle form submit
absenForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nama = namaInput.value.trim();
    const jenis_kelamin = document.querySelector('input[name="jenisKelamin"]:checked').value;
    
    if (!nama) {
        alert('Nama tidak boleh kosong');
        return;
    }
    
    try {
        if (currentEditId) {
            // Update data
            await fetch(`${API_URL}/${currentEditId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nama, jenis_kelamin }),
            });
        } else {
            // Tambah data baru
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nama, jenis_kelamin }),
            });
        }
        
        resetForm();
        fetchData();
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle edit
function handleEdit(item) {
    namaInput.value = item.nama;
    document.querySelector(`input[name="jenisKelamin"][value="${item.jenis_kelamin}"]`).checked = true;
    currentEditId = item.id;
    submitBtn.textContent = 'Update';
    submitBtn.className = 'px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300 btn-animate';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle delete
async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            fetchData();
            if (currentEditId === id) {
                resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// Reset form
function resetForm() {
    absenForm.reset();
    currentEditId = null;
    submitBtn.textContent = 'Simpan';
    submitBtn.className = 'px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 btn-animate';
}

// Reset button
resetBtn.addEventListener('click', resetForm);

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});
