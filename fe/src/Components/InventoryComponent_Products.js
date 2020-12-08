import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'; 
import Table from 'react-bootstrap/Table';
import './../CSS/Inventory.css';

class InventoryComponent_Products extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            isLoading : true,
            company : 0,
            data : []
        }

        this.changeCompany = this.changeCompany.bind(this);
    }
    
    componentDidMount() {
        console.log("hello");
        const requestOptions = {
            method: 'GET',
        };

        fetch(`http://localhost:5000/company/products/${this.state.company}`, requestOptions)
        .then((res) => (res.clone().text()))
        .then((res) => (this.setState((prevState) => ({
            isLoading: !prevState.isLoading,
            data: JSON.parse(res).result,
        }))));


    }

    changeCompany() {
        let s = this.state.company;

        s == 0 ? s=1 : s=0;

        this.setState({
            isLoading: true,
            company: s
        },function () {
            this.componentDidMount();
        });
    }

    render() {
        if(this.state.isLoading)
            return(<h1>Loading...</h1>);
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
                                if(this.state.company == 0) {
                                    return (<><option value="c1">C1</option>
                                            <option value="c2">C2</option></>);
                                } else {
                                    return (<><option value="c1">C1</option>
                                            <option value="c2" selected="selected">C2</option></>);
                                }
                            })()}
                        </select>
                        </Row>
                    </div>
                    <Table id="content-table" hover>
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Brand</th>
                            <th>Price (€)</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.data.map(product => (
                            <tr>
                                <td>{product.key}</td>
                                <td>{product.description}</td>
                                <td>{product.brand}</td>
                                <td>{product.price}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </>
            );
}
}
export default InventoryComponent_Products;