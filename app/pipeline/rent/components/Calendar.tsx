// pages/calendar.js
import { useState, useEffect } from "react";

function getDaysBetweenDates(start: any, end: any) {
	// Convert the start and end dates to Date objects
	const startDate = new Date(start);
	const endDate = new Date(end);

	// Create an array to store the dates
	const dates = [];

	// Iterate from the start date to the end date
	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
		// Format the date as "DD-MM-YYYY"
		const formattedDate = `${String(d.getDate()).padStart(2, "")}-${String(d.getMonth() + 1).padStart(
			2,
			""
		)}-${d.getFullYear()}`;
		dates.push(formattedDate);
	}

	return dates;
}

interface CalendarRentProps {
	rentDays: [];
	currentYear: number;
	currentMonth: number;
	weekDays: string[];
	erpId: string
}

export default function CalendarRent({ rentDays, currentYear, currentMonth, weekDays, erpId }: CalendarRentProps) {
	//const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	//const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
	const [daysInMonth, setDaysInMonth] = useState([]);

	useEffect(() => {
		const days = Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => i + 1);
		setDaysInMonth(days as []);
	}, [currentYear, currentMonth]);

	/*
	const monthNames = [
		"Gennaio",
		"Febbraio",
		"Marzo",
		"Aprile",
		"Maggio",
		"Giugno",
		"Luglio",
		"Agosto",
		"Settembre",
		"Ottobre",
		"Novembre",
		"Dicembre",
	];
	*/

	/*
	const ok = false;
	if (ok) {
		setCurrentYear(new Date().getFullYear());
		setCurrentMonth(new Date().getMonth());
	}
	*/

	//const [init, setInit] = useState<any>([]);
	const [rented, setRented] = useState<any>([]);
	const [hold, setHold] = useState<any>([]);

	/*
	const navigateMonth = (direction: string) => {
		if (direction === "prev") {
			setCurrentMonth((prevMonth) => (prevMonth - 1 < 0 ? 11 : prevMonth - 1));
			setCurrentYear((prevYear) => (currentMonth - 1 < 0 ? prevYear - 1 : prevYear));
		} else {
			setCurrentMonth((prevMonth) => (prevMonth + 1 > 11 ? 0 : prevMonth + 1));
			setCurrentYear((prevYear) => (currentMonth + 1 > 11 ? prevYear + 1 : prevYear));
		}
	};
	*/

	useEffect(() => {
		const initRentedDays = rentDays.filter((day: any) => day.rentStatus === "init");
		const holdRentedDays = rentDays.filter((day: any) => day.rentStatus === "hold");
		const rentedRentedDays = rentDays.filter((day: any) => day.rentStatus === "rented");

		const initTmp: any = [];
		const holdTmp: any = [];
		const rentTmp: any = [];

		initRentedDays.map((d: any) => {
			const get = getDaysBetweenDates(d.start, d.end);
			initTmp.push(...get);
		});
		holdRentedDays.map((d: any) => {
			const get = getDaysBetweenDates(d.start, d.end);
			holdTmp.push(...get);
		});
		rentedRentedDays.map((d: any) => {
			const get = getDaysBetweenDates(d.start, d.end);
			rentTmp.push(...get);
		});

		/*
		const initNew = initTmp.filter((value: any, index: any, self: any) => {
			return self.indexOf(value) === index;
		});
		*/
		const holdNew = holdTmp.filter((value: any, index: any, self: any) => {
			return self.indexOf(value) === index;
		});
		const rentNew = rentTmp.filter((value: any, index: any, self: any) => {
			return self.indexOf(value) === index;
		});

		//setInit(initNew);
		setHold(holdNew);
		setRented(rentNew);
	}, [rentDays]);



	return (
		<div className="lg:w-full md:w-9/12 sm:w-10/12 mx-auto">
			<div className="bg-white shadow-lg rounded-lg overflow-hidden">
				{/*
				<div className="flex items-center justify-between px-6 py-3 bg-gray-700">
					<button className="text-white" onClick={() => navigateMonth("prev")}>
						<ChevronLeft />
					</button>
					<h2 id="currentMonth" className="text-white">
						{monthNames[currentMonth]} {currentYear}
					</h2>
					<button className="text-white" onClick={() => navigateMonth("next")}>
						<ChevronRight />
					</button>
				</div>
	*/}
				<div className="grid grid-cols-7 gap-1 p-4 text-xs">
					{weekDays.map((d: string, index: number) => (
						<div className="text-center border cursor-pointer bg-blue-300" key={index+erpId}>{d}</div>
					))}

					{daysInMonth.map((day: string) => (
						<div
							key={day+erpId}
							className={
								rented.includes(
									day.toString() + "-" + (currentMonth + 1).toString() + "-" + currentYear.toString()
								)
									? "text-center border cursor-pointer bg-red-400"
									: /*
									: init.includes(
											day.toString() +
												"-" +
												(currentMonth + 1).toString() +
												"-" +
												currentYear.toString()
									  )
									? "text-center border cursor-pointer bg-gray-200"
									*/
									hold.includes(
										day.toString() +
										"-" +
										(currentMonth + 1).toString() +
										"-" +
										currentYear.toString()
									)
										? "text-center border cursor-pointer bg-orange-400"
										: "text-center border cursor-pointer bg-lime-400"
							}
						>
							{day}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
