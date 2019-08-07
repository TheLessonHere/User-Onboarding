import React from 'react';
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from 'axios';

function UserForm({ values, errors, touched, isSubmitting }) {
    return (
      <Form>
        <div>
          {touched.name && errors.name && <p>{errors.name}</p>}
          <Field type="name" name="name" placeholder="Name" />
        </div>
        <div>
          {touched.email && errors.email && <p>{errors.email}</p>}
          <Field type="email" name="email" placeholder="Email" />
        </div>
        <div>
          {touched.password && errors.password && <p>{errors.password}</p>}
          <Field type="password" name="password" placeholder="Password" />
        </div>
        <label>
          <Field type="checkbox" name="tos" checked={values.tos} />
          Accept TOS
        </label>
        <button disabled={isSubmitting}>Submit</button>
      </Form>
    );
  }
  
  const FormikForm = withFormik({
    mapPropsToValues({ name, email, password, tos }) {
      return {
        name: name || "",
        email: email || "",
        password: password || "",
        tos: tos || false
      };
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(25, "Name cannot be longer than 25 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Email not valid")
        .required("Email is required"),
      password: Yup.string()
        .min(16, "Password must be 16 characters or longer")
        .required("Password is required"),
      tos: Yup.boolean()
        .required("Users must accept the terms of service")
    }),
    handleSubmit(values, { resetForm, setErrors, setSubmitting }) {
      if (values.email === "alreadytaken@atb.dev") {
        setErrors({ email: "That email is already taken" });
      } else {
        axios
          .post("https://reqres.in/api/users", values)
          .then(res => {
            console.log('Request successful', res);
            resetForm();
            setSubmitting(false);
          })
          .catch(err => {
            console.log('Request failed', err);
            setSubmitting(false);
          });
      }
    }
  })(UserForm);
  
  export default FormikForm;