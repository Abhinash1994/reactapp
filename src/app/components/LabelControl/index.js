import React, { Component } from "react";
import "./style.scss";
import classNames from "classnames";
export default class LabelControl extends Component {
  render() {
    return (
      <div className={classNames("label-control", this.props.classes)}>
        <div className="label">{this.props.label}</div>
        <div className="content">{this.props.children}</div>
      </div>
    );
  }
}
