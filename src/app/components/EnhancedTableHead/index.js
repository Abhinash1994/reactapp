import React from "react";
import PropTypes from "prop-types";
import {
  Tooltip,
  TableSortLabel,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import "./style.scss";
class EnhancedTableHead extends React.Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead className="table-header">
        <TableRow className="table-header__row">
          {this.props.rows.map((row) => {
            return (
              <TableCell
                className="header-th"
                key={row.id}
                align="left"
                style={row.width ? { width: row.width } : {}}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  rows: PropTypes.array.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default EnhancedTableHead;
