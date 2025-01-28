import express from 'express';
import fs from 'fs';
import Papa from 'papaparse';


//load and validate persons.csv in memory
const load_persons = async () => {
    const data = await fs.promises.readFile('src/persons.csv', 'utf8');
    let persons = Papa.parse(data, { header: true }).data;
    persons.forEach(person => {
        person.Salary = Number(person.Salary);
    });

    if (!validate_unique_Id(persons)) {
        throw "Dulplicate Person ID"
    };
    
    //skip any person with invalid data. display which person has invalid data.
    persons = persons.filter(person => {
        if (!validate_person(person)) {
            console.log(`Person validation failed for ID: ${person.Id}, skipping person`);
        }
        return validate_person(person);
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

let persons_json = await load_persons();
console.log(persons_json)

const app = express();
const PORT = 8080;


//start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.get('/persons/:id', (req, res) => {
    const Id = req.params.id;
    const person = persons_json.find(person => person.Id === Id)

    if (person) {
        res.send(person);
    } else {
        res.sendStatus(404);
    }
});

app.get('/persons', (req, res) => {
    res.send(persons_json.slice(0, 10));
});


