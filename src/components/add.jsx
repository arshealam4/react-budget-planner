import React, { Component } from "react";
import BudgetForm from "./common/budgetForm";

// component
class Add extends Component {
  render() {
    // use BudgetForm and send props to populate it
    return (
      <BudgetForm {...this.props} item={null} heading={"Add Budget/Expenses"} />
    );
  }
}

export default Add;
