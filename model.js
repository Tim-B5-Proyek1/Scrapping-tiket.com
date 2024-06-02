const model = {};

model.dataModel = (id, tglTerbang, hargaTiket, maskapai, tujuan, asalPenerbangan, jamBerangkat, jamSampai, transit) => {
    return {
        "id": id,
        "tgl terbang": tglTerbang,
        "maskapai": maskapai,
        "harga tiket": hargaTiket,
        "tujuan": tujuan,
        "asal penerbangan": asalPenerbangan,
        "jam berangkat": jamBerangkat,
        "jam sampai": jamSampai,
        "transit": transit
    }
}

module.exports = model;