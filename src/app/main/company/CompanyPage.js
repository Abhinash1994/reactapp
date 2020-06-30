import React, { Component } from 'react';
import {
  withStyles, Typography, Icon,
  Table, TableBody, TableCell, TableRow, Paper, Snackbar
} from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import CompanyDialog from './CompanyDialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import CompanyService from '../../services/CompanyService';
import { API_URL } from '../../../config';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { stableSort, getSorting } from '../../helper/TableSortHepler'
import './style.scss';
const tableColumes = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
  { id: 'pan_no', numeric: false, disablePadding: false, label: 'Pan_No' },
  { id: 'regd_no', numeric: false, disablePadding: false, label: 'Regd_No' },
  { id: 'telephone', numeric: false, disablePadding: false, label: 'Telephone' },
  { id: 'mobile', numeric: false, disablePadding: false, label: 'Mobile' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'country', numeric: false, disablePadding: false, label: 'Country' },
  { id: 'logo', numeric: false, disablePadding: false, label: 'Logo' },
  { id: '', numeric: false, disablePadding: false, label: 'Action' },
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

class CompanyPage extends Component {

  state = {
    order: 'asc',
    orderBy: 'monthly_rate',
    rows: [],
    open: false,
    vertical: 'center',
    horizontal: 'center',
    role: {}
  };
  constructor(props){
    super(props);
    console.log(props.user);
  }
  handleClose = () => {
    this.setState({ open: false });
  }

  async componentDidMount() {
    let rows = await CompanyService.getCompanys();
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
    // alert(e.target.files[0])
  }

  handleSave = async (row, type) => {
    var form_data = new FormData();
    form_data.append('Name', row.Name);
    form_data.append('Address', row.Address);
    form_data.append('Pan', row.Pan_No);
    form_data.append('Regd', row.Regd_No);
    form_data.append('Telephone', row.Telephone);
    form_data.append('Mobile', row.Mobile);
    form_data.append('Email', row.Email);
    form_data.append('Website', row.Web);
    form_data.append('StateCity', row.State);
    form_data.append('Country', row.Country);
    form_data.append('Created_by', row.Created_by);

    if (type === 'edit') {
      let rows = await CompanyService.updateCompany(row);
      this.setState({ rows });
    } else {
      let result = await CompanyService.createCompany(row);
      if (result) {
        let rows = this.state.rows;
        rows.push(result);
        this.setState({ rows });
      }
    }
  }

  handleRemove = async row => {
    let result = await CompanyService.removeCompany(row.id);
    if (result) {
      let rows = this.state.rows.filter(r => (
        r.id !== row.id
      ))
      this.setState({ rows });
    }
  }

  render() {
    const { classes } = this.props;
    const { order, orderBy } = this.state;
    const { vertical, horizontal, open } = this.state;
    var data = stableSort(this.state.rows, getSorting(order, orderBy));
    return (
      <FusePageSimple
        classes={{
          // header : classes.layoutHeader,
          toolbar: "px-16 sm:px-24"
        }}
        className='company-page'
        header={
          <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
              <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <Icon className="text-32 mr-12">account_balance</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h4" className="hidden sm:flex">Company</Typography>
                </FuseAnimate>
              </div>
            </div>
          </div>
        }
        content={

          <div className="p-16 sm:p-24 company-page">
            {!this.state.rows.length && <CompanyDialog type='add' onSave={this.handleSave} onChangeLogo={this.handleLogoChange} onRemove={this.handleRemove} row={{
              name: '',
              address: '',
              pan: '',
              regd: '',
              telephone: '',
              mobile: '',
              email: '',
              website: '',
              stateCity: '',
              country: '',
              createdby: localStorage.getItem('userid'),
              logo: null
            }} />}
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  rows={tableColumes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map(row => (
                    <TableRow key={row.id}>
                      <TableCell align="center" scope="row">{row.name}</TableCell>
                      <TableCell align="center">{row.address}</TableCell>
                      <TableCell align="center">{row.pan}</TableCell>
                      <TableCell align="center">{row.regd}</TableCell>
                      <TableCell align="center">{row.telephone}</TableCell>
                      <TableCell align="center">{row.mobile}</TableCell>
                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell align="center">{row.country}</TableCell>
                      <TableCell align="center">
                        <img src={`${API_URL}/asset${row.logo}`} style={{ width: 100, height: 100 }} alt='' />
                      </TableCell>
                      <TableCell align="center">
                        <CompanyDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* {
                    data.length === 0 &&
                    <TableRow>
                      <TableCell align="center">
                        'No memberships found.'
                                    </TableCell>
                    </TableRow>
                  } */}
                </TableBody>
              </Table>
            </Paper>
            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(CompanyPage));
