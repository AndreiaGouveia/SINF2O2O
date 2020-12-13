import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import EditCompanies from '../Components/EditCompanies';
import Spinner from 'react-bootstrap/Spinner';

import './../CSS/Companies.css'
import '../CSS/Spinner.css';

class Companies extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading : true,
            isEditiding : false,
            data : []
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        const requestOptions = {
            method: 'GET',
        };

        fetch('http://localhost:5000/company/companiesInfo', requestOptions)
        .then((res) => (res.clone().text()))
        .then((res) => (this.setState((prevState) => ({
            isLoading: !prevState.isLoading,
            data: JSON.parse(res).result,
        }))));

    }

    handleClick(){
        console.log("click");
        this.setState({
            isEditiding: true
        })
    }

    render () {
        console.log(this.state.data)
        if(this.state.isLoading){
            return(<div id="Spinner"><Spinner animation="grow" /></div>);
        }
        console.log(this.state.data[0]);
        console.log(this.state.isEditiding)
        if(!this.state.isEditiding){
            return (
                    <div id="Companies">
                        <Row className="justify-content-around">
                            <Col id="Company1"><h1>Company 1</h1>{CompanyDisplay(this.state.data[0].client_id)}</Col>
                            <Col id="Company2"><h1>Company 2</h1>{CompanyDisplay(this.state.data[1].client_id)}</Col>
                        </Row>
                        <Row id="ButtonRow" className="justify-content-end">
                            <Button variant="primary" onClick={this.handleClick.bind(this)}>
                                Edit Companies
                            </Button>
                        </Row>
                    </div>
            );
        }else {
            return <EditCompanies info={this.state.data}/>;
        }    
    }    
}

function CompanyDisplay (name) {
    
      return (
          <Card id="Company-Card">
              <Card.Title>
                  <h1>{name}</h1>
              </Card.Title>
              <Card.Img src="company.png" heigth={51} rounded />
                  
          </Card>
      );
    
  }

export default Companies;