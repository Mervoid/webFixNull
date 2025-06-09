// Credenciales fijas
const ADMIN_ID = 'admin';
const ADMIN_PASS = '98701';

// --- LOGIN (login.html) ---
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('adminId').value;
    const pass = document.getElementById('adminPass').value;
    if (id === ADMIN_ID && pass === ADMIN_PASS) {
      sessionStorage.setItem('isAdmin', 'true');
      window.location.href = 'inventory.html';
    } else {
      document.getElementById('errorMsg').textContent = 'Credenciales incorrectas';
    }
  });
}

// --- MOSTRAR LINK INVENTARIO (index.html) ---
if (document.getElementById('invMenuItem')) {
  if (sessionStorage.getItem('isAdmin') === 'true') {
    document.getElementById('invMenuItem').style.display = 'block';
  }
}

// --- CERRAR SESIÓN (inventory.html) ---
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
  });
}

// --- CRUD INVENTARIO (inventory.html) ---
let editingIndex = null;
const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');

const tableBody = document.querySelector('#inventoryTable tbody');
const modal = document.getElementById('itemModal');
const closeBtn = modal.querySelector('.close');
const newItemBtn = document.getElementById('newItemBtn');
const form = document.getElementById('itemForm');

function renderTable() {
  tableBody.innerHTML = '';
  inventory.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${item.imgUrl}" width="60"/></td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.description}</td>
      <td>S/.${item.price.toFixed(2)}</td>
      <td>${item.onSale ? 'Sí' : 'No'}</td>
      <td>${item.onSale ? 'S/.' + item.salePrice.toFixed(2) : '-'}</td>
      <td>
        <button onclick="editItem(${i})">✏️</button>
        <button onclick="deleteItem(${i})">🗑️</button>
      </td>`;
    tableBody.appendChild(tr);
  });
  localStorage.setItem('inventory', JSON.stringify(inventory));
}

function openModal(edit = false) {
  modal.style.display = 'block';
  document.getElementById('salePrice').disabled = !document.getElementById('onSale').checked;
  document.getElementById('modalTitle').textContent = edit ? 'Editar Producto' : 'Nuevo Producto';
}

closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target == modal) modal.style.display = 'none'; };
newItemBtn.onclick = () => {
  editingIndex = null;
  form.reset();
  openModal();
};

document.getElementById('onSale').addEventListener('change', e => {
  document.getElementById('salePrice').disabled = !e.target.checked;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const item = {
    imgUrl: document.getElementById('imgUrl').value,
    name: document.getElementById('name').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
    onSale: document.getElementById('onSale').checked,
    salePrice: parseFloat(document.getElementById('salePrice').value) || 0
  };
  if (editingIndex !== null) {
    inventory[editingIndex] = item;
  } else {
    inventory.push(item);
  }
  modal.style.display = 'none';
  renderTable();
});

window.editItem = function(i) {
  editingIndex = i;
  const item = inventory[i];
  document.getElementById('imgUrl').value = item.imgUrl;
  document.getElementById('name').value = item.name;
  document.getElementById('category').value = item.category;
  document.getElementById('description').value = item.description;
  document.getElementById('price').value = item.price;
  document.getElementById('onSale').checked = item.onSale;
  document.getElementById('salePrice').value = item.salePrice;
  openModal(true);
};

window.deleteItem = function(i) {
  if (confirm('¿Eliminar este producto?')) {
    inventory.splice(i, 1);
    renderTable();
  }
};

// Inicializar
if (tableBody) renderTable();
