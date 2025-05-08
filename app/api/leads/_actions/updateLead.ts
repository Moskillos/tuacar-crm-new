import pool from '@/lib/db';

export default async function updateLead(req: any) {
    /*
    const params = {
        action: 'updateStatus',
        id: lead.id,
        lead: lead,
        contactIsCommerciant: contactIsCommerciant,
        contactNotInterested: contactNotInterested,
        assign: assign,
        reset: reset
    };
    */

    // Define the SQL query with placeholders for parameters
    let sqlQuery = '';
    let values = [];

    if (req['type'] == 'assign') {
        sqlQuery = `
        UPDATE carsToBuy 
        SET
            isConfirmed = TRUE
        WHERE 
            carsToBuy.id = ?;
        `;
        values = req['id'];

        await pool.query(
            `
            UPDATE contacts 
            SET
                isConfirmed = TRUE
            WHERE 
                contacts.id = ?;
        `,
            req['lead']['contactId']
        );
    }

    if (req['type'] == 'reset') {
        sqlQuery = `
        UPDATE carsToBuy 
        SET
            isConfirmed = FALSE
        WHERE 
            carsToBuy.id = ?;
        `;
        values = req['id'];
        //RESET ALSO CONTACT!!!???
        await pool.query(
            `
            UPDATE contacts 
            SET
                contacts.isConfirmed = FALSE,
                contacts.notInterested = FALSE,
                contacts.isCommerciant = FALSE
            WHERE 
                contacts.id = ?;
        `,
            req['lead']['contactId']
        );
    }

    if (req['type'] == 'isCommerciant') {
        sqlQuery = `
        UPDATE contacts 
        SET
            isCommerciant = TRUE
        WHERE 
            contacts.id = ?;
        `;
        values = req['lead']['contactId'];

        //IS VISIBLE FALSE CARSTOBUY LEAD
        /*
        if (req['id']) {
            sqlQuery = `
                UPDATE carsToBuy 
                SET
                    isVisible = FALSE
                WHERE 
                    carsToBuy.id = ?;
            `;
            values = req['id'];
        }
            */
    }

    if (req['type'] == 'notInterested') {
        if (req['id']) {
            const sqlQueryCarToBuy = `
                UPDATE carsToBuy 
                SET
                    isVisible = FALSE,
                    spokiInterested = 'notInterested'
                WHERE 
                    carsToBuy.id = ?;
            `;
            const valuesCarToBuy = req['id'];

            await pool.query(sqlQueryCarToBuy, valuesCarToBuy);

            sqlQuery = `
        UPDATE contacts 
        SET
            notInterested = TRUE
            
        WHERE 
            contacts.id = ?;
        `;
            values = req['lead']['contactId'];
        }



        //IS VISIBLE FALSE CARSTOBUY LEAD

    }

    if (req['type'] == 'venduta') {
        //SE ESISTE UNA CARTOBUY,LIMITATI AD IMPOSTARE isSold = TRUE
        if (req['id']) {
            sqlQuery = `
                UPDATE carsToBuy 
                SET
                    isSold = TRUE
                WHERE 
                    carsToBuy.id = ?
            `;
            values = req['id'];
        } else {
            //ALTRIMENTI SI TRATTA DI UN AFFARE ACQUISIZIONE SENZA NESSUNA AUTO ASSOCIATA -> IMPOSTARE SU isFailed = TRUE
            sqlQuery = `
                UPDATE deals 
                SET
                    isFailed = TRUE
                WHERE 
                    deals.id = ?;
            `;
            values = req['lead']['dealId'];
        }
    }

    // Execute the query with the parameterized values
    await pool.query(sqlQuery, values);

    return true;
}
