import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as authActions from 'app/auth/store/actions';
import {
  Icon, IconButton, Radio, RadioGroup, FormControlLabel, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem
} from '@material-ui/core';
import { NotificationManager } from 'react-notifications';
import LabelControl from '../../../components/LabelControl';
import { ProjectService } from '../../../services';

class TodoListDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      type: '',
      employeeList: [],
      row: {
        id: 0,
        task: '',
        startDate: null,
        dueDate: null,
        remark: '',
        status: 0,
        Assign_to: ''
      }
    };
    this.CreateNewTask = this.CreateNewTask.bind(this);
    this.UpdateTask = this.UpdateTask.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;
    this.setState({ row: this.props.row, type: this.props.type, employeeList: this.props.employeeList });
    this.setState({ Created_by: user.id })
  }
  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type, employeeList: this.props.employeeList });
  };

  handleClose = async () => {
    if (this.state.row.task === '') {
      NotificationManager.error("Please insert task Name!")
    } else {
      this.setState({ flag: 0 })
      this.setState({ open: false });
      let { row } = this.state;
      if (row.id > 0)
        await this.UpdateTask()
      else
        await this.CreateNewTask()

      this.props.onSave(this.state.row, this.state.type);
    }
  };

  async CreateNewTask() {
    let { row } = this.state;

    if (row.id === undefined)
      row.id = 0;

    let Ntask = {};
    Ntask.id = row.id;
    Ntask.task = row.task;
    Ntask.start_date = row.startDate;
    Ntask.due_date = row.dueDate;
    Ntask.status = row.status;
    Ntask.remark = row.remark;
    Ntask.assign_to = row.Assign_to;
    await ProjectService.createTask(Ntask)
  }

  async UpdateTask() {
    let { row } = this.state;
    let Etask = {};
    Etask.id = row.id;
    Etask.task = row.task;
    Etask.start_date = row.startDate;
    Etask.due_date = row.dueDate;
    Etask.status = row.status;
    Etask.remark = row.remark;
    Etask.assign_to = row.Assign_to;
    await ProjectService.updateTask(Etask)
  }

  onClose = () => {
    this.setState({ open: false });
  }

  handleChange = name => event => {
    let { row } = this.state;
    switch (name) {
      default:
        row[name] = event.target.value;
    }
    this.setState({ row });
  }

  render() {
    const { onRemove, row } = this.props;
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
            {false && <IconButton onClick={(ev) => {
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
            }}>Add Task</Button>
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={() => this.onClose()}
          aria-labelledby="form-dialog-title"
          className='todolist-dialog'
        >
          <DialogTitle id="form-dialog-title">To do list</DialogTitle>
          <DialogContent>
            {this.state.type === 'add'
              ? <DialogContentText >
                {'To create new Project, please enter description here.'}
              </DialogContentText>
              : <DialogContentText >
                {'To update Project, please enter description here.'}
              </DialogContentText>
            }
            <Grid container>
              <Grid item xs={12}>
                <LabelControl label='Task'>
                  <TextField fullWidth
                    variant='outlined'
                    value={row.task}
                    error={!row.task}
                    onChange={this.handleChange('task')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={12}>
                <LabelControl label='Employee'>
                  <TextField
                    select fullWidth
                    variant='outlined'
                    value={this.state.row.Assign_to || ''}
                    onChange={this.handleChange('Assign_to')}>

                    {this.state.employeeList.map((element, index) => (
                      <MenuItem key={index} value={element.name}>{element.name}</MenuItem>
                    ))}

                  </TextField>
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Start Date'>
                  <TextField fullWidth
                    type='date'
                    variant='outlined'
                    value={moment(row.startDate).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD')}
                    error={!row.startDate}
                    onChange={this.handleChange('startDate')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label='Due Date'>
                  <TextField fullWidth
                    type='date'
                    variant='outlined'
                    value={moment(row.dueDate).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD')}
                    error={!row.dueDate}
                    onChange={this.handleChange('dueDate')}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={12}>
                <LabelControl label='Status'>
                  <RadioGroup value={row.status} onChange={this.handleChange('status')} className='status-list'>
                    <FormControlLabel value='0' control={<Radio checked={row.status === 0 ? true : false} />} label="Due" />
                    <FormControlLabel value='1' control={<Radio checked={row.status === 1 ? true : false} />} label="In Progress" />
                    <FormControlLabel value='2' control={<Radio checked={row.status === 2 ? true : false} />} label="Done" />
                  </RadioGroup>
                </LabelControl>
              </Grid>
              <Grid item xs={12}>
                <LabelControl label='Remarks'>
                  <TextField fullWidth multiline
                    rows={5}
                    variant='outlined'
                    value={row.remark || ''}
                    onChange={this.handleChange('remark')}
                  />
                </LabelControl>
              </Grid>
            </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(TodoListDialog);