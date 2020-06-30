import React from 'react';
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
	DialogTitle
} from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import MenuItem from '@material-ui/core/MenuItem';
import Validations from '../../../helper/Validations';
import { NotificationManager } from 'react-notifications';
import LabelControl from '../../../components/LabelControl';
import ChartOfAccountService from '../../../services/ChartOfAccountService';
import { BankService } from '../../../services';
class BankManagerDialog extends React.Component {
	state = {
		open: false,
		type: '',
		banks: [],
		accountTypes: [ 'Fixed Account', 'Current Account', 'Saving Account' ],
		row: {
			trans_Id: 1,
			ledger_Code: 0,
			debit: (Math.random() * 1000).toFixed(2),
			credit: 0,
			gi_type: 'gi_type',
			remarks: 'remarks',
			narration: 'naration',
			status: true,
			vouc_No: '3',
			fiscal: '1',
			date: '2019-11-8',
			tran_type: 'tran_type',
			branch_id: 1,
			project_id: 1
		}
	};

	async componentDidMount() {
		let banks = await BankService.getBanks();
		this.setState({ type: this.props.type, row: this.props.row, banks });
		// this.handleClickOpen();
	}
	handleClickOpen = () => {
		this.setState({ open: true, type: this.props.type });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleAllClose = () => {
		const { row } = this.state;
		if (!Validations.IntegerValidation(row.ledger_Code)) {
			NotificationManager.error('Please select bank type!', 'Bank');
		} else if (!Validations.IntegerValidation(row[this.props.bankType])) {
			NotificationManager.error('Amount is double!', 'Deposit Amont');
		} else if (row.remarks === '') {
			NotificationManager.error('Please enter remarks!', 'Remarks');
		} else {
			this.setState({ open: false });
			this.props.onSave(this.state.row, this.state.type);
		}
	};

	getBanknameName = (id) => {
		let result = this.state.banks.filter((element) => element.ledger_code === id);
		var r = this.state.row;
		if (result.length) {
			var r = result[0].name;
			return r;
		}
		return '';
	};

	handleChange = (name) => (event) => {
		var cursor = this.state.row;
		cursor[name] = event.target.value;
		this.setState({ row: cursor });
	};

	render() {
		const { onRemove, bankType } = this.props;
		const { row } = this.state;
		return (
			<div>
				{this.state.type === 'edit' && (
					<div>
						<IconButton
							onClick={(ev) => {
								ev.stopPropagation();
								this.handleClickOpen();
							}}
						>
							<Icon>edit_attributes</Icon>
						</IconButton>
						<IconButton
							onClick={(ev) => {
								ev.stopPropagation();
								if (
									window.confirm(
										`Are you sure to remove this ${bankType === 'debit' ? 'Doposit' : 'Withdraw'}?`
									)
								) {
									onRemove(this.state.row);
								}
							}}
						>
							<Icon type="small">delete</Icon>
						</IconButton>
					</div>
				)}
				{this.state.type === 'add' && (
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
							{`Add ${bankType === 'debit' ? 'Doposit' : 'Withdraw'}`}
						</Button>
					</div>
				)}
				<Dialog fullWidth open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Bank Deposit</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{this.state.type === 'add' ? (
								`To create ${bankType === 'debit'
									? 'doposit'
									: 'withdraw'}, please enter description here.`
							) : (
								`To update ${bankType === 'debit'
									? 'doposit'
									: 'withdraw'}, please enter description here.`
							)}
						</DialogContentText>
						<Grid container>
							<Grid item xs={12}>
								<LabelControl label="Bank Name">
									<TextField
										fullWidth
										select
										variant="outlined"
										value={row.ledger_Code || ''}
										error={!Validations.IntegerValidation(row.ledger_Code)}
										onChange={this.handleChange('ledger_Code')}
									>
										{this.props.banks.map((element) => (
											<MenuItem key={element.ledger_code} value={element.ledger_code}>
												{element.name}
											</MenuItem>
										))}
									</TextField>
								</LabelControl>
							</Grid>
							<Grid item xs={6}>
								<LabelControl label="Transaction No">
									<TextField
										fullWidth
										disabled
										variant="outlined"
										value={row.trans_Id || ''}
										error={!Validations.IntegerValidation(row.trans_Id)}
										onChange={this.handleChange('trans_Id')}
									/>
								</LabelControl>
							</Grid>
							{/* <Grid item xs={6}>
								<LabelControl label="Cash Balance">
									<TextField
										fullWidth
										variant="outlined"
										value={row.cash_balance || ''}
										error={!Validations.DoubleValidation(row.cash_balance)}
										onChange={this.handleChange('cash_balance')}
									/>
								</LabelControl>
							</Grid> */}
							<Grid item xs={6}>
								<LabelControl label={`${bankType === 'debit' ? 'Deposit' : 'Withdraw'} Amount`}>
									<TextField
										fullWidth
										variant="outlined"
										value={row[bankType] || ''}
										error={!Validations.DoubleValidation(row[bankType])}
										onChange={this.handleChange(bankType)}
									/>
								</LabelControl>
							</Grid>
							<Grid item xs={6}>
								<LabelControl label={`${bankType === 'debit' ? 'Deposit' : 'Withdraw'} By`}>
									<TextField variant="outlined" fullWidth disabled value={this.props.user.username} />
								</LabelControl>
							</Grid>
							<Grid item xs={12}>
								<LabelControl label="Remarks">
									<TextField
										fullWidth
										variant="outlined"
										value={row.remarks || ''}
										error={row.remarks === ''}
										onChange={this.handleChange('remarks')}
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
							{this.state.type === 'edit' ? 'Update' : 'Add'}
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
			logout: authActions.logoutUser
		},
		dispatch
	);
}

function mapStateToProps({ auth }) {
	return {
		user: auth.user
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(BankManagerDialog);
