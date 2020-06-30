import React, { Component } from 'react'
import moment from 'moment';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Button
} from '@material-ui/core';
import {
    Delete
} from '@material-ui/icons';

import './style.scss';
export default class JournalVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            editDialog: false,
            append: false,
            rows: [
                this.createData('', 0, 0, '', ''),
                this.createData('', 0, 0, '', ''),
            ]
        };
    }
    createData = (ledgerName = '', debit = 0, credit = 0, naration = '', cheque = '') => {
        return { ledgerName, debit, credit, naration, cheque };
    }
    changeNo = (value) => {
        this.setState({
            index: value
        })
    }

    addEditDialog = () => {
        let rows = this.state.rows;
        rows.push(this.createData());
        this.setState({
            append: true,
            editDialog: true
        })

    }

    delete = index => {
        let rows = this.state.rows;
        rows.splice(index, 1);
        this.setState({
            rows
        })
    }
    handleEvent = (key, event) => {
        switch (key) {
            default:
                let { rows, index } = this.state;
                rows[index][key] = event.target.value;
                this.setState({ rows });
        }
    }
    render() {
        let [debit, credit] = [0, 0];
        return (
            <div className='journal-vouvher'>
                <div className='title'>Journal Voucher</div>
                <div className='add-voucher'>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={this.addEditDialog}>
                        {'Add New Voucher'}
                    </Button>
                </div>
                <div className='content-value'>
                    <TextField
                        id="outlined-name"
                        label="journal no."
                        value={this.state.index + 1}
                        // onChange={handleChange('name')}
                        variant="outlined"
                    />
                    <TextField
                        id="date"
                        label="Journal date"
                        type="date"
                        defaultValue={moment().format('YYYY-MM-DD')}
                        variant="outlined"
                    />
                </div>
                <div className='content-value'>
                    <TextField
                        id="outlined-name"
                        label="Branch"
                        fullWidth
                        value={this.state.index + 1}
                        // onChange={handleChange('name')}
                        variant="outlined"
                    />
                </div>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow >
                            <TableCell>#</TableCell>
                            <TableCell align="right">Ledger Name</TableCell>
                            <TableCell align="right">Debit</TableCell>
                            <TableCell align="right">Credit</TableCell>
                            <TableCell align="right">Naration</TableCell>
                            <TableCell align="right">Cheque</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.rows.map((row, index) => {
                            credit += Number(row.credit);
                            debit += Number(row.debit);
                            if (index === this.state.index) {
                                return (
                                    <TableRow key={index} onClick={() => { this.changeNo(index) }} className='rows'>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="right">
                                            <input value={row.ledgerName || ''} onChange={event => { this.handleEvent('ledgerName', event) }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <input value={row.debit || 0} onChange={event => { this.handleEvent('debit', event) }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <input value={row.credit || 0} onChange={event => { this.handleEvent('credit', event) }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <input value={row.description || ''} onChange={event => { this.handleEvent('description', event) }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <input value={row.cheque || ''} onChange={event => { this.handleEvent('cheque', event) }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Delete onClick={() => { this.delete(index) }} />
                                        </TableCell>
                                    </TableRow>
                                );
                            } else {
                                return (
                                    <TableRow key={index} onClick={() => { this.changeNo(index) }}>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="right">{row.ledgerName}</TableCell>
                                        <TableCell align="right">{row.debit}</TableCell>
                                        <TableCell align="right">{row.credit}</TableCell>
                                        <TableCell align="right">{row.description}</TableCell>
                                        <TableCell align="right">{row.cheque}</TableCell>
                                        <TableCell align="right">
                                            <Delete onClick={() => { this.delete(index) }} />
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        })}
                        <TableRow>
                            <TableCell component="th" scope="row"></TableCell>
                            <TableCell align="right">{'Total'}</TableCell>
                            <TableCell align="right">{debit}</TableCell>
                            <TableCell align="right">{credit}</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div className='action-content'>
                    <Button variant='contained' color='secondary' disabled={credit === debit}>Save</Button>
                    <Button variant='contained' color='secondary' disabled={credit === debit}>Update</Button>
                    <Button variant='contained' color='secondary' disabled={credit === debit}>Delete</Button>
                    <Button variant='contained' color='secondary' disabled={credit === debit}>Print</Button>
                </div>
            </div>
        )
    }
}
