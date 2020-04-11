import React, { Component } from "react";
import BudgetForm from "./common/budgetForm";

// component
class Edit extends Component {
  constructor() {
    super();

    // set initial state
    this.state = {
      item: {},
    };
  }

  componentWillMount() {
    // get data from localstorage
    const item = localStorage.getItem("item")
      ? JSON.parse(localStorage.getItem("item"))
      : null;
    // check item and if item id and params id does not match sent it to main page
    if (!item || this.props.match.params.id !== item._id) {
      // replace the route so that we dont have history for current route
      this.props.history.replace("/");
    }
    this.setState({
      item,
    });
  }

  render() {
    // use BudgetForm and send props to populate it
    return (
      <BudgetForm
        {...this.props}
        item={this.state.item}
        heading={"Edit Budget/Expenses"}
      />
    );
  }
}

export default Edit;
