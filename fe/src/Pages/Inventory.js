import React, {Component} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import './../CSS/Inventory.css'
import InventoryComponentProducts from '../Components/InventoryComponent_Products';
import InventoryComponentWarehouses from '../Components/InventoryComponent_Warehouses';
import InventoryComponentEntities from '../Components/InventoryComponent_Entities';

class Inventory extends Component {

    constructor(props) {
        super(props);
    }

    render () {
        return (
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="first">Products</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="second">Warehouses</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="third">Entities</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <InventoryComponentProducts companyName="Company1" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                            <InventoryComponentWarehouses companyName="Company2" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="third">
                            <InventoryComponentEntities companyName="Company3" />
                        </Tab.Pane>
                    </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}


export default Inventory;