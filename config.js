const config = {};

config.hello = () => {
    console.log('Hello from config.js');
}

config.base_url = 'https://www.tiket.com/';
config.urlDestinationParams = {
    d: 'JKTC',
    a: 'SUB',
    date: '2024-05-18',
    adult: '1',
    child: '0',
    infant: '0',
    class: 'economy',
    dType: 'CITY',
    aType: 'AIRPORT',
    dLabel: 'Jakarta',
    aLabel: 'Surabaya',
    type: 'depart',
    flexiFare: 'true'
};
config.startDate = '2024-06-01';
config.endDate = '2025-06-01';
config.destination_list = 'SUBC';

config.getURL = () => {
    const params = Object.entries(config.urlDestinationParams).map(([key, value]) => `${key}=${value}`).join('&');
    return `${config.base_url}pesawat/search?${params}`;
};

config.getURLbyDate = (date) => {
    config.urlDestinationParams.date = date;
    return config.getURL();
};


module.exports = config