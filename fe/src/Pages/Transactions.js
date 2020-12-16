import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Button from '@material-ui/core/Button';
import Spinner from 'react-bootstrap/Spinner';
import "../CSS/Transactions.css";
import '../CSS/Spinner.css';
import { Component } from "react";

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function createData(date, order, supplier, value , messages) {
  return {
    date, order, supplier, value,
    status: messages,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell id="min-col" align="center">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell id="date-col" align="left">{row.date}</TableCell>
        <TableCell id="order-col" align="left">
          <ul>
            {
              row.order.map(element => (<li>{element}</li> ))
            }
          </ul>
        </TableCell>
        <TableCell id="supplier-col" align="center">{row.supplier}</TableCell>
        <TableCell id="min-col" align="center">{row.value}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell id="sub-table-header" align="center">Date</TableCell>
                    <TableCell id="sub-table-header" align="center">Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.status.map((statusRow) => (
                    <TableRow>
                      <TableCell id="sub-table" align="center">{statusRow.date}</TableCell>
                      <TableCell id="sub-table" align="center">{statusRow.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>

  );
}

Row.propTypes = {
  row: PropTypes.shape({
    date: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired,
    supplier: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    status: PropTypes.arrayOf(
      PropTypes.shape({
        company: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};


class Transactions extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      data: []
    }
  }
  componentDidMount() {
    const requestOptions = {
      method: 'GET',
    };

    fetch('http://localhost:5000/transaction/orders', requestOptions)
      .then((res) => (res.clone().text()))
      .then((res) => (this.setState((prevState) => ({
        isLoading: !prevState.isLoading,
        data: JSON.parse(res).result
      }))));

  }

  render() {
    if (this.state.isLoading) {
      return(<div id="Spinner"><Spinner animation="grow" /></div>);
    } else {
      console.log(this.state.data)
      return (
        <TableContainer component={Paper}>
          <Button id="transactions-label" disabled={true} variant="contained">Transactions</Button>
          <Table id="collapsible-table" aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell id="min-col" align="center">Status</TableCell>
                <TableCell id="date-col" align="left">Date/Time&nbsp;</TableCell>
                <TableCell id="order-col" align="left">Order&nbsp;</TableCell>
                <TableCell id="supplier-col" align="center">Supplier&nbsp;</TableCell>
                <TableCell id="min-col" align="center">Value&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.data.map(element => (<Row row={createData(element.date1, element.order, element.supplier, element.value, element.messages)} />)) 
              }
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }
}

export default Transactions;