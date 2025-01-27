import fs from 'fs';
import { createInterface } from 'readline';

const read_lines = (filePath) => {
    return new Promise((resolve, reject) => {
        const lines = [];
        const readStream = createInterface({ input: fs.createReadStream(filePath) });
        readStream.on('line', (line) => lines.push(line));
        readStream.on('close', () => resolve(lines));
        readStream.on('error', (err) => reject(err));
    });
};

const generate_persons =  async () => {
    let persons_list = [];

    const first_names = await read_lines('src/first-names.txt');
    const last_names = await read_lines('src/last-names.txt');

    for (let i = 0; i < 100; i++) {
        const ID = crypto.randomUUID(); // generates UUID v4
        const first_name = first_names[Math.floor(Math.random() * first_names.length)];
        const last_name = last_names[Math.floor(Math.random() * last_names.length)];
        const email = `${first_name}.${last_name}@example.com`;
        const salary = (Math.random() * (150000 - 30000) + 30000).toFixed(2);

        persons_list.push([ID, first_name, last_name, email, salary])
    }
    return persons_list;
}


const format_csv = (persons) => {
    const header = "Id, First_Name, Last_Name, Email, Salary";
    const rows = persons.map(persons =>
      `${persons[0]},${persons[1]},${persons[2]},${persons[3]},${persons[4]}`
    );
    return [header, ...rows].join('\n');
  };
  
const persons = await generate_persons();
console.log(persons)
const csv_content = format_csv(persons);

fs.writeFileSync("src/persons.csv", csv_content);