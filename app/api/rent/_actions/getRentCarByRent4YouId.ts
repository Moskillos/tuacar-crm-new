"use server";
import pool from "@/lib/db";

export async function getRentCarByRent4YouId(erpId: string) {
    const [rows]: any = await pool.query(
        `SELECT 
            rentCars.*
        FROM 
            rentCars
        WHERE rentCars.erpId = ?`, [erpId.replaceAll(" ", "")]
    );

    return rows[0]

}