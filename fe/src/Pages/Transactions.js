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
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function createData(date, order, supplier, value) {
  return {
    date, order, supplier, value,
    status: [
      { company: 'C1', date: '16:35:43 24-02-2020', message: "REJECTED_NO_STOCK" },
      { company: 'C2', date: '16:30:12 24-02-2020', message: "INITIATE_ORDER" },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{row.date}</TableCell>
        <TableCell align="left">{row.order}</TableCell>
        <TableCell align="center">{row.supplier}</TableCell>
        <TableCell align="center">{row.value}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Company</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.status.map((statusRow) => (
                    <TableRow key={statusRow.company}>
                      <TableCell align="center" component="th" scope="row">
                        {statusRow.company}
                      </TableCell>
                      <TableCell align="center">{statusRow.date}</TableCell>
                      <TableCell align="center">{statusRow.message}</TableCell>
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

const rows = [
  createData('15-09-2020', '1x P1', 'S1', 150),
  createData('03-09-2020', '50x P2', 'S3', 87),
  createData('20-10-2020', '5x P3', 'S3', 789),
];

export default function CollapsibleTable() {
  return (
    <TableContainer component={Paper}>
      <Button disabled={true} variant="contained">Transactions</Button>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Status&nbsp;</TableCell>
            <TableCell align="left">Date&nbsp;</TableCell>
            <TableCell align="left">Order&nbsp;</TableCell>
            <TableCell align="center">Supplier&nbsp;</TableCell>
            <TableCell align="center">Value&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>

      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </TableContainer>
  );
}