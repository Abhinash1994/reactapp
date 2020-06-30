import React from "react";
import isEmpty from "app/helper/utils/isEmpty";

function BankDetailsBlock(props) {
  const { loading, value } = props.data;
  const totalBankBalance =
    !isEmpty(value) &&
    value.bankDetails.reduce(
      (a, b) => a + (parseInt(b["bankBalance"]) || 0),
      0
    );
  const totalBalance = !isEmpty(value) && value.cashOnHand + totalBankBalance;
  if (loading) return <div>Loading...</div>;
  return (
    <div className="bank-details-block">
      <div className="grid">
        <div className="grid__column">
          <span>Cash on Hand</span>
          <span>{value.cashOnHand}</span>
        </div>
        <div className="grid__column">
          <span>Bank Accounts</span>
          <span></span>
        </div>
        {!isEmpty(value) &&
          value.bankDetails.map((x, i) => (
            <div className="grid__column" key={i}>
              <span>{x.name}</span>
              <span>{x.bankBalance}</span>
            </div>
          ))}
        <div className="grid__column">
          <span>Total bank</span>
          <span>{totalBankBalance}</span>
        </div>
        <div className="grid__column total-footer">
          <span>Total</span>
          <span>{totalBalance}</span>
        </div>
      </div>
    </div>
  );
}

export default BankDetailsBlock;
