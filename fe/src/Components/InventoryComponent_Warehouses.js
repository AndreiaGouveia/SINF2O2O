import React from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import './../CSS/Inventory.css';


let warehouses = [
    ["W1","Edmund Wesr,1","56","10"],
    ["W2","Stephenson Wood,55","20","12"]
];


function InventoryComponent_Warehouses (props) {

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
            <Table id="content-table" hover>
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Location</th>
                    <th>Max. Capacity</th>
                    <th>Curr. Capacity</th>
                    </tr>
                </thead>
                <tbody>
                {warehouses.map(warehouse => (
                    <tr>
                        <td>{warehouse[0]}</td>
                        <td>{warehouse[1]}</td>
                        <td>{warehouse[2]}</td>
                        <td>{warehouse[3]}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
}

export default InventoryComponent_Warehouses;