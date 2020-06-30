import React, {Component} from "react";
import {
  withStyles,
  CardActions,
  Divider,
} from "@material-ui/core";

import CustomizedCard from "./CustomizedCard";
import CustomizedButton from "./CustomizedButton";
import FavouriteIcon from "./FavouriteIcon";
import {Link} from "react-router-dom"

import "./tabs.css"

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  }
});

const routeMap = {
  SalesByCustomer: "/sales/list",
  SalesByProduct: "/sales/report",
  PurchaseByProduct: "/newpurchase",
  PurchaseBySupplier: "/newpurchase",
}

const displayData = {
  SalesByCustomer: "Sales By Customer",
  SalesByProduct: "Sales By Product",
  PurchaseByProduct: "Purchase By Product",
  PurchaseBySupplier: "Purchase By Supplier",
};

class SalesTab extends Component {
  state = {
    searchText: "",
    favourites: {
      SalesByCustomer: false,
      SalesByProduct: false,
      PurchaseByProduct: false,
      PurchaseBySupplier: false,
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
      routeKey: routeMap[favouriteKey],
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
          {favouriteKeys.map(favouriteKey => {
            return (
              <React.Fragment>
                <div className="cardActionsContainer">
                  <CardActions>
                    <FavouriteIcon
                      passingProps={{
                        handleFavourite: this.handleFavourite,
                        favourites: favourites,
                        favouriteKey: favouriteKey
                      }}
                    />
                    <Link to={routeMap[favouriteKey]}>
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
