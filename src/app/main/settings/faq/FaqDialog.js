import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "app/auth/store/actions";
import { Icon, IconButton } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
class FaqDialog extends React.Component {
  state = {
    open: false,
    type: "",
    row: {
      bankname: "",
      accountno: "",
      accounttype: "Fixed Account",
      branchName: "",
      swiftcode: "",
      url: "",
      createdby: ""
    },
    flag: 0
  };

  componentDidMount() {
    console.log("I am from didmount");
    console.log("I am from props: ", this.props);
    this.setState({ type: this.props.type });
    this.setState({ Created_by: 1 });
    this.handleClickOpen();
  }
  handleLogoChange = e => {
    let file = e.target.files[0];
    var cursor = this.state.row;
    cursor["Logo"] = file;
    this.setState({ row: cursor });

    // this.props.row.Logo =
    // alert(this.state.row.Logo)
  };

  handleClickOpen = () => {
    this.setState({ open: true, type: this.props.type });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAllClose = () => {
    if (this.state.row.bankname === "") {
      alert("Please Enter Bank Name");
    } else if (this.state.row.accountno === "") {
      alert("Please inser Account No");
    } else if (this.state.row.accounttype === "") {
      alert("Please Enter Account Type");
    } else if (this.state.row.branchName === "") {
      alert("Please Enter Branch Name");
    } else if (this.state.row.swiftcode === "") {
      alert("Please Enter Swift Code");
    } else {
      this.setState({ flag: 0 });
      this.setState({ open: false });
      this.props.onSave(this.state.row, this.state.type);
    }
  };

  handleChange = name => event => {
    var cursor = this.state.row;
    cursor[name] = event.target.value;
    this.setState({ row: cursor });
  };

  render() {
    const { onRemove } = this.props;
    console.log("Row Data: ", this.state.row);
    return (
      <div>
        {this.state.type === "edit" && (
          <div>
            <IconButton
              onClick={ev => {
                ev.stopPropagation();
                this.handleClickOpen();
              }}
            >
              <Icon>edit_attributes</Icon>
            </IconButton>
            <IconButton
              onClick={ev => {
                ev.stopPropagation();
                if (window.confirm("Are you sure to remove this Bank?")) {
                  onRemove(this.state.row);
                }
              }}
            >
              <Icon type="small">delete</Icon>
            </IconButton>
          </div>
        )}
        {this.state.type === "add" && (
          <div className="flex items-center justify-end">
            <Button
              className="normal-case"
              variant="contained"
              color="primary"
              aria-label="Add Message"
              onClick={ev => {
                ev.stopPropagation();
                this.handleClickOpen();
              }}
            >
              Add Bank
            </Button>
          </div>
        )}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Bank</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To Create the Bank Please enter Bank Details Here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="bankname"
              name="bankname"
              label="Bank Name"
              value={this.state.row.bankname}
              onChange={this.handleChange("bankname")}
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="accountno"
              name="accountno"
              label="Account No"
              type="number"
              value={this.state.row.accountno}
              onChange={this.handleChange("accountno")}
              variant="outlined"
              fullWidth
            />
            {/* <TextField
              margin="dense"
              id="accountype"
              name="accounttype"
              label="Account Type"
              value={this.state.row.accounttype}
              onChange={this.handleChange("accounttype")}
              variant="outlined"
              fullWidth
            /> */}

            <TextField
              margin="dense"
              id="accounttype"
              name="accounttype"
              select
              label="Account Type"
              value={this.state.row.accounttype}
              onChange={this.handleChange("accounttype")}
              variant="outlined"
              fullWidth
            >
              {["Fixed Account", "Current Account", "Saving Account"].map(
                (option, index) => (
                  <MenuItem
                    style={{ textAlign: "left" }}
                    key={index}
                    value={option}
                  >
                    {option}
                  </MenuItem>
                )
              )}
            </TextField>
            <TextField
              autoFocus
              margin="dense"
              id="branchName"
              name="branchName"
              label="Branch Name"
              value={this.state.row.branchName}
              onChange={this.handleChange("branchName")}
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="swiftcode"
              name="swiftcode"
              label="Swift Code"
              value={this.state.row.swiftcode}
              onChange={this.handleChange("swiftcode")}
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="url"
              name="url"
              label="Url"
              value={this.state.row.url}
              onChange={this.handleChange("url")}
              variant="outlined"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.handleAllClose();
              }}
              color="secondary"
            >
              {this.state.type === "edit" && "Update"}
              {this.state.type === "add" && "Add"}
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
function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        logout: authActions.logoutUser
    }, dispatch);
}

function mapStateToProps({auth})
{
    return {
        user: auth.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FaqDialog);
