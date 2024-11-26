
// Üzenetek betöltése és megjelenítése
async function loadMessages() {
const tableBody = document.querySelector('#messagesTable tbody');

try {
const response = await fetch('/uzenetek');
if (!response.ok) {
throw new Error('Nem sikerült lekérdezni az üzeneteket.');
}

const messages = await response.json();

// Tábla ürítése
tableBody.innerHTML = '';

// Üzenetek hozzáadása a táblázathoz
messages.forEach(message => {
const row = document.createElement('tr');
row.innerHTML = `
<td>${message.uzenetid}</td>
<td>${message.uzenet}</td>
`;
tableBody.appendChild(row);
});
} catch (error) {
console.error('Hiba történt:', error);
tableBody.innerHTML = '<tr><td colspan="2">Hiba történt az üzenetek betöltésekor.</td></tr>';
}
}

// Az oldal betöltésekor induljon el az üzenetek lekérdezése
document.addEventListener('DOMContentLoaded', loadMessages);
