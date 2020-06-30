import React, {Component} from "react";
import {Link} from "react-router-dom"
import {
  withStyles,
  CardActions,
  Divider,
} from "@material-ui/core";

import CustomizedCard from "./CustomizedCard";
import CustomizedButton from "./CustomizedButton";
import FavouriteIcon from "./FavouriteIcon";

import "./tabs.css"

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  }
});

const displayData = {
  TrialBalance: "Trial Balance",
  BalanceSheet: "Balance Sheet",
  ProfitLoss: "Profit & Loss",
  CashFlow: "Cash Flow",
  Ledgerdetails: "Ledger Details",
  Charkhata: "Char Khata",
  Acreceivable: "A/C Receivable",
  Acpayable: "A/C Payable",
  Sharecapital: "Share Capital",
  Salarypayable: "Salary Payable",
  productStatement: "Product Statement",
  inventoryValuation: "Inventory Valuation",
  stockValues: "Stock Values/Cost/Sales"
};

class SalesTab extends Component {
  state = {
    searchText: "",
    favourites: {
      TrialBalance: false,
      BalanceSheet: false,
      ProfitLoss: false,
      CashFlow: false,
      Ledgerdetails: false,
      Charkhata: false,
      Acreceivable: false,
      Acpayable: false,
      Sharecapital: false,
      Salarypayable: false,
      productStatement: false,
      inventoryValuation: false,
      stockValues: false
    }
  };

  componentDidMount () {
    const currentFavourites = this.loadFavourites()

    const favourites = {}
    currentFavourites.forEach((cfv) => { if (displayData[cfv.key]) favourites[cfv.key] = true })
    this.setState({favourites: {...this.state.favourites, ...favourites}})
  }

  loadFavourites = () => {
    const favouriteData = localStorage.getItem('settings-favourites')
    if (!favouriteData) return []
    try {
      return JSON.parse(favouriteData)
    } catch {
      return []
    }
  }

  updateFavourites = (data) => {
    const favouriteKey = Object.keys(data)[0]
    const isNew = data[favouriteKey]

    const itemToStore = {
      title: displayData[favouriteKey],
      routeKey: `/settings/AccountInventory/${favouriteKey}`,
      key: favouriteKey,
    }

    let currentFavourites = this.loadFavourites()
    if (!isNew) {
      // delete
      currentFavourites = currentFavourites.filter(({routeKey}) => routeKey !== itemToStore.routeKey)
    } else {
      currentFavourites.push(itemToStore)
    }

    localStorage.setItem('settings-favourites', JSON.stringify(currentFavourites))
  }

  setSearchText = event => {
    this.setState({searchText: event.target.value});
  };

  handleFavourite = data => {
    this.updateFavourites(data)
    this.setState({favourites: {...this.state.favourites, ...data}});
  };

  render () {
    const {classes} = this.props;
    const {favourites} = this.state;
    const favouriteKeys = Object.keys(favourites);

    return (
      <React.Fragment>
        <CustomizedCard className={classes.card}>
          {
            favouriteKeys.map((favouriteKey, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="cardActionsContainer">
                    <CardActions>
                      <FavouriteIcon
                        passingProps={{
                          handleFavourite: this.handleFavourite,
                          favourites: favourites,
                          favouriteKey: favouriteKey
                        }}
                      />
                      <Link to={`/settings/AccountInventory/${favouriteKey}`}>
                        <CustomizedButton size="small">
                          {displayData[favouriteKey]}
                        </CustomizedButton>
                      </Link>
                    </CardActions>
                  </div>
                  <Divider />
                </React.Fragment>
              );
            })}
        </CustomizedCard>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(SalesTab);
