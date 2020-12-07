import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import '../CSS/Transactions.css';
import { Button, Container} from 'react-bootstrap';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Fab } from '@material-ui/core';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

    render(){
const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.white,
    },
  },
}))(TableRow);

function createData(date, order, supplier, value, status) {
  return { date, order, supplier, value, status };
}


const rows = [
  createData('15-09-2020', '1x P1', 'S1', 150, 'v'),
  createData('03-09-2020', '50x P2', 'S3', 87, 'v'),
  createData('20-10-2020', '5x P3', 'S3', 789, 'v'),
];

const useStyles = makeStyles({
  table: {
    maxWidth: 1000,
  },
});



function Transactions() {
  const classes = useStyles();

  return (
    <Container id="container">
    <Button disabled={true} variant="contained">Transactions</Button>
   
    
      
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Date&nbsp;</StyledTableCell>
            <StyledTableCell align="left">Order&nbsp;</StyledTableCell>
            <StyledTableCell align="center">Supplier&nbsp;</StyledTableCell>
            <StyledTableCell align="center">Value&nbsp;</StyledTableCell>
            <StyledTableCell align="center">Status&nbsp;</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.order}>
              <StyledTableCell align="left">{row.date}</StyledTableCell>
              <StyledTableCell align="left">{row.order}</StyledTableCell>
              <StyledTableCell align="center">{row.supplier}</StyledTableCell>
              <StyledTableCell align="center">{row.value}</StyledTableCell>
              <StyledTableCell align="center">{SimpleAccordion()}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Fab id="addButton" aria-label="add">+</Fab>

    </TableContainer>
    </Container>
    
  );
}

function createsubData(company, date, message) {
    return { company, date, message };
  }

const subrows = [
    createsubData('C1', '16:35:43 24-02-2020', 'REJECTED_NO_STOCK'),
    createsubData('C2', '16:30:12 24-02-2020', 'INITIATE_ORDER'),
  ];


function SimpleAccordion() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
        </AccordionSummary>
        <AccordionDetails>
        <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell id="subHeaderBegin" align="center">Company&nbsp;</StyledTableCell>
            <StyledTableCell align="center">Date&nbsp;</StyledTableCell>
            <StyledTableCell id="subHeaderEnd" align="center">Message&nbsp;</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody > 
          {subrows.map((row) => (
            <StyledTableRow key={row.company}>
              <StyledTableCell id="status" align="center">{row.company}</StyledTableCell>
              <StyledTableCell id="status" align="center">{row.date}</StyledTableCell>
              <StyledTableCell id="status" align="center">{row.message}</StyledTableCell>
            
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
        </AccordionDetails>
      </Accordion>

    </div>
  );
}



export default Transactions;