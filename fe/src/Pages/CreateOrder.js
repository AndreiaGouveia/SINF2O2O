import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "../CSS/CreateOrder.css";
import { Button, Container } from "react-bootstrap";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

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

function createData(date, order, supplier, value, status) {
  return { date, order, supplier, value, status };
}

const rows = [
  createData("15-09-2020", "1x P1", "S1", 150, "v"),
  createData("03-09-2020", "50x P2", "S3", 87, "v"),
  createData("20-10-2020", "5x P3", "S3", 789, "v"),
];

const useStyles = makeStyles({
  table: {
    maxWidth: 1000,
  },
});

function CreateOrder() {
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
  const [age, setAge] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container id="container">
      <Button id="createbutton" disabled={true} variant="contained">
        
        Create Order
      </Button>
      <Button id="cancel" variant="contained">
        
        Cancel
      </Button>
      <TableContainer id="tableContainer" component={Paper}>
        <FormControl variant="filled" className={classes.formControl}>
          <Grid container spacing={3}>
            <Grid item Supplier>
              <Paper className={classes.paper}> Supplier </Paper>
            </Grid>
            <Button onClick={handleClickOpen}> Select your Product </Button>
          </Grid>

          <Grid container spacing={3}>
            <Grid item Product>
              <Paper className={classes.paper}> Product </Paper>
            </Grid>
            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              open={open}
              onClose={handleClose}
            >
              <DialogTitle> Select your Product </DialogTitle>
              <DialogContent>
                <Table className={classes.table} aria-label="customized table">
                  <TableBody> {TableProducts()} </TableBody>
                </Table>
              </DialogContent>
              <DialogActions id ="aux">
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleClose} color="primary">
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
            <InputLabel id="label" htmlFor="filled-company-native-simple">
              
              Company
            </InputLabel>
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
          </Grid>

          <Container>
            <Grid container spacing={3}>
              <Grid item Quantity id="quantity">
                <Paper className={classes.paper}> Quantity </Paper>
              </Grid>
              <TextField
                id="outlined-number"
                label="Number"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
          </Container>

          <Container>
            <Grid container spacing={3}>
              <Grid item Total>
                <Paper className={classes.paper}> Total </Paper>
              </Grid>
              <Button disabled={true} variant="contained">
                
                Total
              </Button>
            </Grid>
          </Container>
        </FormControl>
      </TableContainer>
      <Button id="submit" variant="contained">
        
        Submit
      </Button>
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
          <StyledTableCell id="subHeaderBegin"> </StyledTableCell>
          <StyledTableCell align="center">
            Product Name
          </StyledTableCell>
          <StyledTableCell align="center"> Value / Un </StyledTableCell>
          <StyledTableCell id="subHeaderEnd" align="center">
            
            Description
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        
        {subrows.map((row) => (
          <StyledTableRow key={row.company}>
            <StyledTableCell id="check">
              <Checkbox
                id="checkbox"
                color="primary"
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

export default CreateOrder;
