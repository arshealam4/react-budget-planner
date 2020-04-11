import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { saveBudget } from "../../services/budgetService";
import * as Yup from "yup";
import moment from "moment";

// general form for add/edit operation related to budget and expenses
class BudgetForm extends Component {
  // set initial state
  state = {
    isSubmit: false,
    msg: "",
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
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

  getInitialValues = (item) => {
    let schemaData = {};
    // populate data in form if we already have values
    if (item && item !== null) {
      schemaData = {
        amount: item.amount ? item.amount : "",
        type: item.type ? item.type : "expenses",
        date: item.date ? item.date : moment().format("YYYY-MM-DD"),
        purpose: item.purpose ? item.purpose : "",
        description: item.description ? item.description : "",
        _id: item._id ? item._id : "",
      };
    } else {
      // set initial values, if we dont have values to populate
      schemaData = {
        amount: "",
        type: "expenses",
        date: moment().format("YYYY-MM-DD"), // set today date by default
        purpose: "",
        description: "",
      };
    }

    return schemaData;
  };

  render() {
    // create schema to validate form data
    const BudgetSchema = Yup.object().shape({
      amount: Yup.number().required().positive().integer(),
      date: Yup.date().default(function () {
        return moment().format("YYYY-MM-DD"); // set today date by default
      }),
      type: Yup.string().required(),
      purpose: Yup.string().required(),
      description: Yup.string(),
      _id: Yup.string(),
    });

    const { item, heading } = this.props;
    const { startDate, endDate } = this.state;

    return (
      // Formik is third party library to generate and validate forms input.
      <div>
        <Formik
          // assign intial values
          initialValues={this.getInitialValues(item)}
          // validate form data with schema
          validationSchema={BudgetSchema}
          onSubmit={async (values, { resetForm }) => {
            this.setState({
              isSubmit: true,
            });

            try {
              let result = await saveBudget(values);
              if (result.data.status) {
                this.setState({
                  isSubmit: false,
                  msg: result.data.msg || "Budget has been done successfully!",
                });
                toast.success(this.state.msg);
                this.resetAll();
                resetForm();
                this.props.history.push("/");
              } else {
                this.setState({
                  isSubmit: false,
                  msg:
                    result.data.msg || "There is some issue, Please try again!",
                });
                this.resetAll();
                toast.error(this.state.msg);
              }
            } catch (err) {
              this.setState({
                isSubmit: false,
                msg: err.msg || "internel server error!",
              });
              this.resetAll();
              toast.error(this.state.msg);
            }
          }}
        >
          {({ errors, touched }) => (
            <div className="container">
              <h2>{heading}</h2>
              <Form>
                <div className="form-group">
                  <label className="control-label col-sm-4">Amount</label>
                  <div className="col-sm-8">
                    <Field
                      className="form-control"
                      name="amount"
                      type="number"
                    />
                    {errors.amount && touched.amount ? (
                      <div className="text-danger">{errors.amount}</div>
                    ) : null}
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-sm-4">Type</label>
                  <div className="col-sm-8">
                    <Field
                      className="form-control"
                      component="select"
                      name="type"
                    >
                      <option value="expenses">Expenses</option>
                      <option value="budget">Budget</option>
                    </Field>
                    {errors.type && touched.type ? (
                      <div className="text-danger">{errors.type}</div>
                    ) : null}
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-sm-4">Date</label>
                  <div className="col-sm-8">
                    {/* calender will enable only for current month */}
                    <Field
                      className="form-control"
                      name="date"
                      type="date"
                      min={startDate}
                      max={endDate}
                    />
                    {errors.date && touched.date ? (
                      <div className="text-danger">{errors.date}</div>
                    ) : null}
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-sm-4">Purpose</label>
                  <div className="col-sm-8">
                    <Field
                      className="form-control"
                      name="purpose"
                      type="text"
                    />
                    {errors.purpose && touched.purpose ? (
                      <div className="text-danger">{errors.purpose}</div>
                    ) : null}
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-sm-4">Description</label>
                  <div className="col-sm-8">
                    <Field
                      className="form-control"
                      name="description"
                      type="text"
                    />
                    {errors.description && touched.description ? (
                      <div className="text-danger">{errors.description}</div>
                    ) : null}
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-sm-offset-2 col-sm-10">
                    <button
                      className="btn btn-success"
                      type="submit"
                      disabled={this.state.isSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-sm-offset-2 col-sm-10">
                    <button className="btn btn-default" type="button">
                      <Link to={"/"}>Home</Link>
                    </button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    );
  }
}

export default BudgetForm;
