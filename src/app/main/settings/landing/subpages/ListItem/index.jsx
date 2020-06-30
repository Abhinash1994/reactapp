import React, { Component } from 'react'
import { Icon } from '@material-ui/core';

export default class ListItem extends Component {
  state = {
    open: false
  }
  showSubItem = open => {
    this.setState({ open });
  }
  render() {
    const { listData, collapse } = this.props;
    const { open } = this.state;
    const getDifference = (debit, credit) => {
      return debit - credit < 0 ? `(${credit - debit})` : debit - credit;
    }
    return (
      <div className="list-item">
        <div className={`label${listData.children ? '' : ' line-bottom'}`} onClick={() => this.showSubItem(!open)}>
          <div className="title">{listData.isBold ? <strong>{listData.title}</strong> : listData.title}</div>
          {listData.children ?
            <>
              {!collapse && <div className="icon"><Icon>{`arrow_${open ? 'drop_down' : 'right'}`}</Icon></div>}
              {(!open && !collapse) ?
                listData.type === 100 || listData.type === 400 ?
                  <>
                    <div className="debit">{getDifference(listData.debit, listData.credit)}</div>
                    <div className="credit">-</div>
                  </>
                  :
                  <>
                    <div className="debit">-</div>
                    <div className="credit">{getDifference(listData.credit, listData.debit)}</div>
                  </> : null
              }
            </>
            : listData.type === 100 || listData.type === 400 ?
              <>
                <div className="debit">{getDifference(listData.debit, listData.credit)}</div>
                <div className="credit">-</div>
              </>
              :
              <>
                <div className="debit">-</div>
                <div className="credit">{getDifference(listData.credit, listData.debit)}</div>
              </>
          }

        </div>
        {listData.children && (collapse || open) &&
          <div className="sub-list">
            {listData.children.map((list, index) => (
              <ListItem key={index} listData={list}></ListItem>
            ))}
          </div>
        }
      </div>
    )
  }
}
