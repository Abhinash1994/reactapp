import React, { Component } from "react";
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
  CompanyOverview: "Company Overview",
  SalesPerformance: "Sales Performance",
  ExpensesPerformance: "Expenses Perfomances"
};

class ManagementTab extends Component {
  state = {
    searchText: "",
    favourites: {
      CompanyOverview: false,
      SalesPerformance: false,
      ExpensesPerformance: false
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
    this.setState({ searchText: event.target.value });
  };

  handleFavourite = data => {
    this.updateFavourites(data)
    this.setState({ favourites: { ...this.state.favourites, ...data } });
  };

  render() {
    const { classes } = this.props;
    const { favourites } = this.state;
    const favouriteKeys = Object.keys(favourites);
    return (
      <React.Fragment>
        {/*<div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
          <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
              <Typography className="md:ml-24" variant="h4" color="inherit">

              </Typography>
            </FuseAnimate>
          </div>
          <div className="flex flex-1 items-center justify-center pr-8 sm:px-12">
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
              <Paper
                className="flex p-4 items-center w-full max-w-512 px-8 py-4"
                elevation={1}
              >

                <Input
                  placeholder="Search for anything"
                  className="flex flex-1"
                  disableUnderline
                  fullWidth
                  value={searchText}
                  inputProps={{
                    "aria-label": "Search"
                  }}
                  onChange={this.setSearchText}
                />
              </Paper>
            </FuseAnimate>
          </div>
        </div>*/}
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
                    <CustomizedButton size="small">
                      {displayData[favouriteKey]}
                    </CustomizedButton>
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

export default withStyles(styles)(ManagementTab);
