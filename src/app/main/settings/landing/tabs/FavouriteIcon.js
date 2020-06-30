import React from "react";
import { IconButton } from "@material-ui/core";
import StarRateSharpIcon from "@material-ui/icons/StarRateSharp";

const FavouriteIcon = props => {
  const {
    passingProps: { handleFavourite, favourites, favouriteKey }
  } = props;
  return (
    <IconButton
      onClick={() =>
        handleFavourite({
          [favouriteKey]: !favourites[favouriteKey]
        })
      }
    >
      <StarRateSharpIcon
        color={favourites[favouriteKey] ? "secondary" : "primary"}
        fontSize={"large"}
      />
    </IconButton>
  );
};

export default FavouriteIcon;
