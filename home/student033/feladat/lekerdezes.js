document.addEventListener('DOMContentLoaded', () => {
    const tantargySelect = document.getElementById('tantargySelect');
    const eredmenyTableBody = document.getElementById('eredmenyTable').getElementsByTagName('tbody')[0];

    // Betöltjük a tantárgyakat a legördülő menübe
    async function loadTantargyak() {
        const response = await fetch('/tantargyak');
        const tantargyak = await response.json();

        tantargyak.forEach(tantargy => {
            const option = document.createElement('option');
            option.value = tantargy.azon;
            option.textContent = tantargy.nev;
            tantargySelect.appendChild(option);
        });
    }

    // Eredmények betöltése
    async function loadEredmenyek(tantargyId) {
        const response = await fetch(`/eredmenyek/${tantargyId}`);
        const eredmenyek = await response.json();
        
        // Táblázat frissítése
        eredmenyTableBody.innerHTML = '';
        eredmenyek.forEach(eredmeny => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${eredmeny.VizsgazoNeve}</td>
                <td>${eredmeny.Tantargy}</td>
                <td>${eredmeny.SzobeliEredmeny}</td>
                <td>${eredmeny.IrasbeliEredmeny}</td>
            `;
            eredmenyTableBody.appendChild(row);
        });
    }

    // Változtatás esetén új eredményeket töltünk be
    tantargySelect.addEventListener('change', () => {
        const tantargyId = tantargySelect.value;
        if (tantargyId) {
            loadEredmenyek(tantargyId);
        } else {
            eredmenyTableBody.innerHTML = '';
        }
    });

    // Inicializálás
    loadTantargyak();
});
