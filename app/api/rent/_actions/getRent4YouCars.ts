"use server";

export async function getRent4YouCars() {
    let cars: any[] = []
    const params = {
        "apiKey": "bT7(lhAl<Mds@,x_.xIqE8'y$i=U#LL+COErf6bU;2TA,Yu(T6:P6-MJN;%#Kiin",
        "catalogoId": 5,
        "listinoId": 10,
        "dimensioneImmagine": 125,
        "orientamentoImmagine": '["125", "125"]',
        "anticipoZero": true,
        "aliquotaIva": 0
    };
    const options = {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json"
        }
    };
    await fetch("https://api.rent4business.it/v1/veicoli", options)
        .then((res) => res.json())
        .then((data) => {
            cars = data
        })
    return cars
}