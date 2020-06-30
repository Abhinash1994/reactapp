import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import Validations from '../../../helper/Validations';
import {
  Icon, IconButton, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Checkbox,
} from '@material-ui/core';
import { NotificationManager } from 'react-notifications';
import LabelControl from '../../../components/LabelControl';
import { InventoryService } from '../../../services';

class ProjectDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      row: {
        UnitCode:'', status:true, UnitName:''
      }
    };
    this.saveProject = this.saveProject.bind(this);
  }

  componentDidMount() {
    let { user } = this.props;
    this.setState({ row: this.props.row, type: this.props.type });
    this.setState({ Created_by: user.id })
  }

  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleClose = async () => {
    if (this.state.row.project_name === '') {
      NotificationManager.error("Please insert Project Name!")
    } else if (this.state.row.branch_code === '') {
      NotificationManager.error("Please insert Code!")
    }  else if (this.state.row.Remarks === '') {
      NotificationManager.error("Please put Note!")
    }
    else {
      this.setState({ flag: 0 })
      await this.saveProject();
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type);
    }
  };

  async saveProject() {
    if (this.state.row.id > 0)
      await InventoryService.updateUnit(this.state.row);
    else
      await InventoryService.createUnit(this.state.row);
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
              if (window.confirm('Are you sure to remove this Project?')) {
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
            }}>Add Unit</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={() => this.onClose()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Product</DialogTitle>
          <DialogContent>
            {this.state.type === 'add' ?
              <DialogContentText >
                To create new Unit, please enter description here.
            </DialogContentText>
              :
              <DialogContentText >
                To update Unit, please enter description here.
            </DialogContentText>
            }
            <LabelControl label='Unit Name'>
              <TextField
                autoFocus fullWidth
                margin="dense"
                value={this.state.row.UnitName || ''}
                error={!this.state.row.UnitName}
                onChange={this.handleChange('UnitName')}
                variant='outlined'
              />
            </LabelControl>
            <LabelControl label='Unit Code'>
              <TextField
                margin="dense"
                value={this.state.row.UnitCode || ''}
                error={!Validations.IntegerValidation(this.state.row.UnitCode)}
                onChange={this.handleChange('UnitCode')}
                fullWidth
                variant='outlined'
              />
               </LabelControl>
               <FormControlLabel label='Status' labelPlacement="start"
                  control={<Checkbox checked={this.state.row.status}
                    onClick={this.handleChange('status')} />}
                />
          </DialogContent>
          <DialogActions>
            <Button onClick={ev => {
              this.saveProject();
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDialog);