"use server";

import pool from "@/lib/db";

export async function assignCar(req: any) {
    //UPDATE CAR TO RENT

    if (req.deal.id) {

        console.log("CAR TO RENT ALREADY EXIST")

        const assignedCar = {
            erpId: req.selectedCar?.id,
            plate: req.selectedCar?.targa,
            make: req.selectedCar?.make,
            model: req.selectedCar?.model,
            mileage: req.selectedCar?.km,
            description: req.selectedCar?.make + ' ' + req.selectedCar?.model,
            source: "Breve"
        }

        const updateFields = Object.entries(assignedCar)
            .map(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    return `${key} = NULL`; // Handle empty, null, or undefined values
                } else if (typeof value === 'string') {
                    return `${key} = '${value}'`; // Add single quotes for strings
                } else if (typeof value === 'boolean') {
                    return `${key} = ${value ? 1 : 0}`; // Convert boolean to 1/0 for SQL
                } else {
                    return `${key} = ${value}`; // Numbers or other types are not quoted
                }
            })
            .join(', ');

        const sqlQueryRentCars = `UPDATE carsToRent SET ${updateFields} WHERE carsToRent.id = ${req.deal.id};`;

        await pool.query(sqlQueryRentCars);

    } else {
        console.log("CARS TO RENT VA AGGIUNTA")

        const addCar = {
            contactId: req.deal?.dealContactId,
            source: 'Breve',
            agencyCode: 'AGENZIA_001',
            erpId: req.selectedCar.id,
            make: req.selectedCar.makeNormalized,
            model: req.selectedCar.model,
            mileage: req.selectedCar.km,
            fuelType: req.selectedCar.fuel.description,
            color: req.selectedCar.colore.description,
            plate: req.selectedCar.targa,
            rentStatus: 'init'
        }

        const sqlQueryRentCars = `INSERT INTO carsToRent SET ?`;
        const res: any = await pool.query(sqlQueryRentCars, [addCar]);

        const insertId = res[0].insertId;

        const updateDeal = {
            carToRentId: insertId
        }

        const updateFields = Object.entries(updateDeal)
            .map(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    return `${key} = NULL`; // Handle empty, null, or undefined values
                } else if (typeof value === 'string') {
                    return `${key} = '${value}'`; // Add single quotes for strings
                } else if (typeof value === 'boolean') {
                    return `${key} = ${value ? 1 : 0}`; // Convert boolean to 1/0 for SQL
                } else {
                    return `${key} = ${value}`; // Numbers or other types are not quoted
                }
            })
            .join(', ');

        const update = `UPDATE deals SET ${updateFields} WHERE deals.id = ${req.deal.dealId};`;

        await pool.query(update);

    }

    return true;
}