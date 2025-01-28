# Overview
This project is a simple REST API that reads a CSV file containing 100 person records, validates the data, and provides endpoints to retrieve this information. The data in the csv is randomly generated using a database of first and last names.
# Features
Loads data from from `persons.csv` on startup
### Validation:
Validates records for the following requierments.
- Id: a unique UUID V4 Id
- First_Name: a string
- Last_Name: string
- Email: an email in the form `text@text.gmail.com`
- Salary: a valid number greater than 0
### Error handling
- Checks for duplicate Id and will end program.
- For all other invalid properties, program will skip loading that person and move on to the next person.
### End-Points:
- `GET /persons` Returns the first 10 records in JSON format.
```
http://localhost:8080/persons
```
- `Get /person/:id` Returns a person record given an ID. Respond with 404 error if ID does not exist.
```
http://localhost:8080/persons/814ea5b9-02c8-444e-bda0-ff5cf54d8658
```
- Will send a 500 Internal Server Error for all other issues during request handling.
# Setup Instructions
### Requirements
- Node.js
- npm
## Initialization
1. Clone Repository: 
```
git clone https://github.com/peacehh/iet_takehome_project
```
2. Open Project: 
```
cd path/to/iet_takehome_project
```
3. Install Project Dependencies: 
```
npm install
```
4. Generate person.csv records (if file doesnt exist): 
```
npm run create_persons
```
5. Start Server: 
```
npm run start
```