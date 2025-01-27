import express from 'express';
import fs from 'fs';
import Papa from 'papaparse';


//load and validate persons.csv in memory
const load_persons = async () => {
    const data = await fs.promises.readFile('src/persons.csv', 'utf8');
    const persons = Papa.parse(data, { header: true }).data;
    persons.forEach(person => {
        person.Salary = Number(person.Salary);
    });

    if (!validate_unique_Id(persons)) {
        throw "Dulplicate Person ID"
    };
    
    persons.forEach(person => {
        if (!validate_person(person)) {
            throw `Person validation failed for ID: ${person.Id} `
        }
    });

    return persons;
};

const validate_unique_Id = (persons) => {
    const persons_Ids = persons.map(person => person.Id);
    const persons_Ids_set = new Set(persons_Ids);

    return persons_Ids.length === persons_Ids_set.size;
}

const validate_person = (person) => (
    person.Id !== "" &&
    typeof person.First_Name === 'string' &&
    typeof person.Last_Name === 'string' &&
    typeof person.Email === 'string' &&
    /^\S+@\S+\.\S+$/.test(person.Email.toLowerCase()) &&
    typeof person.Salary === 'number' &&
    person.Salary > 0
);


app.listen(
    PORT,
    () => console.log(`its alive on http://localhost:${PORT}`)
);

let persons_json = await load_persons();
console.log(persons_json)

