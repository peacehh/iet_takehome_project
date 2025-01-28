import fs from 'fs';

/**
 * Generates a list of 100 random persons object with the following properties:
 *  - Id: A UUID V4 string
 *  - First_Name: string
 *  - Last_Name: string
 *  - Email: string in format `{First_Name}.{Last_Name}@example.com`.
 *  - Salary: a 2 decimal floating point between 30,000 and 120,000.
 * Retreives random first and last names from a txt file.
 * 
 * @param {number} num_results - The number of random persons to generate.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of person objects.
 */
const generate_persons =  async (num_results) => {

    let first_names = (await fs.promises.readFile("src/first-names.txt", 'utf8')).split('\n') 
    let last_names = (await fs.promises.readFile("src/last-names.txt", 'utf8')).split('\n') 

    let persons_list = Array.from({ length: 100 }, (_,__) => {
        const first_name = first_names[Math.floor(Math.random() * first_names.length)];
        const last_name = last_names[Math.floor(Math.random() * last_names.length)];
        return {
            Id: crypto.randomUUID(),
            First_Name: first_name,
            Last_Name: last_name,
            Email: `${first_name}.${last_name}@example.com`,
            Salary: (Math.random() * (150000 - 30000) + 30000).toFixed(2)
         }
    });

    return persons_list;
};

/**
 * Formats a list of persons into a CSV string.
 * 
 * @param {Object[]} persons - An array of person objects.
 * @returns {string} - The CSV formatted string.
 */
const format_csv = (persons) => {
    const header = "Id,First_Name,Last_Name,Email,Salary";
    const rows = persons.map(person =>
      `${person.Id},${person.First_Name},${person.Last_Name},${person.Email},${person.Salary}`
    );
    return [header, ...rows].join('\n');
};


const persons = await generate_persons(100);
const csv_content = format_csv(persons);

fs.writeFileSync("src/persons.csv", csv_content);