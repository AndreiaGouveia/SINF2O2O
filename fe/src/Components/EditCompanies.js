import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import './../CSS/Companies.css';
import axios from 'axios';

async function saveChanges(old_info) {

    let no_changes_made = true;

    for (let c = 0; c < old_info.length; c++) {
        no_changes_made &= updateCompanyInfo(c, old_info[c]);
    }

    if (no_changes_made) {
        // Alert saying no new info was inputted
        console.log("Input info was the same as old info");
    }
    else {
        // Alert saying company info was updated
        console.log("Finished updating company info");
    }
}

async function updateCompanyInfo(companyID, old_info) {

    let new_info = document.querySelectorAll("#Company" + (companyID + 1) + " input");
    let no_changes_made = true;
    
    no_changes_made &= (new_info[0].value === old_info.grant_type);
    no_changes_made &= (new_info[1].value === old_info.client_id);
    no_changes_made &= (new_info[2].value === old_info.client_secret);
    no_changes_made &= (new_info[3].value === old_info.scope);
    
    const params = {
        grant_type: new_info[0].value,
        client_id: new_info[1].value,
        client_secret: new_info[2].value,
        scope: new_info[3].value
    }

    console.log("no_changes_made "+ no_changes_made);

    if (!no_changes_made) {

        // Send request to be to update the db
        try {

            let res = await axios.post('http://localhost:5000/company/companiesInfo/update/' + companyID, params);

            // Alert saying db was successfully updated
            console.log(res.data);
            return false;
        }
        catch (error) {
            alert(error);
        }
    }
        
    return true;
}

const EditCompanies = (props) => (
  <>
    <div id="Companies">
        <Row className="justify-content-around">
            <Col id="Company1"><h1>{props.info[0].client_id}</h1>{EditCompany(props.info[0])}</Col>
            <Col id="Company2"><h1>{props.info[1].client_id}</h1>{EditCompany(props.info[1])}</Col>
        </Row>
        <Row id="ButtonRow" className="justify-content-end">
            <Button variant="primary" onClick={() => saveChanges(props.info)}>
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
                    <input type="text" id="Grant_Type" name="Grant_Type" defaultValue={info.grant_type}></input><br></br>
                    <label for="Client_ID">Client_ID</label><br></br>
                    <input type="text" id="Client_ID" name="Client_ID" defaultValue={info.client_id}></input><br></br>
                    <label for="Client_Secret">Client_Secret</label><br></br>
                    <input type="text" id="Client_Secret" name="Client_Secret" defaultValue={info.client_secret}></input><br></br>
                    <label for="Scope">Scope</label><br></br>
                    <input type="text" id="Scope" name="Scope" defaultValue={info.scope}></input>
                </form>
            </Card.Body>
        </Card>
    );
}

export default EditCompanies;
