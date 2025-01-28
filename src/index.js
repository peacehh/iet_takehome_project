import express from 'express';
import fs from 'fs';
import Papa from 'papaparse';

/**
 * Loads a list of persons from a CSV file, validates the data, and returns the filtered list of persons.
 * 
 * @returns {Promise<Object[]>} - A promise that resolves to an array of validated person objects.
 */
const load_persons = async () => {
    const data = await fs.promises.readFile('src/persons.csv', 'utf8');
    let persons = Papa.parse(data, { header: true }).data;
    persons.forEach(person => {
        person.Salary = Number(person.Salary);
    });

    if (!validate_unique_Id(persons)) {
        throw "Dulplicate Person ID"
    };
    
    persons = persons.filter(person => {
        if (!validate_person(person)) {
            console.log(`Person validation failed for ID: ${person.Id}, skipping person`);
        }
        return validate_person(person);
    });    

    return persons;
};

/**
 * Checks whether all person objects in the list have unique IDs.
 * Each object should contain an Id property.
 * 
 * @param {Object[]} persons - An array of person objects.
 * @returns {boolean} - Returns true if all IDs are unique, otherwise false.
 */
const validate_unique_Id = (persons) => {
    const persons_Ids = persons.map(person => person.Id);
    const persons_Ids_set = new Set(persons_Ids);
    return persons_Ids.length === persons_Ids_set.size;
}

/**
 * Validates a person object to ensure it has all required properties and correct types.
 * The following checks are made:
 * - First_Name, Last_Name, Email, are all strings
 * - Email matches a regex pattern (characters@characters.characters)
 * - Salary is the number and greater than 0
 * 
 * @param {Object} person - A person object to validate.
 * @returns {boolean} - Returns true if the person object is valid, otherwise false.
 */
const validate_person = (person) => (
    person.Id !== "" &&
    typeof person.First_Name === 'string' &&
    typeof person.Last_Name === 'string' &&
    typeof person.Email === 'string' &&
    /^\S+@\S+\.\S+$/.test(person.Email.toLowerCase()) &&
    typeof person.Salary === 'number' &&
    person.Salary > 0
);

//load persons into memory
let persons_json = await load_persons();

// initialize server
const app = express();
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// handle get requests from "/persons/:id"
app.get('/persons/:id', (req, res) => {
    try {
        const Id = req.params.id;
        const person = persons_json.find(person => person.Id === Id)

        if (person) {
            res.send(person);
        } else {
            res.status(404).send("404 Error: Person not found");
        }
    } catch (error){
        res.status(500).send("500 Error: Internal Server Error");
    }
});

// handle get requests from "/persons"
app.get('/persons', (req, res) => {
    try {
        res.send(persons_json.slice(0, 10));
    } catch (error) {
        res.status(500).send("500 Error: Internal Server Error");
    }
});