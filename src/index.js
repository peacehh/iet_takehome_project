import express from 'express';
import fs from 'fs';
import Papa from 'papaparse';
const app = express();
const PORT = 8080;


app.listen(
    PORT,
    () => console.log(`its alive on http://localhost:${PORT}`)
);


//load persons.csv in memory
const load_persons = async () => {
    try {
        const data = await fs.promises.readFile('src/persons.csv', 'utf8');
        const persons = Papa.parse(data, { header: true }).data;
        return persons;
    } catch (err) {
        console.error('Error parsing person data:', err);
        throw err;
    }
};

let persons_json = await load_persons();

