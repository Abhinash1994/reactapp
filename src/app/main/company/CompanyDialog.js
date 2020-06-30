import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import { API_URL } from '../../../config';
import Validations from '../../helper/Validations';
import FileService from '../../services/FileService'
import { NotificationManager } from 'react-notifications';
import {
  Icon, IconButton, Grid, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';

class CompanyDialog extends React.Component {
  state = {
    open: false,
    type: '',
    row: {
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
      createdby: '',
      Logo: null
    },
    flag: 0,
  };

  componentDidMount() {
    const { user } = this.props;
    this.setState({ row: this.props.row, type: this.props.type });
    this.setState({ Created_by: user.id })
  }
  handleLogoChange = (e) => {
    this.setState({ flag: 1 })
    let file = e.target.files[0];
    var cursor = this.state.row;
    cursor['logo'] = file;
    this.setState({ row: cursor });

    // this.props.row.Logo = 
    // alert(this.state.row.Logo)
  }
  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleAllClose = () => {
    if (this.state.row.name === '') {
      NotificationManager.error("Please insert Company Name!", "Company Name")
    } else if (this.state.row.address === '') {
      NotificationManager.error("Please insert Company Address!", 'Company Address')
    } else if (this.state.row.pan === '') {
      NotificationManager.error("Please insert PAN No!", 'Pan Number')
    } else if (!Validations.IntegerValidation(this.state.row.pan)) {
      NotificationManager.error("Please check your PAN No!", 'Pan Number');
    } else if (this.state.row.regd === '') {
      NotificationManager.error("Please insert Regd No!", 'Regd No')
    } else if (!Validations.IntegerValidation(this.state.row.regd)) {
      NotificationManager.error("Please check your Regd No!", 'Regd No')
    } else if (this.state.row.telephone === '') {
      NotificationManager.error("Please insert Telephone!", 'Telephone')
    } else if (!Validations.TelephoneValidation(this.state.row.telephone)) {
      NotificationManager.error("Please check your Telephone Number!", 'Telephone')
    } else if (this.state.row.mobile === '') {
      NotificationManager.error("Please insert Mobile!", 'Mobile')
    } else if (!Validations.TelephoneValidation(this.state.row.mobile)) {
      NotificationManager.error("Please check your mobile Number!", 'Mobile Number')
    } else if (this.state.row.email === '') {
      NotificationManager.error("Please insert Email ID!", 'Email')
    } else if (!Validations.EmailValidation(this.state.row.email)) {
      NotificationManager.error("Please check your email!", 'Email')
    } else if (this.state.row.website === '') {
      NotificationManager.error("Please insert Website!", 'Website URL')
    } else if (!Validations.WebUrlValidation(this.state.row.website)) {
      NotificationManager.error("Please check your web site address!", 'Website URL')
    } else if (this.state.row.stateCity === '') {
      NotificationManager.error("Please insert State/City!", 'State/City')
    } else if (this.state.row.country === '') {
      NotificationManager.error("Please insert Country!", 'Country')
    } else if (this.state.row.logo === '') {
      NotificationManager.error("Please check Company Logo!", 'Logo')
    } else {
      this.setState({ flag: 0 })
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type);
    }
  };

  handleChange = name => event => {
    var cursor = this.state.row;
    cursor[name] = event.target.value;
    this.setState({ row: cursor });
  }
  handleLogoChange = async e => {
    let file = e.target.files[0];
    var form_data = new FormData();
    form_data.append('filepath', 'product_image');
    form_data.append('file', file, file.name);
    let image = await FileService.uploadFile(form_data);
    this.setState({
      row: {
        ...this.state.row,
        logo: image
      }
    })
  }
  changeImage = () => {
    this.refs.fileUploader.click();
  }
  render() {
    const { onRemove, user } = this.props;
    return (
      <div>
        {this.state.type === 'edit' && user.roles.Company &&
          <div className="flex">
            {user.roles.Company.saveRole && <IconButton onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>
              <Icon>edit_attributes</Icon>
            </IconButton>
            }
            {user.roles.Company.deleteRole &&
              <IconButton onClick={(ev) => {
                ev.stopPropagation();
                if (window.confirm('Are you sure to remove this company?')) {
                  onRemove(this.state.row);
                }
              }}>
                <Icon type="small">delete</Icon>
              </IconButton>
            }
          </div>
        }
        {this.state.type === 'add' && user.roles.Company && user.roles.Company.saveRole &&
          <div className="flex items-center justify-end">
            <Button className="normal-case" variant="contained" color="primary" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add Company</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          className='company-dialog'
        // style={{backgroundColor:'#ffffff'}}
        >

          <DialogTitle id="form-dialog-title" >Company Info</DialogTitle>
          <DialogContent>
            {this.state.type === 'add'
              ? <DialogContentText >
                {'To create company, please enter description here.'}
              </DialogContentText>
              : <DialogContentText >
                {'To update company, please enter description here.'}
              </DialogContentText>
            }
            <Grid container>
              <Grid item xs={12} className='edit-field'>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Company"
                  value={this.state.row.name || ''}
                  onChange={this.handleChange('name')}
                  variant='outlined'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} className='edit-field'>
                <TextField
                  margin="dense"
                  label="Address"
                  value={this.state.row.address || ''}
                  onChange={this.handleChange('address')}
                  variant='outlined'
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  margin="dense"
                  label="PAN No"
                  value={this.state.row.pan || ''}
                  onChange={this.handleChange('pan')}
                  variant='outlined'
                  error={!Validations.IntegerValidation(this.state.row.pan)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  margin="dense"
                  label="Regd. No"
                  value={this.state.row.regd || ''}
                  onChange={this.handleChange('regd')}
                  variant='outlined'
                  error={!Validations.IntegerValidation(this.state.row.regd)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  margin="dense"
                  label="Telephone"
                  variant='outlined'
                  value={this.state.row.telephone || ''}
                  onChange={this.handleChange('telephone')}
                  error={!Validations.TelephoneValidation(this.state.row.telephone)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  margin="dense"
                  label="Mobile"
                  value={this.state.row.mobile || ''}
                  onChange={this.handleChange('mobile')}
                  variant='outlined'
                  error={!Validations.TelephoneValidation(this.state.row.mobile)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  margin="dense"
                  label="Email ID"
                  value={this.state.row.email || ''}
                  onChange={this.handleChange('email')}
                  variant='outlined'
                  error={!Validations.EmailValidation(this.state.row.email)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  margin="dense"
                  label="Website"
                  value={this.state.row.website || ''}
                  onChange={this.handleChange('website')}
                  error={!Validations.WebUrlValidation(this.state.row.website)}
                  variant='outlined'
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  margin="dense"
                  label="State/City"
                  value={this.state.row.stateCity || ''}
                  onChange={this.handleChange('stateCity')}
                  variant='outlined'
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} className='edit-field'>
                <TextField
                  margin="dense"
                  label="Country"
                  value={this.state.row.country || ''}
                  onChange={this.handleChange('country')}
                  variant='outlined'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} className='edit-field'>
                <img src={`${API_URL}/asset${this.state.row.logo}`} onClick={this.changeImage} alt='Click here!' />
              </Grid>
            </Grid>
            <div className="flex file-upload" style={{ justifyContent: 'center' }}>
              <input className="m-4 logo" type='file' ref='fileUploader' onChange={this.handleLogoChange} />
            </div>

          </DialogContent>
          <DialogActions>
            <Button onClick={ev => {
              this.handleAllClose();
            }
            } color="secondary">
              {this.state.type === 'edit' && 'Update'}
              {this.state.type === 'add' && 'Add'}
            </Button>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDialog);