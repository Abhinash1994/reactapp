import { Arrays, ArraysKey } from "app/helper/utils/getTextLabel";
import isEmpty from "app/helper/utils/isEmpty";
import React from "react";
import Select from "react-select";

const renderOptions = (props) => {
  const { options, isArray, isArrayKeys } = props;
  if (isArray) {
    if (!isEmpty(options)) {
      if (isArrayKeys) {
        return ArraysKey(options);
      }
      return Arrays(options);
    } else {
      return [];
    }
  } else {
    return options;
  }
};
export default function IntegrationReactSelect(props) {
  //const classes = useStyles();
  //const theme = useTheme();
  //   const [single, setSingle] = React.useState(null);
  //   const [multi, setMulti] = React.useState(null);
  //   function handleChangeSingle(value) {
  //     setSingle(value);
  //   }

  //   function handleChangeMulti(value) {
  //     setMulti(value);
  //   }

  // const selectStyles = {
  //   input: (base) => ({
  //     ...base,
  //     color: "#f2f2f2", //theme.palette.text.primary,
  //     "& input": {
  //       font: "inherit",
  //     },
  //   }),
  // };
  const {
    // multiple,
    // placeholder,
    onChange,
    name,
    value,
    // validators,
    // label,
    // width,
    loading,
    //loadingType,
    disabled,
    //isAbove,
    //error,
    classNames,
  } = props;
  // const load = !isEmpty(loading) ? loading : false;
  // if (load) {
  //   renderLoading(props);
  // }
  // console.log(props)

  return (
    <Select
      className={classNames}
      classNamePrefix="Project"
      //styles={selectStyles}
      isDisabled={disabled}
      isLoading={loading}
      value={value}
      isSearchable={true}
      name={name}
      options={renderOptions(props)}
      onChange={(value, action) => {
        onChange(action.name, value);
      }}
    />
  );
}
