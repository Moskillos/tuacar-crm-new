"use server";

import pool from "@/lib/db";
import { manageCalendarDates } from "./manageCalendarDates";

export async function updateRentDates(req: any) {

    const [rows]: any = await pool.query(
        `
        SELECT 
            carsToRent.*
        FROM carsToRent 
        WHERE carsToRent.id = ?
    `,
        [req['carToRentId']]
    );

    const existingCarToRent: any = rows[0];
    const existingCarToRentId: any = rows[0].insertId;

    if (!existingCarToRent) {
        throw new Error('car not found.');
    } else {
        console.log('found deal: ', existingCarToRent);
    }

    if (!existingCarToRent) {
        throw new Error("car not found.");
    }

    const query = `UPDATE carsToRent SET carsToRent.start = ?, carsToRent.end = ? WHERE carsToRent.id = ?`;
    await pool.query(query, [new Date(req['from']), new Date(req['to']), req['carToRentId']]);

    //AGGIUNGI DATE CALENDARIO
    await manageCalendarDates(
        {
            'action': 'fromUpdateRentDates',
            'req': req
        }
    )

    return existingCarToRentId
}