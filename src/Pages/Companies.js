import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'

import './../CSS/Companies.css'

function Companies () {

    return (
        <div id="Companies">
            <Row className="justify-content-around">
                <Col><h1>Company 1</h1>{CompanyDisplay("SINF")}</Col>
                <Col><h1>Company 2</h1>{CompanyDisplay("DIFFER")}</Col>
            </Row>
            <Row id="ButtonRow" className="justify-content-end">
                <Button variant="primary">
                    Edit Companies
                </Button>
            </Row>
        </div>
        
    );
}

function CompanyDisplay (name) {
    
      return (
          //<h1>Company {name}</h1>
          <Card id="Company-Card">
              <Card.Title>
                  <h1>{name}</h1>
              </Card.Title>
              <Card.Img src="company.png" heigth={51} rounded />
                  
          </Card>
      );
    
  }

export default Companies;