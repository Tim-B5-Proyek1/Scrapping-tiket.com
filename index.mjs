

import puppeteer from 'puppeteer';
import fs from 'fs';
import moment from 'moment';
import config from './config.js';
import model from './model.js';

const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const convertToInteger = (priceString) => {
    const numericString = priceString.replace(/\D/g, ''); // Menghapus semua karakter non-digit
    return parseInt(numericString); // Mengonversi string menjadi integer
};

const generateFlightID = (index) => {
    let formattedIndex = '';

    if (index <= 999) {
        formattedIndex = String(index).padStart(3, '0');
    } else if (index <= 9999) {
        formattedIndex = String(index).padStart(4, '0');
    } else {
        formattedIndex = String(index).padStart(5, '0');
    }
    return `FL${formattedIndex}`;
};

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });

    let allData = []; // Array untuk menyimpan semua data dari setiap tanggal
    let currentIndex = 1;

    // Looping berdasarkan rentang tanggal dari config.startDate hingga config.endDate
    for (let currentDate = moment(config.startDate); currentDate.isBefore(moment(config.endDate)); currentDate.add(1, 'days')) {
        const page = await browser.newPage();

        // Masuk ke halaman web yang ingin di-scrape untuk tanggal saat ini
        await page.goto(
            config.getURLbyDate(currentDate.format('YYYY-MM-DD')),
            { waitUntil: 'networkidle0', timeout: 12000 });

        // Lakukan scraping untuk kutipan dan penulisnya
        const data = await page.evaluate(() => {
            const card = Array.from(document.querySelectorAll('.FlightCard_card__2LuC2'));

            return card.map(element => {
                const maskapai = element.querySelector('.AirlinesAndFacilities_airline_text__6YuoQ').innerText;
                const harga_tiket = element.querySelector('.Text_variant_alert__7jMF3').innerText;
                const tujuan = element.querySelector('.FlightCard_time_duration__GO_b1+ .FlightCard_time__ssfW4 .Text_size_b3__6n_9j').innerText;
                const asal_penerbangan = element.querySelector('.FlightCard_time__ssfW4:nth-child(1) .Text_size_b3__6n_9j').innerText;
                const jam_berangkat = element.querySelector('.FlightCard_time__ssfW4:nth-child(1) .Text_weight_bold__m4BAY').innerText;
                const jam_sampai = element.querySelector('.FlightCard_time_duration__GO_b1+ .FlightCard_time__ssfW4 .Text_weight_bold__m4BAY').innerText;
                const transit = element.querySelector('.FlightCard_arrow__aSJtN+ .Text_size_b3__6n_9j').innerText;
                return { maskapai, harga_tiket, tujuan, asal_penerbangan, jam_berangkat, jam_sampai, transit }
            });
        });

        const formattedData = data.map((item, index) => {
            currentIndex++;
            return model.dataModel(generateFlightID(currentIndex), currentDate.format('YYYY-MM-DD'), convertToInteger(item.harga_tiket), item.maskapai, item.tujuan, item.asal_penerbangan, item.jam_berangkat, item.jam_sampai, item.transit);
        });

        allData = allData.concat(formattedData); // Menggabungkan data dari setiap tanggal
        console.log(formattedData)

        await page.close();

        // Menunggu sejumlah waktu tertentu sebelum melanjutkan ke iterasi berikutnya
        await waitFor(5000); // Misalnya menunggu 5 detik
    }

    // Menyimpan semua data dalam satu file JSON
    fs.writeFileSync('all_data.json', JSON.stringify(allData, null, 2));

    console.log('Semua data telah disimpan dalam file all_data.json');

    await browser.close();
})();

