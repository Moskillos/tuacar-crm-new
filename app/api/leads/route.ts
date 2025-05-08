import { NextResponse } from 'next/server';
import getToday from './_actions/getToday';
import getSearch from './_actions/getSearch';
import getInterested from './_actions/getInterested';
import getAssigned from './_actions/getAssigned';
import getNotInterested from './_actions/getNotInterested';
import getCommercianti from './_actions/getCommercianti';
import getUnAssigned from './_actions/getUnAssigned';
import checkIfAssigned from './_actions/checkIfAssigned';
import assignLead from './_actions/assignLead';
import updateLead from './_actions/updateLead';
import saveNewLeads from './_actions/saveNewLeads';
import autoSaveNewLeads from './_actions/autoSaveNewLeads';
import getLeadById from './_actions/getLeadById';
import delLeadById from './_actions/delLeadById';
import delMultipleLeadsById from './_actions/delMultipleLeadsById';
import getGarage from './_actions/getGarage';

export async function POST(request: Request) {
	const req = await request.json();

	//REQUEST EMAILS FROM EMAILSADS

	if (req['action'] === 'today') {
		try {
			const res = await getToday(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'getLeadById') {
		try {
			const res = await getLeadById(req);
			return NextResponse.json({ msg: 'Success', data: res }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'delLeadById') {
		try {
			const res = await delLeadById(req);
			return NextResponse.json({ msg: 'Success', data: res }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'delMultipleLeadsById') {
		try {
			const res = await delMultipleLeadsById(req);
			return NextResponse.json({ msg: 'Success', data: res }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'saveNewLeads') {
		try {
			await saveNewLeads(req);
			return NextResponse.json({ msg: 'Success' }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'autoSaveNewLeads') {
		try {
			await autoSaveNewLeads();
			return NextResponse.json({ msg: 'Success' }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'garage') {
		try {
			const res = await getGarage(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	}
	else if (req['action'] === 'search') {
		try {
			const res = await getSearch(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'interested') {
		try {
			const res = await getInterested(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'assigned') {
		try {
			const res = await getAssigned(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'unassigned') {
		try {
			const res = await getUnAssigned(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'not_interested') {
		try {
			const res = await getNotInterested(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'commercianti') {
		try {
			const res = await getCommercianti(req);
			return NextResponse.json(
				{ msg: 'Success', data: res.rows, count: res.count },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'assign') {
		try {
			const res = await assignLead(req);
			return NextResponse.json({ msg: 'Success', data: res }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'checkIfAssigned') {
		try {
			const res = await checkIfAssigned(req);
			return NextResponse.json({ msg: 'Success', data: res }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else if (req['action'] === 'updateStatus') {
		try {
			const res = await updateLead(req);
			return NextResponse.json({ msg: 'Success', data: res }, { status: 200 });
		} catch (err) {
			console.error(err);
			return NextResponse.json({ msg: 'Error' }, { status: 500 });
		}
	} else {
		return NextResponse.json({ msg: 'Success' }, { status: 200 });
	}
}
