import { MenuItem } from "@material-ui/core";
import { CustomSelect } from "app/components/";
import utils from "app/helper/utils";
import isEmpty from "app/helper/utils/isEmpty";
import { getTotalProfitLoss } from "app/store/actions/dashboard";
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
    dispatch(getTotalProfitLoss(data));
    setDateType(event.target.value);
  };
  const { loading, value } = props.data;
  if (loading) return <div>Loading...</div>;
  return (
    <div className="profit-loss dashboard-block">
      <div className="dashboard-block__header flex items-center justify-between">
        <span className="header-title">PROFIT AND LOSS</span>
        <CustomSelect  value={dataType || ""} onChange={changeDate}>
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
          <span className="total-sales">{value && value.totalProfitLoss}</span>
        </div>
        <div className="body-row">
          <span className="total-days">
            Net income for {dataType.toLowerCase()}
          </span>
        </div>
        <div className="body-row">
          <span className="chart">Line graph</span>
        </div>
      </div>
    </div>
  );
}

export default TotalSales;
