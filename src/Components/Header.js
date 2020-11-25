import React from 'react';
import { Navbar, NavDropdown, Nav} from 'react-bootstrap';


const Header = () => (
  <>  
  <div className='App tc f3'>
        <Navbar variant="light" expand='lg'>
          <Navbar.Brand href="/">SINF2020</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className='ml-auto'>
              <Nav.Link href="/companies" >Companies</Nav.Link>
              <Nav.Link href="/inventory">Inventory</Nav.Link>
              <Nav.Link href="/transactions">Transactions</Nav.Link>
              <NavDropdown title="UserSpace" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">LogIn</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.2">SignUp</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>    

  </>

);

export default Header;

/*
//search form, might be very usefull
<Form inline>
  <FormControl type="text" placeholder="Search" className="mr-sm-2" />
  <Button variant="outline-success">Search</Button>
</Form>*/