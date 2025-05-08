import { NextResponse } from 'next/server';
import getContacts from './_actions/getContacts';
import getContactById from './_actions/getContactById';
import searchContact from './_actions/searchContact';
import updateContactById from './_actions/updateContactById';
import addContact from './_actions/addContact';
import deleteContact from './_actions/deleteContact';
import getContactDeals from './_actions/getContactDeals';
import getContactCars from './_actions/getContactCars';
import getContactCarsToBuy from './_actions/getContactCarsToBuy';
import pool from '@/lib/db';

export async function POST(request: Request) {
	const req = await request.json();

	if (req['action'] === 'get') {
		try {
			const res = await getContacts(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	}
	if (req['action'] === 'getContactById') {
		try {
			const res = await getContactById(req);
			return NextResponse.json({ msg: 'Success', data: res }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'updateById') {
		try {
			await updateContactById(req);
			return NextResponse.json({ msg: 'Success' }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'deleteById') {
		try {
			await deleteContact(req);
			return NextResponse.json({ msg: 'Success' }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'search') {
		try {
			const res = await searchContact(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'add') {
		try {
			const res = await addContact(req);
			return NextResponse.json({ msg: 'Success', data: res }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'getContactDeals') {
		try {
			const res = await getContactDeals(req);
			return NextResponse.json({ msg: 'Success', data: res }, { status: 200 });
		} catch (err) {
			console.log(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'getContactCars') {
		try {
			const res = await getContactCars(req);
			return NextResponse.json({ msg: 'Success', data: res }, { status: 200 });
		} catch (err) {
			console.log(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'getContactCarsToBuy') {
		try {
			const res = await getContactCarsToBuy(req);
			return NextResponse.json({ msg: 'Success', data: res }, { status: 200 });
		} catch (err) {
			console.log(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else {
		let contactLists = <object>[];

		if (req['filter'] == 'all') {
			const [rows] = await pool.query(
				`SELECT 
                        contacts.*
                    FROM 
                        contacts`
			);
			contactLists = rows;
		}
		if (req['filter'] == 'byName') {
			const [rows] = await pool.query(
				`
                    SELECT contacts.*
                           deals.title AS dealTitle, 
                           deals.id AS dealId, 
                           deals.createdAt AS dealCreatedAt 
                    FROM contacts 
                    JOIN deals ON contacts.id = deals.contactId 
                    WHERE LOWER(name) LIKE LOWER(?)
                    OR LOWER(email) LIKE LOWER(?)
                    OR LOWER(phoneNumber) LIKE LOWER(?)
                    LIMIT 100
                  `,
				[req['search'], req['search'], req['search']]
			);

			contactLists = rows;
		}
		if (req['filter'] == 'byUserId') {
			const [rows] = await pool.query(
				`SELECT 
                        contacts.*
                    FROM 
                        contacts
                    WHERE userId = ?
                    `,
				req['userId']
			);
			contactLists = rows;
		}
		if (req['filter'] == 'byCarErpId') {
			const [rows] = await pool.query(
				`SELECT 
                    contacts.*
                FROM 
                    contacts AS contacts
                JOIN 
                    cars AS cars ON contacts.carId = cars.id
                WHERE 
                    cars.erpId = ?`,
				[req['erpId']]
			);
			contactLists = rows;
		}
		if (req['filter'] == 'byRentCarErpId') {
			const [rows] = await pool.query(
				`SELECT 
                        contacts.*
                    FROM 
                        contacts AS contacts
                    JOIN carsToRent AS carsToRent ON contacts.carToRentId = carsToRent.id
                    WHERE carsToRent.erpId = ?
                    `,
				req['erpId']
			);
			contactLists = rows;
		}
		if (req['filter'] == 'byContactId') {
			const [rows] = await pool.query(
				`SELECT 
                        contacts.*
                    FROM 
                        contacts
                    WHERE contacts.id = ?
                    `,
				req['contactId']
			);
			contactLists = rows;
		}

		return NextResponse.json({
			status: 200,
			contactLists,
		});
	}
	/*
	else {
		return NextResponse.json({ msg: "Success" }, { status: 200 });
	}
		*/
}
