"use server";

export async function getRentCar(id: string) {
	let car: any = ""
	const params = {
		"apiKey": "bT7(lhAl<Mds@,x_.xIqE8'y$i=U#LL+COErf6bU;2TA,Yu(T6:P6-MJN;%#Kiin",
		"veicoloId": parseInt(id),
		"listinoId": 10,
		"dimensioneImmagine": 125,
		"orientamentoImmagine": '["125", "125"]',
		"anticipoZero": true,
		"aliquotaIva": 0
	}
	const options = {
		method: "POST",
		body: JSON.stringify(params),
		headers: {
			"Accept": "text/plain",
			"Content-Type": "application/json"
		}
	};
	await fetch("https://api.rent4business.it/v1/veicolo", options)
		.then((res) => res.json())
		.then((data) => {
			car = data
		})
	return car
}