import React, { Component } from 'react'
import './style.scss'
export default class Clock extends Component {
  state = {
    time: "00:00:00",
    amPm: "am"
  }

  componentDidMount() {
    this.loadInterval = setInterval(
      this.getTime, 1000
    );
  }
  takeTwelve = n => n > 12 ? n - 12 : n;
  addZero = n => n < 10 ? "0" + n : n;
  getTime = () => {
    let d, h, m, s, t, amPm;

    d = new Date();
    h = this.addZero(this.takeTwelve(d.getHours()));
    m = this.addZero(d.getMinutes());
    s = this.addZero(d.getSeconds());
    t = `${h}:${m}:${s}`;

    amPm = d.getHours() >= 12 ? "pm" : "am";
    this.setState({
      time: t,
      amPm: amPm
    });
  }

  render() {
    return (
      <div className="outer">
          <div className="most-inner">
            <span className={
              this.state.time === "00:00:00"
                ? "time blink"
                : "time"}
            > {this.state.time}
            </span>
            <span className="amPm">
              {this.state.amPm}
            </span>
          </div>
      </div>
    );
  }
}