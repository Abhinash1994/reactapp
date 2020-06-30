import React from "react";
import {
  Grid,
  Button,
  TextField,
  Icon,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "app/auth/store/actions";
import MenuItem from "@material-ui/core/MenuItem";
import Validations from "../../../helper/Validations";
import { NotificationManager } from "react-notifications";
import LabelControl from "../../../components/LabelControl";
import { BankService } from "../../../services";
class BankManagerDialog extends React.Component {
  state = {
    open: false,
    bankAmount: {},
    type: "",
    banks: [],
    accountTypes: ["Fixed Account", "Current Account", "Saving Account"],
    row: {
      trans_Id: 1,
      ledger_Code: 0,
      debit: (Math.random() * 1000).toFixed(2),
      credit: 0,
      gi_type: "gi_type",
      remarks: "remarks",
      narration: "naration",
      status: true,
      vouc_No: "",
      fiscal: "1",
      date: "2019-11-8",
      tran_type: "tran_type",
      branch_id: 1,
      project_id: 1,
      depositby: "",
    },
  };

  async componentDidMount() {
    let banks = await BankService.getBanks();
    this.setState({ type: this.props.type, row: this.props.row, banks });
    if (this.state.type === "add" && this.props.bankType === "debit")
      this.handleClickOpen();
  }
  handleClickOpen = () => {
    this.setState({
      open: true,
      type: this.props.type,
      bankAmount: this.props.bankAmount,
    });
    let bankAmount = this.props.bankAmount;
    this.setState({ bankAmount });
    if (this.state.type === "add") {
      this.setState({
        row: this.props.row,
      });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAllClose = () => {
    const { row } = this.state;
    if (
      row.ledger_Code === 0 ||
      !Validations.IntegerValidation(row.ledger_Code)
    ) {
      NotificationManager.error("Please select bank!", "Bank");
    } else if (!Validations.IntegerValidation(row[this.props.bankType])) {
      NotificationManager.error("Amount is double!", "Deposit Amont");
    } else if (row.debit === 0 && row.credit === 0) {
      NotificationManager.error("Amount can not be empty!", "Amont");
    } else if (row.depositby === undefined) {
      NotificationManager.error("Deposit by can not be empty", "Deposit by");
    } else {
      if (this.props.bankType === "credit") {
        var banklimit = this.state.bankAmount.filter(
          (x) => x.ledger_Code === row.ledger_Code
        );

        if (row.credit > banklimit[0].total) {
          NotificationManager.error("withdraw amount is more than bank amount");
          return;
        }
      }

      var rw = row;
      if (this.state.type === "add") {
        var text =
          this.props.bankType === "debit" ? "Doposit By: " : "Withdraw By: ";
        rw.remarks = text + row.depositby + " " + row.remarks;
      }

      this.setState({ open: false });
      this.props.onSave(rw, this.state.type);
    }
  };

  getBanknameName = (id) => {
    let result = this.state.banks.filter(
      (element) => element.ledger_code === id
    );
    var r = this.state.row;
    if (result.length) {
      r = result[0].name;
      return r;
    }
    return "";
  };

  handleChange = (name) => (event) => {
    var cursor = this.state.row;
    cursor[name] = event.target.value;
    this.setState({ row: cursor });
  };

  render() {
    const { onRemove, bankType, user } = this.props;
    const { row } = this.state;
    return (
      <div>
        {this.state.type === "edit" && (
          <div>
            {user.roles.Bank.saveRole && (
              <IconButton
                onClick={(ev) => {
                  ev.stopPropagation();
                  this.handleClickOpen();
                }}
              >
                <Icon>edit_attributes</Icon>
              </IconButton>
            )}
            {user.roles.Bank.deleteRole && (
              <IconButton
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (
                    window.confirm(
                      `Are you sure to remove this ${
                        bankType === "debit" ? "Doposit" : "Withdraw"
                      }?`
                    )
                  ) {
                    onRemove(this.state.row);
                  }
                }}
              >
                <Icon type="small">delete</Icon>
              </IconButton>
            )}
          </div>
        )}
        {this.state.type === "add" && (
          <div className="flex items-center justify-end">
            <Button
              className="normal-case"
              variant="contained"
              color="primary"
              aria-label="Add Message"
              onClick={(ev) => {
                ev.stopPropagation();
                this.handleClickOpen();
              }}
            >
              {`Add ${bankType === "debit" ? "Deposit" : "Withdraw"}`}
            </Button>
          </div>
        )}
        <Dialog
          fullWidth
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Bank Deposit</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.type === "add"
                ? `To create ${
                    bankType === "debit" ? "doposit" : "withdraw"
                  }, please enter description here.`
                : `To update ${
                    bankType === "debit" ? "doposit" : "withdraw"
                  }, please enter description here.`}
            </DialogContentText>
            <Grid container>
              <Grid item xs={6}>
                <LabelControl label="Bank Name">
                  <TextField
                    fullWidth
                    select
                    variant="outlined"
                    value={row.ledger_Code || ""}
                    error={!Validations.IntegerValidation(row.ledger_Code)}
                    onChange={this.handleChange("ledger_Code")}
                  >
                    {this.props.banks.map((element) => (
                      <MenuItem
                        key={element.ledger_code}
                        value={element.ledger_code}
                      >
                        {element.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl label="Voucher No">
                  <TextField
                    fullWidth
                    disabled
                    variant="outlined"
                    value={row.vouc_No}
                  />
                </LabelControl>
              </Grid>
              {
                <Grid item xs={6}>
                  <LabelControl label="Cash Balance">
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={row.cash_balance || ""}
                      error={!Validations.DoubleValidation(row.cash_balance)}
                      onChange={this.handleChange("cash_balance")}
                    />
                  </LabelControl>
                </Grid>
              }
              <Grid item xs={6}>
                <LabelControl
                  label={`${
                    bankType === "debit" ? "Deposit" : "Withdraw"
                  } Amount`}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={row[bankType] || ""}
                    error={!Validations.DoubleValidation(row[bankType])}
                    onChange={this.handleChange(bankType)}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={6}>
                <LabelControl
                  label={`${bankType === "debit" ? "Deposit" : "Withdraw"} By`}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={row.depositby || ""}
                    onChange={this.handleChange("depositby")}
                  />
                </LabelControl>
              </Grid>
              <Grid item xs={12}>
                <LabelControl label="Remarks">
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={row.remarks || ""}
                    onChange={this.handleChange("remarks")}
                  />
                </LabelControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.handleAllClose();
              }}
              color="secondary"
            >
              {this.state.type === "edit" ? "Update" : "Add"}
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
  return bindActionCreators(
    {
      logout: authActions.logoutUser,
    },
    dispatch
  );
}

function mapStateToProps({ auth }) {
  return {
    user: auth.user,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BankManagerDialog);
