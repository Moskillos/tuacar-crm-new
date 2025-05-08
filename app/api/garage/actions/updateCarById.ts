import pool from '@/lib/db';
import getCarById from './getCarById';

export default async function updateCarById(data: any) {

    try {
        const updates = [];
        const values = [];
        const carId = data.carId
        const carData = data.car

        const getCurrentCar: any = await getCarById({
            carId: carId
        })

        const currentCarAccessori = getCurrentCar.car[0]?.accessori // Parse current JSON or use an empty object

        for (const [key, value] of Object.entries(carData)) {
            if (key === 'accessori' && typeof value === 'object') {
                // Merge existing accessori with new values
                const mergedAccessori = { ...currentCarAccessori, ...value }; // Merge current and new data
                updates.push(`${key} = ?`);
                values.push(JSON.stringify(mergedAccessori)); // Serialize merged JSON
            } else if (typeof value !== 'object') {
                // Handle regular columns
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        // Construct SQL query
        const sqlQueryCar = `UPDATE garage SET ${updates.join(', ')} WHERE id = ?`;
        values.push(carId); // Add carId for the WHERE clause

        // Execute the query
        const [result] = await pool.query(sqlQueryCar, values);
        //console.log("Update Result:", result);
        return result;
    } catch (err) {
        console.error("Error updating car:", err);
        throw err;
    }

}
