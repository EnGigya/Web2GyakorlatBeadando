const tableBody = document.querySelector('#vizsgazoTable tbody');
const addForm = document.getElementById('addForm');

// Vizsgázók betöltése
async function loadVizsgazok() {
    const response = await fetch('/vizsgazo');
    const vizsgazok = await response.json();

    tableBody.innerHTML = '';
    vizsgazok.forEach(vizsgazo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vizsgazo.azon}</td>
            <td>${vizsgazo.nev}</td>
            <td>${vizsgazo.osztaly}</td>
            <td>
                <button onclick="deleteVizsgazo(${vizsgazo.azon})">Törlés</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Új vizsgázó hozzáadása
async function addVizsgazo(event) {
    event.preventDefault();

    const azon = parseInt(document.getElementById('azon').value, 10);
    const nev = document.getElementById('name').value;
    const osztaly = document.getElementById('class').value;

    await fetch('/vizsgazo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ azon, nev, osztaly })
    });

    addForm.reset();
    loadVizsgazok();
}

// Vizsgázó törlése
async function deleteVizsgazo(azon) {
    await fetch(`/vizsgazo/${azon}`, { method: 'DELETE' });
    loadVizsgazok();
}

document.addEventListener('DOMContentLoaded', loadVizsgazok);
addForm.addEventListener('submit', addVizsgazo);
