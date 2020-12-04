import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import './../CSS/Companies.css';



function SaveChanges() {
    let company1 = [];
    let company2 = [];
    let temp = document.querySelectorAll("#Company1 input");
    temp.forEach(element => {
        company1.push(element.value);
    });
    console.log(company1);

    temp = document.querySelectorAll("#Company2 input");
    temp.forEach(element => {
        company2.push(element.value);
    });
    console.log(company2);
}

const EditCompanies = () => (
  <>
    <div id="Companies">
        <Row className="justify-content-around">
            <Col id="Company1"><h1>Company 1</h1>{EditCompany("SINF")}</Col>
            <Col id="Company2"><h1>Company 2</h1>{EditCompany("DIFFER")}</Col>
        </Row>
        <Row id="ButtonRow" className="justify-content-end">
            <Button variant="primary" onClick={SaveChanges}>
                Save
            </Button>
            <Button variant="danger" href="/companies">
                Cancel
            </Button>
        </Row>
    </div>
  </>

);

function EditCompany(name) {
    return (
        <Card id="Company-Card">
            <Card.Body>
                <form>
                    <label for="Grant_Type">Grant_Type</label><br></br>
                    <input type="text" id="Grant_Type" name="Grant_Type"></input><br></br>
                    <label for="Client_ID">Client_ID</label><br></br>
                    <input type="text" id="Client_ID" name="Client_ID"></input><br></br>
                    <label for="Client_Secret">Client_Secret</label><br></br>
                    <input type="text" id="Client_Secret" name="Client_Secret"></input><br></br>
                    <label for="Scope">Scope</label><br></br>
                    <input type="text" id="Scope" name="Scope"></input>
                </form>
            </Card.Body>
        </Card>
    );
}

export default EditCompanies;
