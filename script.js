// Initialize shopping list and backup list from localStorage
let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
let backupList = JSON.parse(localStorage.getItem('backupList')) || [];

// Function to add item to the list
function addItem() {
  const input = document.getElementById('itemInput');
  const itemText = input.value.trim();
  
  if (itemText !== '') {
    const newItem = {
      id: Date.now(),
      text: itemText,
      completed: false
    };
    
    shoppingList.push(newItem);
    saveAndRender();
    input.value = '';
    input.focus();
  }
}

// Function to toggle item completion
function toggleComplete(id) {
  shoppingList = shoppingList.map(item => {
    if (item.id === id) {
      item.completed = !item.completed;
      if (item.completed) {
        alert(`Item completed: ${item.text}`);
        backupList.push({...item, completed: true});
        shoppingList = shoppingList.filter(i => i.id !== id);
      }
    }
    return item;
  });
  saveAndRender();
}

// Function to delete item
function deleteItem(id) {
  const item = shoppingList.find(item => item.id === id);
  if (item) {
    const price = prompt(`Enter the price for ${item.text}:`);
    if (price !== null) {
      item.price = parseFloat(price) || 0;
      backupList.push(item);
    }
  }
  shoppingList = shoppingList.filter(item => item.id !== id);
  saveAndRender();
}

// Function to save to localStorage and render the list
function saveAndRender() {
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  localStorage.setItem('backupList', JSON.stringify(backupList));
  renderList();
  renderBackupList();
}

// Function to render the shopping list
function renderList() {
  const listElement = document.getElementById('shoppingList');
  listElement.innerHTML = shoppingList.map(item => `
    <li class="${item.completed ? 'completed' : ''}">
      <span onclick="toggleComplete(${item.id})">${item.text}</span>
      <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
    </li>
  `).join('');
}

// Function to calculate total expenses
function calculateTotal() {
  return backupList.reduce((total, item) => total + (item.price || 0), 0);
}

// Function to render the backup list
function renderBackupList() {
  const backupElement = document.getElementById('backupList');
  backupElement.innerHTML = backupList.map(item => `
    <li class="${item.completed ? 'completed' : ''}">
      <div class="item-content">${item.text}</div>
      ${item.price ? `<div class="price">$${item.price.toFixed(2)}</div>` : ''}
      <button class="restore-btn" onclick="restoreItem(${item.id})">Restore</button>
    </li>
  `).join('');
  
  // Update total expenses display
  document.getElementById('totalAmount').textContent = calculateTotal().toFixed(2);
}

// Initial render when page loads
document.addEventListener('DOMContentLoaded', renderList);

// Function to restore item from backup list
function restoreItem(id) {
  const item = backupList.find(item => item.id === id);
  if (item) {
    shoppingList.push(item);
    backupList = backupList.filter(item => item.id !== id);
    saveAndRender();
  }
}

// Function to refresh both lists
function refreshLists() {
  if (confirm('Are you sure you want to clear all lists?')) {
    shoppingList = [];
    backupList = [];
    saveAndRender();
  }
}

// Handle Enter key in input field
document.getElementById('itemInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addItem();
  }
});
