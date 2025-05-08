"use server";

import pool from "@/lib/db";

export async function updateAssignedRentCarDeal(updateCar: any, values: any, deal: any) {
    if (deal.carToRentId && deal.id) {

        //UPDATE RENT
        const updateFields = Object.entries(updateCar)
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

        // Assuming there's an id or some condition to identify which row to update
        const sqlQueryCarToRent = `UPDATE carsToRent SET ${updateFields} WHERE carsToRent.id = ${deal.carToRentId};`;

        await pool.query(sqlQueryCarToRent);


        //UPDATE DEAL
        const updateFieldsDeal = Object.entries(values)
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

        // Assuming there's an id or some condition to identify which row to update
        const sqlQueryDeal = `UPDATE deals SET ${updateFieldsDeal} WHERE deals.id = ${deal.id};`;

        await pool.query(sqlQueryDeal);
    }

    return true;
}