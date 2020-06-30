import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import Validations from '../../helper/Validations';
import {
  Icon, IconButton, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem
} from '@material-ui/core';
import { NotificationManager } from 'react-notifications';
import LabelControl from '../../components/LabelControl';
import { GoDownService } from '../../services';

class GodownDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      type: '',
      statusList: [{ id: 0, name: 'Not In Use' }, { id: 1, name: 'In Use' }],
      row: {
        Id: 0,
        GoDown_Name: '',
        GoDown_Code: '',
        Remarks: '',
        status: 0
      }
    };
    this.saveGodown = this.saveGodown.bind(this);
  }

  componentDidMount() {
    let { user } = this.props;
    this.setState({ row: this.props.row, type: this.props.type });
    this.setState({ CreatedBy: user.id })
  }

  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleClose = async () => {
    if (this.state.row.GoDown_Name === '') {
      NotificationManager.error("Please insert  Name!")
    } else if (this.state.row.GoDown_Code === '') {
      NotificationManager.error("Please insert Code!")
    }  else if (this.state.row.Remarks === '') {
      NotificationManager.error("Please put Note!")
    }
    else {
      this.setState({ flag: 0 })
      await this.saveGodown();
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type);
    }
  };

  async saveGodown() {
    if (this.state.row.id > 0)
      await GoDownService.updateGodown(this.state.row);
    else
      await GoDownService.createGodown(this.state.row);

  }

  onClose = () => {
    this.setState({ open: false });
  }

  handleChange = name => event => {
    var cursor = this.state.row;
    switch (name) {
      default:
        cursor[name] = event.target.value;
    }
    this.setState({ row: cursor });
  }
  render() {
    const { onRemove } = this.props;
    let { statusList } = this.state;
    console.log("get data",this.state.row)
    return (
      <div>
        {this.state.type === 'edit' &&
          <div className="flex">
            {<IconButton onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}
              className='color-limegreen'>
              <Icon>edit_attributes</Icon>
            </IconButton>}
            {/* {user.roles.Project && <IconButton onClick={(ev) => { */}
            {<IconButton onClick={(ev) => {
              ev.stopPropagation();
              if (window.confirm('Are you sure to remove this GoDown?')) {
                onRemove(this.state.row);
              }
            }}
              className='color-brown'>
              <Icon type="small">delete</Icon>
            </IconButton>}
          </div>
        }
        {this.state.type === 'add' &&
          <div className="flex items-center justify-end pb-16">
            <Button className="normal-case" variant="contained" color="primary" aria-label="Add Message" onClick={(ev) => {
              ev.stopPropagation();
              this.handleClickOpen();
            }}>Add GodOwn</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={() => this.onClose()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">GoDown</DialogTitle>
          <DialogContent>
            {this.state.type === 'add' ?
              <DialogContentText >
                To create new GoDown, please enter description here.
            </DialogContentText>
              :
              <DialogContentText >
                To update GoDown, please enter description here.
            </DialogContentText>
            }
            <LabelControl label='GoDown Name'>
              <TextField
                autoFocus fullWidth
                margin="dense"
                value={this.state.row.GoDown_Name || ''}
                error={!this.state.row.GoDown_Name}
                onChange={this.handleChange('GoDown_Name')}
                variant='outlined'
              />
            </LabelControl>
            <LabelControl label='GoDown Code'>
              <TextField
                margin="dense"
                value={this.state.row.GoDown_Code || ''}
                error={!Validations.IntegerValidation(this.state.row.GoDown_Code)}
                onChange={this.handleChange('GoDown_Code')}
                fullWidth
                variant='outlined'
              />
               </LabelControl>
            <LabelControl label='Note'>
              <TextField
                margin="dense"
                value={this.state.row.Remarks || ''}
                onChange={this.handleChange('Remarks')}
                fullWidth
                variant='outlined'
              />
            </LabelControl>
            <LabelControl label='Type'>
              <TextField
                select fullWidth
                className='no-padding-select'
                variant='outlined'
                value={this.state.row.status}
                onChange={this.handleChange('status')}>
                {statusList.map((element, index) => (
                  <MenuItem key={index} value={element.id}>{element.name}</MenuItem>
                ))}
              </TextField>
            </LabelControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={ev => {
              this.handleClose();
            }
            } color="secondary">
              {this.state.type === 'edit' && 'Update'}
              {this.state.type === 'add' && 'Add'}
            </Button>
            <Button onClick={() => this.onClose()} color="secondary">
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

export default connect(mapStateToProps, mapDispatchToProps)(GodownDialog);