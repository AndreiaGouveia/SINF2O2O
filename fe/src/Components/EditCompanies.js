import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import './../CSS/Companies.css';

const companyController = require('../controllers/companiesController');
const db = require("../database/database");

async function SaveChanges(old_info) {

    let changes_made = true;

    for (let c = 0; c < old_info.length; c++) {
        changes_made &= updateCompanyInfo(c, old_info[c]);
    }

    if (changes_made) {
        // Alert saying company info was updated
        console.log("Finished updating company info");
    }
    else {
        // Alert saying no new info was inputted
        console.log("Input info was the same as old info");
    }
}

async function updateCompanyInfo(companyID, old_info) {

    let company = [];
    let new_info = document.querySelectorAll("#Company" + (companyID + 1) + " input");
    new_info.forEach(input => {
        company.push(input.value);
    });
    console.log(company);

    let changes_made = false;

    // Check if input info is new
    company.forEach(input => {
        if (input.value != old_info.input) {
            changes_made = true;
            break;
        }
    });

    if (changes_made) {

        // Send request to be to update the db
        try {

            let res = await axios.post('/companiesInfo/update/' + companyID, company);

            // Alert saying db was successfully updated
            console.log(res.data);
            return true;
        }
        catch (error) {
            alert(error);
        }
    }
        
    return false;
}

const EditCompanies = (props) => (
  <>
    <div id="Companies">
        <Row className="justify-content-around">
            <Col id="Company1"><h1>{props.info[0].client_id}</h1>{EditCompany(props.info[0])}</Col>
            <Col id="Company2"><h1>{props.info[1].client_id}</h1>{EditCompany(props.info[1])}</Col>
        </Row>
        <Row id="ButtonRow" className="justify-content-end">
            <Button variant="primary" onClick={SaveChanges(props.info)}>
                Save
            </Button>
            <Button variant="danger" href="/companies">
                Cancel
            </Button>
        </Row>
    </div>
  </>

);

function EditCompany(info) {
    return (
        <Card id="Company-Card">
            <Card.Body>
                <form>
                    <label for="Grant_Type">Grant_Type</label><br></br>
                    <input type="text" id="Grant_Type" name="Grant_Type" value={info.grant_type}></input><br></br>
                    <label for="Client_ID">Client_ID</label><br></br>
                    <input type="text" id="Client_ID" name="Client_ID" value={info.client_id}></input><br></br>
                    <label for="Client_Secret">Client_Secret</label><br></br>
                    <input type="text" id="Client_Secret" name="Client_Secret" value={info.client_secret}></input><br></br>
                    <label for="Scope">Scope</label><br></br>
                    <input type="text" id="Scope" name="Scope" value={info.scope}></input>
                </form>
            </Card.Body>
        </Card>
    );
}

export default EditCompanies;
