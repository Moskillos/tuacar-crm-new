'use client';

import { formatCurrencyEUR } from "@/lib/utils";

const PrezzarioRent = () => {

    const data = [
        {
            periodo: "Giornaliero",
            costo: 14,
            prezzario: 30,
            km: 100,
        },
        {
            periodo: "Settimanale",
            costo: 100,
            prezzario: 175,
            km: 800,
        },
        {
            periodo: "Quindicinnale",
            costo: 210,
            prezzario: 330,
            km: 1700,
        },
        {
            periodo: "Mensile",
            costo: 434,
            prezzario: 600,
            km: 2000,
        },
        {
            periodo: "Wend",
            costo: 42,
            prezzario: 70,
            km: 150,
        },
    ];

    return (
        <>
            {data.map((item) => (
                <tr className="border-t border-gray-200" key={item.periodo}>
                    <td className="px-4 py-2">{item.periodo}</td>
                    <td className="px-4 py-2">{formatCurrencyEUR(item.costo)}</td>
                    <td className="px-4 py-2">{formatCurrencyEUR(item.prezzario)}</td>
                    <td className="px-4 py-2">{item.km}</td>
                </tr>
            ))}
        </>
    );
};

export default PrezzarioRent;