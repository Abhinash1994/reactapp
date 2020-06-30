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

const defaultState = {
  searchText: "",
  favourites: {},
  displayData: {},
}

class SalesTab extends Component {

  state = defaultState;

  componentDidMount () {
    const currentFavourites = this.loadFavourites()
    const displayData = {}
    const favourites = {}
    currentFavourites.forEach((cfv) => {
      favourites[cfv.key] = true
      displayData[cfv.key] = {title: cfv.title, routeKey: cfv.routeKey}
    })
    this.setState({favourites: {...this.state.favourites, ...favourites}, displayData})
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

    let currentFavourites = this.loadFavourites()
    currentFavourites = currentFavourites.filter(({key}) => key !== favouriteKey)
    localStorage.setItem('settings-favourites', JSON.stringify(currentFavourites))
  }

  setSearchText = event => {
    this.setState({searchText: event.target.value});
  };

  handleFavourite = data => {
    this.updateFavourites(data)
    const favouriteKey = Object.keys(data)[0]
    const newfavourites = {...this.state.favourites}
    delete newfavourites[favouriteKey]
    this.setState({favourites: newfavourites});
  };

  render () {
    const {classes} = this.props;
    const {favourites, displayData} = this.state;
    const favouriteKeys = Object.keys(favourites);
    return (
      <React.Fragment>
        {/*<div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
          <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
              <Typography className="md:ml-24" variant="h4" color="inherit">
                Business Report
              </Typography>
            </FuseAnimate>
          </div>
          <div className="flex flex-1 items-center justify-center pr-8 sm:px-12">
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
              <Paper
                className="flex p-4 items-center w-full max-w-512 px-8 py-4"
                elevation={1}
              >
                <Icon className="mr-8" color="action">
                  search
                </Icon>
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
          {favouriteKeys.map((favouriteKey, index) => {
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
                    <Link to={displayData[favouriteKey].routeKey}>
                      <CustomizedButton size="small">
                        {displayData[favouriteKey].title || ''}
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
