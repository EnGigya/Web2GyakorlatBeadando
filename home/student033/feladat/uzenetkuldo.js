
document.getElementById('messageForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const message = document.getElementById('message').value;

    if (!message.trim()) {
        alert("Kérlek, írj be egy üzenetet!");
        return;
    }

    try {
        // Küldés a Node.js szerverhez
        const response = await fetch('http://localhost:8033/uzenet', { // Állítsd be a megfelelő szervercímet
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uzenet: message })
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('response').textContent = "Üzenet sikeresen elküldve!";
            document.getElementById('message').value = ""; // Töröljük az űrlapot
        } else {
            document.getElementById('response').textContent = "Hiba történt: " + data.error;
        }
    } catch (error) {
        console.error("Hiba az üzenet küldésekor:", error);
        document.getElementById('response').textContent = "Hiba történt az üzenet küldésekor.";
    }
});

