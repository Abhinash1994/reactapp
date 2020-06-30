import React, { Component } from 'react';
import { FusePageSimple, FuseAnimate } from '@fuse';
import { withStyles, Typography, Icon } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import Snackbar from '@material-ui/core/Snackbar';
import AttachmentService from '../../services/AttachmentService';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { stableSort, getSorting } from '../../helper/TableSortHepler';
import AttachmentDialog from '../Attachment/AttachmentDialog'

const tableColumes = [
    { id: 'sn', numeric: false, disablePadding: false, label: 'SN', width: '50px' },
    { id: 'filename', numeric: false, disablePadding: false, label: 'File Name' },
    { id: 'filedescriptipn', numeric: false, disablePadding: false, label: 'Descriptions' },
    { id: 'action', numeric: false, disablePadding: false, label: '' },
];

const styles = theme => ({
    layoutHeader: {
        height: 320,
        minHeight: 320,
        [theme.breakpoints.down('md')]: {
            height: 240,
            minHeight: 240
        }
    }
});

class AttachmentPage extends Component {

    state = {
        searchText: '',
        rows: [],
        order: 'asc',
        orderBy: 'total',
    };

    async  componentDidMount() {
        this.displayData();
    }

    async displayData() {
        let rows = await AttachmentService.getAllAttachment();
        this.setState({ rows });
    }


    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';
        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }
        this.setState({ order, orderBy });
    };

    handleLogoChange = (e) => {
        this.setState({
            Logo: e.target.files[0]
        })
    }

    handleSave = async (row, type) => {
        if (type === 'add')
            await AttachmentService.createNewAttachment(row);
        else if (type === 'edit')
            await AttachmentService.updateAttachment(row);

        await this.displayData();
    }

    handleRemove = async (row) => {
        await AttachmentService.removeAttachment(row.id);
        await this.displayData();
    }

    render() {
        const { classes } = this.props;
        const { order, orderBy } = this.state;
        const { vertical, horizontal, open } = this.state;
        var data = stableSort(this.state.rows, getSorting(order, orderBy));
        console.log(localStorage.getItem('username'))
        return (
            <FusePageSimple
                classes={{
                    toolbar: "px-16 sm:px-24"
                }}
                header={
                    <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
                        <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                            <div className="flex items-center">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <Icon className="text-32 mr-12">account_balance</Icon>
                                </FuseAnimate>
                                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                    <Typography variant="h6" className="hidden sm:flex">Invoice</Typography>
                                </FuseAnimate>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                        </div>
                    </div>
                }
                content={

                    <div className="p-16 sm:p-24">
                        <AttachmentDialog type='add'
                            onSave={this.handleSave}
                            onChangeLogo={this.handleLogoChange}
                            onRemove={this.handleRemove}
                            row={{
                                date: '',
                                fiscalyear: 2020,
                                file_name: '',
                                file_descriptions: '',
                                attachment: null
                            }} />
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <EnhancedTableHead
                                    rows={tableColumes}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={this.handleRequestSort}
                                />
                                <TableBody>
                                    {data.map((row, index) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="left">{index + 1}</TableCell>
                                            <TableCell component="th" scope="row" align='left'>{row.file_name}</TableCell>
                                            <TableCell align="left">{row.file_description}</TableCell>
                                            <TableCell align="center">
                                                <AttachmentDialog type='edit'
                                                    onSave={this.handleSave}
                                                    onRemove={this.handleRemove}
                                                    row={row} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {
                                        data.length === 0 &&
                                        <TableRow>
                                            <TableCell align="center">
                                                'No Invoice found.'
                                    </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                        <Snackbar
                            key={`${vertical},${horizontal}`}
                            open={open}
                            onClose={this.handleClose}
                            ContentProps={{
                                'aria-describedby': 'message-id',
                            }}
                            disableWindowBlurListener={true}
                            message={<span id="message-id">Successfully Update!</span>}
                        />
                    </div>
                }
            />
        );
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        logout: authActions.logoutUser
    }, dispatch);
}

function mapStateToProps({ auth }) {
    return {
        user: auth.user
    }
}
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(AttachmentPage));
