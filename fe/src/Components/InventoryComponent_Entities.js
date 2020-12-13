import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import './../CSS/Inventory.css';




class InventoryComponent_Entities extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading : true,
            company : 0,
            customer: 0,
            seller_data : [],
            customer_data : []
        }

    }
    
    componentDidMount() {
        const requestOptions = {
            method: 'GET',
        };

        
        fetch(`http://localhost:5000/company/entities/suppliers/${this.state.company}`, requestOptions)
        .then((res) => (res.clone().text()))
        .then((res) => (this.setState((prevState) => ({
            seller_data: JSON.parse(res).result,
        }))));

        fetch(`http://localhost:5000/company/entities/customers/${this.state.company}`, requestOptions)
        .then((res) => (res.clone().text()))
        .then((res) => (this.setState((prevState) => ({
            isLoading: !prevState.isLoading,
            customer_data: JSON.parse(res).result,
        }))));
        

    }

    changeCompany() {
        let s = this.state.company;

        s === 0 ? s=1 : s=0;

        this.setState({
            isLoading: true,
            company: s
        },function () {
            this.componentDidMount();
        });
    }

    render() {
        if(this.state.isLoading)
            return(<div id="Spinner"><Spinner animation="grow" /></div>);
        else
        return (
            <>
                <div id="company-dropdown">
                    <Row>
                    <label for="companies">Company</label>
                    </Row>
                    <Row> 
                    <select name="companies" id="companies" onChange={this.changeCompany.bind(this)}>
                            {(() => {
                                if(this.state.company === 0) {
                                    return (<><option value="c1">DIFFER</option>
                                            <option value="c2">SINFD</option></>);
                                } else {
                                    return (<><option value="c1">DIFFER</option>
                                            <option value="c2" selected="selected">SINFD</option></>);
                                }
                            })()}
                        </select>
                    </Row>
                </div>
                <Tabs defaultActiveKey="entities" id="entities">
                    <Tab eventKey="suppliers" title="Suppliers" default>
                        <Table id="content-table" hover>
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>TaxID</th>
                                <th>Payment Method</th>
                                <th>Telephone</th>
                                <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.seller_data.map(supplier => (
                                <tr>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.companyTaxID}</td>
                                    <td>{supplier.paymentMethod}</td>
                                    <td>{supplier.telephone}</td>
                                    <td>{supplier.email}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="customers" title="Customers">
                        <Table id="content-table" hover>
                        <thead>
                                <tr>
                                    <th>Key</th>
                                    <th>Name</th>
                                    <th>Telephone</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.customer_data.map(customer => (
                                <tr>
                                    <td>{customer.key}</td>
                                    <td>{customer.name}</td>
                                    <td>{customer.telephone}</td>
                                    <td>{customer.email}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Tab>
                    
                </Tabs>
                
            </>
        );
    }
}

export default InventoryComponent_Entities;