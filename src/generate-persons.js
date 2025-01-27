import fs from 'fs';
import { createInterface } from 'readline';

/**
 * Reads all lines from a file asynchronously and returns them as an array.
 * 
 * @param {string} filePath - The path to the file to read.
 * @returns {Promise<string[]>} - A promise for an array of lines from the files.
 */

const read_lines = (filePath) => {
    return new Promise((resolve, reject) => {
        const lines = [];
        const readStream = createInterface({ input: fs.createReadStream(filePath) });
        readStream.on('line', (line) => lines.push(line));
        readStream.on('close', () => resolve(lines));
        readStream.on('error', (err) => reject(err));
    });
};

/**
 * Generates a list of 100 random persons with IDs, names, emails, and salaries.
 * Uses a txt file on first and last names
 * 
 * @returns {Promise<string[][]>} - A promise that for 2D array of persons.
 */
const generate_persons =  async () => {
    let persons_list = [];

    const first_names = await read_lines('src/first-names.txt'); // load first names in memory
    const last_names = await read_lines('src/last-names.txt');  // load last names in memory

    for (let i = 0; i < 100; i++) {
        const ID = crypto.randomUUID(); // generates UUID v4
        const first_name = first_names[Math.floor(Math.random() * first_names.length)]; //choose random first name
        const last_name = last_names[Math.floor(Math.random() * last_names.length)]; //choose random last name
        const email = `${first_name}.${last_name}@example.com`;
        const salary = (Math.random() * (150000 - 30000) + 30000).toFixed(2); // random salary between $30,000 and $120,000

        persons_list.push([ID, first_name, last_name, email, salary])
    }
    return persons_list;
}

/**
 * Formats a list of persons into a CSV string.
 * 
 * @param {string[][]} persons - A 2D array of person data.
 * @returns {string} - The CSV-formatted string.
 */
const format_csv = (persons) => {
    const header = "Id, First_Name, Last_Name, Email, Salary";
    const rows = persons.map(persons =>
      `${persons[0]},${persons[1]},${persons[2]},${persons[3]},${persons[4]}`
    );
    return [header, ...rows].join('\n');
  };


const persons = await generate_persons();
const csv_content = format_csv(persons);

fs.writeFileSync("src/persons.csv", csv_content);