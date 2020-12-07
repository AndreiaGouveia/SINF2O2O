import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'; 
import Table from 'react-bootstrap/Table';
import './../CSS/Inventory.css';


let products = [
    ["P1","Cleaning Product","56","Cleaning","W1"],
    ["P2","Flour","67","Grocery","W2"],
    ["P3","Pack 3","21","Cleaning","W1"]
];

class InventoryComponent_Products extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            isLoading : true,
            company : 1,
            date : []
        }
    }
    
    componentDidMount() {
        const requestOptions = {
            method: 'GET',
        };

        fetch('http://localhost:5000/')
    }

    render() {
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
                    <th>Description</th>
                    <th>Units</th>
                    <th>Category</th>
                    <th>Warehouse</th>
                    </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr>
                        <td>{product[0]}</td>
                        <td>{product[1]}</td>
                        <td>{product[2]}</td>
                        <td>{product[3]}</td>
                        <td>{product[4]}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
}
}
export default InventoryComponent_Products;