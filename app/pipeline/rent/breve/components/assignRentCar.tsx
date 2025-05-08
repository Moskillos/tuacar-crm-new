// pages/calendar.js
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
//import { updateAssignedRentCarDeal } from '@/app/api/rent/_actions/rent'
import { toast, Toaster } from "sonner";
import CalendarRent from "../../components/Calendar";
import TableSkeleton from "../../components/tableSkeleton";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";

export default function AssignRentCar({ rentCars, deal, togglePopupSelectCars, setDeal, setSelectedCar }: any) {

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

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [weekDays, setWeekDays] = useState<string[]>([])

    const navigateMonth = (direction: string, init: boolean) => {
        // Calculate new month and year based on direction
        let newMonth = currentMonth;
        let newYear = currentYear;

        if (!init) {
            if (direction === "prev") {
                newMonth = currentMonth - 1;
                if (newMonth < 0) {
                    newMonth = 11;
                    newYear -= 1;
                }
            } else {
                newMonth = currentMonth + 1;
                if (newMonth > 11) {
                    newMonth = 0;
                    newYear += 1;
                }
            }
        }

        // Update the state
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);

        // Create the date string in the format YYYY-MM-DD
        const dateStr = `${newYear}-${String(newMonth + 1).padStart(2, '0')}-01`;

        // Convert string to date object
        const dateObj = new Date(dateStr);

        // Array of days of the week
        const daysOfWeek = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];

        // Get the starting day of the week
        const startDay = dateObj.getDay();

        // Generate the array containing the next 12 days of the week
        const next12Days = [];
        for (let i = 0; i < 12; i++) {
            next12Days.push(daysOfWeek[(startDay + i) % 7]);
        }

        // Update the week days state
        setWeekDays(next12Days);

        // Debug logs
        //console.log("currentM: ", newMonth);
        //console.log("currentY: ", newYear);
        console.log(next12Days);
    };

    useEffect(() => {
        navigateMonth("", true)
    }, []);


    return (
        <div>
            <Toaster />
            <div>
                <div>
                    <div className="mx-auto w-full overflow-y-auto">
                        <div className="mt-10 mb-2">
                            <div className="flex items-center justify-between px-3 py-3 bg-gray-700 rounded-md">
                                <button className="text-white" onClick={() => navigateMonth("prev", false)}>
                                    <ChevronLeft />
                                </button>
                                <h2 id="currentMonth" className="text-white">
                                    {monthNames[currentMonth]} {currentYear}
                                </h2>
                                <button className="text-white" onClick={() => navigateMonth("next", false)}>
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>
                        {rentCars.length > 0 && (
                            <div className="grid grid-cols-1 gap-2 w-full">
                                {rentCars.map((c: any) => (
                                    <>
                                        <div
                                            className="border border-slate-200 p-4 rounded-xl hover:cursor-pointer hover:bg-slate-200"
                                            onClick={() => {
                                                setDeal((prevState: any) => ({
                                                    ...prevState,
                                                    carToRentId: c.id,
                                                    title: `Noleggio: ${c.make} ${c.model}`
                                                }));
                                                setSelectedCar(c);
                                                togglePopupSelectCars()
                                            }}
                                        >
                                            <div className="flex gap-4 w-full">
                                                <div className="flex flex-grow min-w-0">
                                                    <div className="w-[300px] overflow-hidden rounded-md shadow-[0_2px_10px] shadow-blackA4">
                                                        <AspectRatio.Root ratio={16 / 9}>
                                                            <img
                                                                className="size-full object-cover"
                                                                src={c.pictureToPublishUrl ? c.pictureToPublishUrl : ""}
                                                                alt="carImage"
                                                            />
                                                        </AspectRatio.Root>
                                                    </div>
                                                    <div className="flex flex-col max-w-xs ml-4 gap-2 overflow-hidden">
                                                        <span className="text-xs">
                                                            Veicolo:{" "}
                                                            <b>
                                                                {c.make} - {c.model}
                                                            </b>
                                                        </span>
                                                        <span className="text-xs">
                                                            Targa: <b>{c.targa}</b>{" "}
                                                        </span>
                                                        <span className="text-xs">
                                                            Agenzia: <b>{c.agenzia.description}</b>{" "}
                                                        </span>
                                                        {c.status.name == "Disponibile" &&
                                                            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Disponibile</span>
                                                        }
                                                        {c.status.name == "Noleggiata" &&
                                                            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Noleggiata</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <CalendarRent
                                                        rentDays={c.rentDays}
                                                        currentYear={currentYear}
                                                        currentMonth={currentMonth}
                                                        weekDays={weekDays}
                                                        erpId={c.id}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </div>
                        )}
                        {!rentCars && (
                            <TableSkeleton />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
