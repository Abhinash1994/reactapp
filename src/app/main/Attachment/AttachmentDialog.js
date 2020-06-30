import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import {
    Icon, IconButton
} from '@material-ui/core';
import { FileService } from '../../services';
import moment from 'moment';

class AttachmentDialog extends React.Component {
    state = {
        open: false,
        type: '',
        customers: [],
        row: {
            date: '',
            fiscalyear: 2020,
            file_name: '',
            file_description: '',
            attachment: null
        },
        flag: 0,
    };

    componentDidMount() {
        this.setState({ row: this.props.row, type: this.props.type });
        this.setState({ Created_by: 1 })
    }
    handleLogoChange = (e) => {
        this.setState({ flag: 1 })
        let file = e.target.files[0];
        var cursor = this.state.row;
        cursor['attachment'] = file;
        this.setState({ row: cursor });
    }
    handleClickOpen = () => {
        this.setState({ open: true, row: this.props.row, type: this.props.type, customers: this.props.customers });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleAllClose = () => {
        this.setState({ flag: 0 })
        this.setState({ open: false });
        this.props.onSave(this.state.row, this.state.type);
    };

    handleChange = name => event => {
        var cursor = this.state.row;
        cursor[name] = event.target.value;
        this.setState({ row: cursor });
    }

    handleLogoChange = async (e) => {
        this.setState({ flag: 1 })
        let file = e.target.files[0];
        var cursor = this.state.row;
        const Base64 = await this.toBase64(file);
        cursor['attachment'] = Base64;
        this.setState({ row: cursor });
    }

    handleLogoChange = async e => {
        let file = e.target.files[0];
        var form_data = new FormData();
        form_data.append('filepath', 'product_image');
        form_data.append('file', file, file.name);
        await FileService.uploadFile(form_data);
        const Base64 = await this.toBase64(file);
        this.setState({
            row: {
                ...this.state.row,
                attachment: Base64
            }
        })
    }

    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });


    render() {
        const {  onRemove } = this.props;
        const { row, type } = this.state;
        return (
            <div>
                {type === 'edit' &&
                    <div>
                        <IconButton onClick={(ev) => {
                            ev.stopPropagation();
                            this.handleClickOpen();
                        }}>
                            <Icon>edit_attributes</Icon>
                        </IconButton>
                        <IconButton onClick={(ev) => {
                            ev.stopPropagation();
                            if (window.confirm('Do you want to delete this attachment?')) {
                                onRemove(this.state.row);
                            }
                        }}>
                            <Icon type="small">delete</Icon>
                        </IconButton>
                    </div>
                }
                {type === 'add' &&
                    <div className="flex items-center justify-end">
                        <Button className="normal-case" variant="contained" color="primary" aria-label="Add Message" onClick={(ev) => {
                            ev.stopPropagation();
                            this.handleClickOpen();
                        }}>New Attachment</Button>
                    </div>
                }
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">New Attachment</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="invoiceno"
                            name="date"
                            label="Date"
                            type="date"
                            value={moment(row.date).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD')}
                            onChange={this.handleChange('date')}
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="invoiceno"
                            name="fiscalyear"
                            label="Fiscal year"
                            value={row.fiscalyear}
                            onChange={this.handleChange('fiscalyear')}
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="invoiceno"
                            name="file_name"
                            label="File name"
                            value={row.file_name}
                            onChange={this.handleChange('file_name')}
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="invoiceno"
                            name="Attachment"
                            label="File file_description"
                            value={row.file_description}
                            onChange={this.handleChange('file_description')}
                            variant="outlined"
                            fullWidth
                        />
                        <div className="flex file-upload" style={{ justifyContent: 'center' }}>
                            <input className="m-4 attachment" type='file' ref='fileUploader' onChange={this.handleLogoChange} />
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={ev => {
                            this.handleAllClose();
                        }
                        } color="secondary">
                            {type === 'edit' && 'Save'}
                            {type === 'add' && 'Add'}
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

export default connect(mapStateToProps, mapDispatchToProps)(AttachmentDialog);