import React from 'react';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import "../CSS/CreateOrder.css";
import { Container } from "react-bootstrap";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Form from 'react-bootstrap/Form'
import { Col, Row } from "react-bootstrap";
import { Component } from "react";
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';



const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.white,
    },
  },
}))(TableRow);


class CreateOrder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      company: "loles",
      name: "hai",
      isLoading: true,
      data: []
    };
    this.selectedCheckboxes = new Set();

  }

  componentDidMount() {
    const requestOptions = {
      method: 'GET',
    };

    fetch('http://localhost:5000/transaction/salesitems', requestOptions)
      .then((res) => (res.clone().text()))
      .then((res) => (this.setState((prevState) => ({
        isLoading: !prevState.isLoading,
        data: JSON.parse(res).result
      }))));

  }


  render() {

    const handleChange = (event) => {
      this.setState({
        name: this.state.name,
        steps: this.state.itemsForm,
        open: false,
        value: '',
        supplier: ''
      });
    };
    const handleClickOpen = () => {
      this.setState({ open: true });
    };

    const handleClose = () => {
      this.selectedCheckboxes.clear();
      this.setState({ open: false });
    };

    const handleSave = () => {
      console.log(this.selectedCheckboxes);
      this.setState({ open: false });
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log("TOU AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
      const requestOptions = {
        method: 'POST',
      };
      try {
        await axios.post('http://localhost:5000/transaction/createorder', requestOptions);
      } catch (error) {
        return error;
      }


    }


    const toggleCheckbox = id => {
      if (this.selectedCheckboxes.has(id.target.id)) {
        this.selectedCheckboxes.delete(id.target.id);
      } else {
        this.selectedCheckboxes.add(id.target.id);
      }
    };


    const onChange = e => {
      //replace non-digits with blank
      const value = e.target.value.replace(/[^\d]/, '');

      if (parseInt(value) !== 0) {
        this.setState({ value });
      }
    };


    /*   submitHandler = (event) => {
        event.preventDefault();
        
      } */


    if (this.state.isLoading) {
      return (
        <h1>I am loading</h1>
      );
    } else {
      console.log(this.state.data)
      return (
        <Container id="container">
          <Button id="createOrder-label" disabled={true} variant="contained">Create Order</Button>
          <Button href="Transactions" id="cancel" variant="contained">Cancel</Button>
          <Form /* onSubmit ={this.submitHandler}  */ onSubmit={handleSubmit} id="form">
            <Form.Group id="row" as={Row} controlId="formPlaintextEmail">
              <Form.Label column sm="2">Supplier</Form.Label>
              <Col sm="10">
                <Select
                  native
                  //value={state.company}------------------------------todo, onde guardar
                  onChange={handleChange}
                  inputProps={{
                    name: "company",
                    id: "filled-company-native-simple",
                  }}
                >
                  <option aria-label="None" value="" />
                  <option value={this.state.supplier}> SINF </option>
                </Select>
              </Col>
            </Form.Group>

            <Form.Group id="rowproduct" as={Row} controlId="formPlaintextPassword">
              <Form.Label column sm="2">
                Product
            </Form.Label>
              <Col sm="10">
                <Button id="label" onClick={handleClickOpen}> Select your Product </Button>
              </Col>
            </Form.Group>
            <Grid container spacing={3}>


              <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={this.state.open}>
                <DialogTitle> Select your Product </DialogTitle>

                <DialogContent>
                  <Table aria-label="customized table">
                    <TableBody>
                      <Table aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell id="header1"> </StyledTableCell>
                            <StyledTableCell id="header" align="center">
                              Product Name
          </StyledTableCell>
                            <StyledTableCell id="header" align="center"> Description </StyledTableCell>
                            <StyledTableCell id="header" align="center"> Value/Un    </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.data.filter(aux => aux.itemKey != "PORTES").map((items) => {
                            var item = items.itemKey;
                            var description = items.description;
                            var value = items.priceListLines[0].priceAmount.amount + ' ' + items.priceListLines[0].priceAmount.symbol;
                            /* console.log(item, value, description); */
                            return (
                              <StyledTableRow key={item}>
                                <StyledTableCell id="check">
                                  <FormControl component="fieldset">
                                    <Checkbox
                                      id={item}
                                      color=""
                                      inputProps={{ "aria-label": "checkbox" }}
                                      value={{ item }}
                                      onChange={toggleCheckbox}
                                      defaultChecked={this.selectedCheckboxes.has(items.itemKey)}
                                    />
                                  </FormControl>
                                </StyledTableCell>
                                <StyledTableCell id="products" align="center">
                                  {item}
                                </StyledTableCell>
                                <StyledTableCell id="products" align="center">
                                  {description}
                                </StyledTableCell>
                                <StyledTableCell id="products" align="center">
                                  {value}
                                </StyledTableCell>
                              </StyledTableRow>
                            )
                          })}
                        </TableBody>
                      </Table >
                    </TableBody>
                  </Table>
                </DialogContent>

                <DialogActions>
                  <Button autoFocus onClick={handleClose} color="">
                    Cancel
          </Button>
                  <Button autoFocus onClick={handleSave} color="">
                    Save
          </Button>
                </DialogActions>
              </Dialog>

            </Grid>
            <Form.Group id="row" as={Row} controlId="formPlaintextPassword">
              <Form.Label column sm="2">
                Quantity
            </Form.Label>
              <Col sm="10">
                <TextField
                  id="outlined-number"
                  label="Number"
                  type="number"
                  value={this.state.value}
                  onChange={onChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />        </Col>
            </Form.Group>

            <Form.Group id="row" as={Row} controlId="formPlaintextPassword">
              <Form.Label column sm="2">
                Total
            </Form.Label>
              <Col sm="10">
                <Button id="label" disabled={true} variant="contained">Total</Button>
              </Col>
            </Form.Group>
            <Button id="submit" type="submit" variant="contained">Submit</Button>
          </Form>


        </Container>
      );

    }
  }
}

export default CreateOrder;