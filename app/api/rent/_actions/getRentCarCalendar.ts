"use server";
import pool from "@/lib/db";

export async function getRentCarCalendar(erpId: string) {

    const [rows]: any = await pool.query(
        `SELECT 
            carsToRent.*
        FROM 
            carsToRent
        WHERE carsToRent.erpId = ?`, [erpId.replaceAll(" ", "")]
    );

    return rows;

}