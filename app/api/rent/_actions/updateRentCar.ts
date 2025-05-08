"use server";

import pool from "@/lib/db";

export async function updateRentCar(updateCar: any, id: any) {
    if (updateCar && id) {

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
        const sqlQueryRentCars = `UPDATE rentCars SET ${updateFields} WHERE rentCars.id = ${id};`;

        await pool.query(sqlQueryRentCars);

    }

    return true;
}