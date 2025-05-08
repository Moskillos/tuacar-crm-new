"use client";

import { useEffect, useState } from "react";
import CalendarRent from "./components/Calendar";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { getRent4YouCars } from "@/app/api/rent/_actions/getRent4YouCars";
import { getRentCarsFromERP } from "@/app/api/rent/_actions/getRentCarsFromERP";
import TableSkeleton from "./components/tableSkeleton";
import PrezzarioRent from "./components/prezzarioRent";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";

export default function Dashboard(isAdmin: any) {

    //GET RENT CARS FROM ERP
    const [rentCars, setRentCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getRentCars = async () => {
            setIsLoading(true);
            const res = await getRentCarsFromERP()
            setRentCars(res)
            setIsLoading(false)
        }

        getRentCars()
    }, []);


    //DATE RENT NAVIGATION
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
        for (let i = 0; i < 7; i++) {
            next12Days.push(daysOfWeek[(startDay + i) % 7]);
        }

        // Update the week days state
        setWeekDays(next12Days);
    };

    useEffect(() => {
        navigateMonth("", true)
    }, []);


    //SINCRONIZZA IL NOSTRO DB CON ERP (AUTO A NOLEGGIO)
    const synchRentCars = (action: string) => {
        console.log("synch")
        const params = {
            action: action,
            productId: "",
            bookingId: "",
            fromDate: "",
            toDate: ""
        };
        const options = {
            method: "POST",
            body: JSON.stringify(params),
        };
        fetch("/api/rent/manageTuaCarRentCars", options)
            .then((res) => res.json())
            .then((data) => {
                console.log("data: ", data)
            })
    }

    //RENT4YOU -> OTTIENE LA LISTA DI AUTO OFFERTE DA RENT4YOU.
    const [longTermCars, setLongTermCars] = useState<any>([])
    const [longTermCarsLoading, setLongTermCarsLoading] = useState(true)
    useEffect(() => {
        const getLongTermRentCars = async () => {
            setLongTermCarsLoading(true);
            try {
                const rent4you = await getRent4YouCars();
                setLongTermCars(rent4you);
            } catch (error) {
                console.error("Error fetching long term cars:", error);
            } finally {
                setLongTermCarsLoading(false);
            }
        };

        getLongTermRentCars();
    }, []);

    //SEARCH FILTER
    const [search, setSearch] = useState("")

    //RENT TAB FILTER
    const [tabFilter, setTabFilter] = useState("lungo")

    console.log("rentCars: ", rentCars)

    return (
        <div className="max-h-[calc(92vh)] overflow-y-auto relative mt-10">
            <div className="px-6">
                <div className="flex items-center space-x-2 mt-7">
                    {/*
                    {isAdmin &&
                        <div>
                            <button onClick={() => synchRentCars("synch")} className="mr-1 rounded-xl bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-1 text-black w-full p-2 text-white">Sinc. breve</button>
                            <button onClick={() => synchRentCars("synch-long")} className="rounded-xl bg-gradient-to-r from-emerald-300 from-10% via-emerald-400 via-30% to-emerald-500 to-100% p-1 text-black w-full p-2 text-white">Sinc. lungo</button>
                            <p className="text-xs fond-semibold">*soluzione manuale temporanea</p>
                        </div>
                    }
                        */}
                </div>

                <div className="flex items-center justify-between px-6 py-3 bg-gray-700 rounded-md mb-2">
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
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-gray-800 dark:text-gray-200 font-semibold text-xs">
                            Prezzi noleggio
                        </h3>
                        <div className="overflow-x-auto mt-5">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700 text-xs">
                                        <th className="px-4 py-2 text-left">Periodo</th>
                                        <th className="px-4 py-2 text-left">Costo</th>
                                        <th className="px-4 py-2 text-left">Prezzario</th>
                                        <th className="px-4 py-2 text-left">KM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <PrezzarioRent />
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-4 border border-slate-100 rounded-2xl">
                                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                    Utile Mese
                                </p>
                                <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                                    0
                                </p>
                            </div>
                            <div className="p-4 border border-slate-100 rounded-2xl">
                                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                    Totale noleggi
                                </p>
                                <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                                    0
                                </p>
                            </div>
                            <div className="p-4 border border-slate-100 rounded-2xl">
                                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                    Leads gestiti
                                </p>
                                <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                                    0
                                </p>
                            </div>
                            <div className="p-4 border border-slate-100 rounded-2xl">
                                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                    In attesa
                                </p>
                                <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                                    0
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full mt-2 px-6 py-6">
                <div className="grid w-full grid-cols-2">
                    <div className="p-1 bg-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 rounded-2xl font-semilight">
                        <div
                            onClick={() => setTabFilter('breve')}
                            className={`${tabFilter == 'breve' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
                        >
                            <p>Breve</p>
                        </div>
                        <div
                            onClick={() => setTabFilter('lungo')}
                            className={`${tabFilter == 'lungo' ? 'bg-white shadow-lg' : ''} "hover:cursor-pointer hover:bg-white p-2 rounded-2xl flex justify-center items-center"`}
                        >
                            <p>Lungo</p>
                        </div>
                    </div>
                </div>
                
                <div className="w-1/2 mt-2">
                    <input
                        className="font-light rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3"
                        value={search}
                        onChange={e =>
                            setSearch(e.target.value)
                        }
                        placeholder="Cerca auto"
                    />
                </div>

                {tabFilter == 'breve' &&
                    <div>
                        <div className="">
                            {!isLoading && (
                                <div className="grid grid-cols-1 gap-2 w-full">
                                    {rentCars
                                        .filter((c: any) =>
                                            c.make.toLowerCase().includes(search.toLowerCase()) ||
                                            c.model.toLowerCase().includes(search.toLowerCase()) ||
                                            c.targa.toLowerCase().includes(search.toLowerCase())
                                        )
                                        .map((c: any) => (
                                            <div className="border border-slate-200 p-4 rounded-xl" key={c.id}>
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
                                        ))}
                                </div>
                            )}
                            {isLoading && (
                                <TableSkeleton />
                            )}
                        </div>
                    </div>
                }
                {tabFilter == 'lungo' &&
                    <div>
                        <div className="">
                            {!longTermCarsLoading && (
                                <div className="grid grid-cols-1 gap-2 w-full">
                                    {longTermCars
                                        .filter((c: any) =>
                                            c.marca.toLowerCase().includes(search.toLowerCase()) ||
                                            c.modello.toLowerCase().includes(search.toLowerCase()) ||
                                            c.allestimento.toLowerCase().includes(search.toLowerCase()) ||
                                            c.motore.toLowerCase().includes(search.toLowerCase())
                                        )
                                        .map((c: any) => (
                                            <div className="border border-slate-200 p-4 rounded-xl" key={c.id}>
                                                <div className="flex gap-4 w-full">
                                                    <div className="flex flex-grow min-w-0">
                                                        <div className="w-[300px] overflow-hidden rounded-md shadow-[0_2px_10px] shadow-blackA4">
                                                            <AspectRatio.Root ratio={16 / 9}>
                                                                <img
                                                                    className="size-full object-cover"
                                                                    src={c.urlImmagineVeicolo ? c.urlImmagineVeicolo.split("&lato")[0] : ""}
                                                                    alt="carImage"
                                                                />
                                                            </AspectRatio.Root>
                                                        </div>
                                                        <div className="flex flex-col max-w-xs ml-4 gap-2 overflow-hidden">
                                                            <span className="text-xs">
                                                                Veicolo:{" "}
                                                                <b>
                                                                    {c.marca} - {c.modello}
                                                                </b>
                                                            </span>
                                                            <span className="text-xs">
                                                                Allestimento: <b>{c.allestimento}</b>{" "}
                                                            </span>
                                                            <span className="text-xs">
                                                                Motore: <b>{c.motore}</b>{" "}
                                                            </span>

                                                            {c.statoConsegna == "ProntaConsegna" &&
                                                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Pronta Consegna</span>
                                                            }
                                                            {c.statoConsegna == "DaOrdinare" &&
                                                                <span className="bg-red-100 text-orange-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-orange-900 dark:text-orange-300">Da ordinare</span>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow">

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        )}
                                </div>
                            )}
                            {longTermCarsLoading && (
                                <TableSkeleton />
                            )}
                        </div>
                    </div>
                }
            </div>
        </div >
    );
}
