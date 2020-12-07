import React from 'react';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Row from 'react-bootstrap/Row';
import './../CSS/Inventory.css';


let customers = [
    ["C1","226844006","916254053","customer1@yahoo.com"],
    ["C2","264438065","937760225","customerHS@gmail.com"],
    ["C3","224680375","913541355","gajofixe@sapo.pt"]
];

let retailers = [
    ["S1","285269127","912056735","retailerA@gmail.com"],
    ["S2","211433594","962381642","companyX@gmail.com"],
    ["S3","243038097","933377234","anotherCompany@hotmail.com"]
];

function InventoryComponent_Entities () {

    return (
        <>
            <div id="company-dropdown">
                <Row>
                <label for="companies">Company</label>
                </Row>
                <Row> 
                <select name="companies" id="companies">
                    <option value="c1">C1</option>
                    <option value="c2">C2</option>
                </select>
                </Row>
            </div>
            <Tabs defaultActiveKey="entities" id="entities">
                <Tab eventKey="customers" title="Customers" default>
                    <Table id="content-table" hover>
                        <thead>
                            <tr>
                            <th>ID</th>
                            <th>VAT</th>
                            <th>Phone</th>
                            <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                        {customers.map(customer => (
                            <tr>
                                <td>{customer[0]}</td>
                                <td>{customer[1]}</td>
                                <td>{customer[2]}</td>
                                <td>{customer[3]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="sellers" title="Sellers">
                    <Table id="content-table" hover>
                        <thead>
                            <tr>
                            <th>ID</th>
                            <th>VAT</th>
                            <th>Phone</th>
                            <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                        {retailers.map(retailer => (
                            <tr>
                                <td>{retailer[0]}</td>
                                <td>{retailer[1]}</td>
                                <td>{retailer[2]}</td>
                                <td>{retailer[3]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Tab>
                
            </Tabs>
            
        </>
    );
}

export default InventoryComponent_Entities;