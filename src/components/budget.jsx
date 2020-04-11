import React, { Component } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { getBudgets, deleteBudget } from "../services/budgetService";

class Budget extends Component {
  // set initial state
  state = {
    budgets: {},
    isSubmit: false,
    msg: "",
  };
  componentDidMount() {
    this.getAll();
  }

  // get data from server and set state
  getAll = async () => {
    const { data } = await getBudgets();
    data.result[0].record.forEach((r) => {
      r.date = this.formatDate(r.date);
    });
    this.setState({
      budgets: data.result[0],
    });
  };

  // reset state
  resetAll() {
    setTimeout(() => {
      this.setState({
        isSubmit: false,
        msg: "",
      });
    }, 1500);
  }
  /* format date using moment
   moment is third party library to play with dates
  */
  formatDate = (d) => {
    const dd = moment(d).format("YYYY-MM-DD");
    return dd;
  };
  // set class
  getClass = (budget) => {
    let classes = "list-group-item d-flex justify-content-between ";
    return (classes +=
      budget.type === "budget" ? "text-success" : "text-danger");
  };

  deleteBudget = async (id) => {
    try {
      // delete budget or expenses and set state
      const result = await deleteBudget(id);
      this.setState({
        isSubmit: true,
      });
      if (result.data.status) {
        this.getAll();
        this.resetAll();
        this.setState({
          isSubmit: false,
          msg: result.data.msg || "Budget has been deleted successfully!",
        });
        toast.success(this.state.msg);
      } else {
        this.resetAll();
        this.setState({
          isSubmit: false,
          msg: result.data.msg || "There is some issue, Please try again!",
        });
        toast.error(this.state.msg);
      }
    } catch (err) {
      this.resetAll();
      this.setState({
        isSubmit: false,
        msg: err.msg || "internel server error!",
      });
      toast.error(this.state.msg);
    }
  };

  editPage = (item) => {
    // set item in local storage
    localStorage.setItem("item", JSON.stringify(item));
    // go to edit page
    this.props.history.push(`/edit/${item._id}`);
  };

  // set color
  getColor = (num) => {
    return num >= 0 ? "text-success" : "text-danger";
  };

  render() {
    const { budgets } = this.state;
    const items = budgets.record;
    return (
      <React.Fragment>
        <div className="shadow-none p-3 mb-5 bg-light rounded d-flex justify-content-between mt-2">
          <div>
            <p>Budget</p>
            <p className={this.getColor(budgets.totalBudget)}>
              {budgets.totalBudget}
            </p>
          </div>
          <div>
            <p>Balance</p>
            <p className={this.getColor(budgets.remainingBudget)}>
              {budgets.remainingBudget}
            </p>
          </div>
          <div>
            <p>Expenses</p>
            <p
              className={
                budgets.totalExpenses === 0 ? "text-success" : "text-danger"
              }
            >
              {budgets.totalExpenses}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => this.props.history.push("/add")}
          className="btn btn-primary m-2"
        >
          Add
        </button>

        <table className="table table-bordered">
          <thead>
            <tr className="text-center">
              <th scope="col">Purpose</th>
              <th scope="col">Amount</th>
              <th scope="col">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map((item) => (
                <tr key={item._id}>
                  <td>{item.purpose}</td>
                  <td
                    className={
                      item.type === "budget" ? "text-success" : "text-danger"
                    }
                  >
                    {item.amount}
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <button
                      onClick={() => this.editPage(item)}
                      type="button"
                      className="btn btn-outline-warning"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => this.deleteBudget(item._id)}
                      className="btn btn-outline-danger ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default Budget;
