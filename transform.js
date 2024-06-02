const fs = require('fs');

// Baca data dari input.json
fs.readFile('all_data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Gagal membaca file input.json:', err);
        return;
    }

    const input = JSON.parse(data);
    const output = { maskapai: [] };
    const maskapaiMap = {};

    input.forEach(flight => {
        const { maskapai, tgl_terbang } = flight;
        const formattedMaskapai = maskapai.replace(/\s+/g, '_').replace(/[+]/g, 'dan');

        if (!maskapaiMap[formattedMaskapai]) {
            maskapaiMap[formattedMaskapai] = {};
        }

        if (!maskapaiMap[formattedMaskapai][tgl_terbang]) {
            maskapaiMap[formattedMaskapai][tgl_terbang] = [];
        }

        maskapaiMap[formattedMaskapai][tgl_terbang].push(flight);
    });

    for (const [maskapai, flightsByDate] of Object.entries(maskapaiMap)) {
        const maskapaiObj = {};
        maskapaiObj[maskapai] = flightsByDate;
        output.maskapai.push(maskapaiObj);
    }

    // Tulis hasil ke output.json
    fs.writeFile('transform_data.json', JSON.stringify(output, null, 2), err => {
        if (err) {
            console.error('Gagal menulis file output.json:', err);
        } else {
            console.log('File output.json berhasil dibuat.');
        }
    });
});
