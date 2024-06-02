const fs = require('fs');

// Membaca file input.json
fs.readFile('all_data.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }

    try {
        const data = JSON.parse(jsonString);

        // Menggunakan fetch untuk melakukan permintaan
        fetch('https://<url to database>', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    } catch (err) {
        console.log('Error parsing JSON string:', err);
    }
});
