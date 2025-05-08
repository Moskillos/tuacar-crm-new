'use client';

import { formatCurrencyEUR } from "@/lib/utils";

const GarageCarDetails = (lead: any) => {

    return (
        <>
            <tr className="border-t border-gray-200" >
                <td className="px-4 py-2" >Prezzo di vendita</td>
                <td className="px-4 py-2" >{formatCurrencyEUR(lead.lead.prezzoDiVendita)}</td>
            </tr>
            <tr className="border-t border-gray-200" >
                <td className="px-4 py-2" > Prezzo di riserva </td>
                <td className="px-4 py-2" > {formatCurrencyEUR(lead.lead.prezzoDiRiserva)} </td>
            </tr>
            <tr className="border-t border-gray-200" >
                <td className="px-4 py-2" > Km </td>
                <td className="px-4 py-2" > {lead.lead.km} </td>
            </tr>
            <tr className="border-t border-gray-200" >
                <td className="px-4 py-2" > Scadenza bollo </td>
                <td className="px-4 py-2" > {lead.lead.scadenzaBollo ? lead.lead.scadenzaBollo : "Non specificata"} </td>
            </tr>
            <tr className="border-t border-gray-200" >
                <td className="px-4 py-2" > Scadenza revisione </td>
                <td className="px-4 py-2" > {lead.lead.scadenzaRevisione ? lead.lead.scadenzaRevisione : "Non specificata"} </td>
            </tr>
        </>
    );
};

export default GarageCarDetails;