import { MenuItem } from "@material-ui/core";
import { CustomSelect } from "app/components/";
import utils from "app/helper/utils";
import isEmpty from "app/helper/utils/isEmpty";
import { getNewCustomer } from "app/store/actions/dashboard";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Variables from "variables";

function TotalSales(props) {
  const [dataType, setDateType] = useState("Today");
  const { dateTypes } = Variables;
  const dispatch = useDispatch();
  const changeDate = (event) => {
    let dateRange = utils.getDateRange(event.target.value);
    let data = {
      fromDate: isEmpty(dateRange.from)
        ? ""
        : moment(new Date(dateRange.from)).format("YYYY/MM/DD"),
      toDate: isEmpty(dateRange.to)
        ? ""
        : moment(new Date(dateRange.to)).format("YYYY/MM/DD"),
    };
    dispatch(getNewCustomer(data));
    setDateType(event.target.value);
  };
  const { loading, value } = props.data;
  if (loading) return <div>Loading...</div>;
  return (
    <div className="new-customer dashboard-block">
      <div className="dashboard-block__header flex items-center justify-between">
        <span className="header-title"> NEW CUSTOMER</span>
        <CustomSelect value={dataType || ""} onChange={changeDate}>
          {dateTypes.map((element, index) => {
            if (element !== "Custom"){
              return (
                <MenuItem value={element} key={index}>
                  {element}
                </MenuItem>
              );
            }
          })}
        </CustomSelect>
      </div>
      <div className="dashboard-block__body">
        <div className="body-row">
          <span className="total-sales">{value && value.totalCustomer}</span>
        </div>
        <div className="body-row">
          <span className="total-days">{dataType}</span>
        </div>
        <div className="body-row">
          <span className="chart">Line graph</span>
        </div>
      </div>
    </div>
  );
}

export default TotalSales;
