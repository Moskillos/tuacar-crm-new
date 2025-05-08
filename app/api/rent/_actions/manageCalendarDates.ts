"use server";

import pool from "@/lib/db";

// Prepare activity data for SQL insertion
const prepareActivityData = (activity: any) => {
    const columns = Object.keys(activity).join(', ');
    const values = Object.values(activity)
        .map(value => {
            if (value === null || value === undefined || value === '') {
                return 'NULL'; // Handle empty, null, or undefined values
            } else if (typeof value === 'string') {
                return `'${value.replace(/'/g, "''")}'`; // Escape single quotes in strings
            } else if (typeof value === 'boolean') {
                return value ? 1 : 0; // Convert boolean to 1/0 for SQL
            } else {
                return value; // Numbers or other types are not quoted
            }
        })
        .join(', ');
    return { columns, values };
};

export async function manageCalendarDates(req: any) {

    console.log('req ', req)

    /* da aggiornamento date.
    req  {
        action: 'fromUpdateRentDeal',
        deal: {
            id: 1,
            userId: 'auth0|65a6bd83a1c75d3bc61a99f7',
            stageId: 17,
            title: 'test',
            value: 0,
            oldNotes: null,
            end: '2025-01-19T19:40:55.000Z',
            isAwarded: 0,
            createdAt: '2025-01-08T19:41:15.000Z',
            contactId: 120456,
            isFailed: 0,
            pipelineId: 4,
            agencyCode: 'AGENZIA_001',
            carToBuyId: 0,
            carId: null,
            carToRentId: 1,
            emailId: null,
            garageId: null,
            dealId: 8525,
            dealUserId: 'auth0|65a6bd83a1c75d3bc61a99f7',
            dealContactId: 120456,
            contactName: 'Leo',
            contactEmail: null,
            contactPhoneNumber: '3497943093',
            contactIsCommerciant: 0,
            contactNotInterested: 0,
            carToRentStatus: 'hold',
            source: 'Breve',
            erpId: '66a13df0644adcf06bacb31e',
            description: 'Mercedes-Benz Vito',
            make: 'Mercedes-Benz',
            model: 'Vito',
            mileage: 212500,
            powerKw: null,
            powerCv: null,
            fuelType: null,
            color: null,
            plate: 'FC041GK',
            start: '2025-01-16T19:40:55.000Z',
            isMessageSent: 0,
            isConfirmed: 0,
            rentStatus: 'hold',
            bookingId: null,
            productId: null
        }
    }

    req  {
        action: 'fromUpdateRentDates',
        req: {
            action: 'updateRentDates',
            carToRentId: 1,
            from: '2025-01-16T19:40:55.000Z',
            to: '2025-01-19T19:40:55.000Z'
        }
    }
    */

    if (req['action'] == 'fromUpdateRentDates') {
        const updateActivityStart = {
            start: req.req.from.split('T')[0] + 'T09:00:00.000Z',
            end: req.req.from.split('T')[0] + 'T10:00:00.000Z'
        };

        const updateActivityEnd = {
            start: req.req.to.split('T')[0] + 'T09:00:00.000Z',
            end: req.req.to.split('T')[0] + 'T10:00:00.000Z'
        };

        // Generate SQL SET clause for activityStart
        const updateFieldsStart = Object.entries(updateActivityStart)
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
        const sqlQueryActivityStart = `UPDATE activities SET ${updateFieldsStart} WHERE carToRentId = '${req.req.carToRentId}' AND action = 'consegna';`;
        await pool.query(sqlQueryActivityStart);

        // Generate SQL SET clause for activityEnd
        const updateFieldsEnd = Object.entries(updateActivityEnd)
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
        const sqlQueryActivityEnd = `UPDATE activities SET ${updateFieldsEnd} WHERE carToRentId = '${req.req.carToRentId}' AND action = 'riconsegna';`;
        await pool.query(sqlQueryActivityEnd);
    }


    if (req['action'] == 'fromUpdateRentDeal') {

        // Create activityStart object
        const activityStart = {
            userId: req.deal.userId,
            agencyCode: req.deal.agencyCode,
            contactId: req.deal.contactId,
            dealId: req.deal.dealId,
            carToRentId: req.deal.carToRentId,
            erpId: req.deal.erpId,
            title: 'Consegna ' + req.deal.make,
            start: req.deal.start.split('T')[0] + 'T09:00:00.000Z',
            end: req.deal.start.split('T')[0] + 'T10:00:00.000Z',
            allDay: false,
            action: 'consegna',
            isComplete: false,
            notes: '',
        };

        // Create activityEnd object
        const activityEnd = {
            userId: req.deal.userId,
            agencyCode: req.deal.agencyCode,
            contactId: req.deal.contactId,
            dealId: req.deal.dealId,
            carToRentId: req.deal.carToRentId,
            erpId: req.deal.erpId,
            title: 'Riconsegna ' + req.deal.make,
            start: req.deal.end.split('T')[0] + 'T09:00:00.000Z',
            end: req.deal.end.split('T')[0] + 'T10:00:00.000Z',
            allDay: false,
            action: 'riconsegna',
            isComplete: false,
            notes: '',
        };

        // Insert activityStart into the database
        const { columns: columnsStart, values: valuesStart } = prepareActivityData(activityStart);
        const sqlQueryActivityStart = `INSERT INTO activities (${columnsStart}) VALUES (${valuesStart});`;
        await pool.query(sqlQueryActivityStart);

        // Insert activityEnd into the database
        const { columns: columnsEnd, values: valuesEnd } = prepareActivityData(activityEnd);
        const sqlQueryActivityEnd = `INSERT INTO activities (${columnsEnd}) VALUES (${valuesEnd});`;
        await pool.query(sqlQueryActivityEnd);

        console.log("OKKKKKKK")

    }
}
