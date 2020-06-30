import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import Validations from '../../../helper/Validations';
import {
  Icon, IconButton, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem
} from '@material-ui/core';
import { NotificationManager } from 'react-notifications';
import LabelControl from '../../../components/LabelControl';
import { ProjectService } from '../../../services';

class ProjectDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      type: '',
      statusList: [{ id: 0, name: 'Close' }, { id: 1, name: 'In Progress' }, { id: 2, name: 'Open' }],
      row: {
        id: 0,
        project_name: '',
        branch_code: '',
        Remarks: '',
        status: 0
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
      await ProjectService.updateProject(this.state.row);
    else
      await ProjectService.createProject(this.state.row);

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
            }}>Add Project</Button>
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
                To create new Project, please enter description here.
            </DialogContentText>
              :
              <DialogContentText >
                To update Project, please enter description here.
            </DialogContentText>
            }
            <LabelControl label='Project Name'>
              <TextField
                autoFocus fullWidth
                margin="dense"
                value={this.state.row.project_name || ''}
                error={!this.state.row.project_name}
                onChange={this.handleChange('project_name')}
                variant='outlined'
              />
            </LabelControl>
            <LabelControl label='Project Code'>
              <TextField
                margin="dense"
                value={this.state.row.branch_code || ''}
                error={!Validations.IntegerValidation(this.state.row.branch_code)}
                onChange={this.handleChange('branch_code')}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDialog);