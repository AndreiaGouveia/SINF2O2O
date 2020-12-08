import React from 'react';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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




const useStyles = makeStyles({
  table: {
    maxWidth: 1000,
  },
});



export default function CreateOrder() {
  const classes = useStyles();

  const [state, setState] = React.useState({
    company: "",
    name: "hai",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const [open, setOpen] = React.useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container id="container">
      <Button id="createOrder-label" disabled={true} variant="contained">Create Order</Button>
      <Button href="Transactions" id="cancel" variant="contained">Cancel</Button>
      <Form id="form">
        <Form.Group id="row" as={Row} controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            <Paper id="first-label" className={classes.paper}> Supplier </Paper>
          </Form.Label>
          <Col sm="10">
            <Select
              native
              value={state.company}
              onChange={handleChange}
              inputProps={{
                name: "company",
                id: "filled-company-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              <option value={10}> C1 </option> <option value={20}> C2 </option>
            </Select>
          </Col>
        </Form.Group>

        <Form.Group id="rowproduct" as={Row} controlId="formPlaintextPassword">
          <Form.Label  column sm="2">
            <Paper  className={classes.paper}> Product </Paper>
          </Form.Label>
          <Col sm="10">
            <Button id="label" onClick={handleClickOpen}> Select your Product </Button>
          </Col>
        </Form.Group>
        <Grid container spacing={3}>

          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={open}
            onClose={handleClose}
          >
            <DialogTitle > Select your Product </DialogTitle>
            {<DialogContent>
              <Table className={classes.table} aria-label="customized table">
                <TableBody> {TableProducts()} </TableBody>
              </Table>
            </DialogContent>}
            <DialogActions>
              <Button id="sub-buttons" onClick={handleClose} color="primary">
                Cancel
                    </Button>
              <Button id="sub-buttons" onClick={handleClose} color="primary">
                Ok
                    </Button>
            </DialogActions>
          </Dialog>

        </Grid>
        <Form.Group id="row" as={Row} controlId="formPlaintextPassword">
          <Form.Label column sm="2">
            <Paper className={classes.paper}> Quantity </Paper>
          </Form.Label>
          <Col sm="10">
            <TextField
              id="outlined-number"
              label="Number"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />        </Col>
        </Form.Group>

        <Form.Group id="row"as={Row} controlId="formPlaintextPassword">
          <Form.Label column sm="2">
            <Paper className={classes.paper}> Total </Paper>
          </Form.Label>
          <Col sm="10">
            <Button id="label" disabled={true} variant="contained">Total</Button>
          </Col>
        </Form.Group>

      </Form>
      <Button id="submit" variant="contained">Submit</Button>

    </Container>
  );
}



function createsubData(product, value, description) {
  return { product, value, description };
}

const subrows = [
  createsubData("P1", "15", "towels"),
  createsubData("P2", "3", "cat food"),
];

function TableProducts() {
  const classes = useStyles();

  return (
    <Table className={classes.table} aria-label="customized table">
      <TableHead>
        <TableRow>
          <StyledTableCell id="header"> </StyledTableCell>
          <StyledTableCell id="header" align="center">
            Product Name
          </StyledTableCell>
          <StyledTableCell id="header" align="center"> Value / Un </StyledTableCell>
          <StyledTableCell id="header" align="center">

            Description
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>

        {subrows.map((row) => (
          <StyledTableRow key={row.company}>
            <StyledTableCell id="check">
              <Checkbox
                color= ""
                inputProps={{ "aria-label": "checkbox" }}
              />
            </StyledTableCell>
            <StyledTableCell id="products" align="center">

              {row.product}
            </StyledTableCell>
            <StyledTableCell id="products" align="center">

              {row.value}
            </StyledTableCell>
            <StyledTableCell id="products" align="center">

              {row.description}
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  );
}