import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from 'axios';

function UserForm({ values, errors, touched, isSubmitting, status }) {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (status) {
            setUsers(users => [...users, status])
        }
    }, [status]);

    return (
      <div className="container">
      <Form>
        <div>
          {touched.first_name && errors.first_name && <p>{errors.first_name}</p>}
          <Field type="text" name="first_name" placeholder="First Name" />
        </div>
        <div>
          {touched.last_name && errors.last_name && <p>{errors.last_name}</p>}
          <Field type="text" name="last_name" placeholder="Last Name" />
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
          I Accept the Terms of Service
        </label>
        <div>
        <button type="submit" disabled={isSubmitting}>Submit</button>
        </div>
      </Form>
      <div>
            <h1>Users:</h1>
            {users
                ? users.map(user => (
                    <p key={user.id}>
                    {user.first_name} {user.last_name}
                    </p>
                ))
            : null}
        </div>
      </div>
    );
  }
  
  const FormikForm = withFormik({
    mapPropsToValues({ first_name, last_name, email, password, tos }) {
      return {
        first_name: first_name || "",
        last_name: last_name || "",
        email: email || "",
        password: password || "",
        tos: tos || false
      };
    },
    validationSchema: Yup.object().shape({
      first_name: Yup.string()
        .min(2, "First Name must be at least 2 characters")
        .max(15, "First Name cannot be longer than 15 characters")
        .required("First Name is required"),
      last_name: Yup.string()
        .min(2, "Last Name must be at least 2 characters")
        .max(15, "Last Name cannot be longer than 15 characters")
        .required("Last Name is required"),
      email: Yup.string()
        .email("Email not valid")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be 16 characters or longer")
        .required("Password is required"),
      tos: Yup
        .boolean()
        .oneOf([true], "Users must accept the Terms of Service"),
    }),
    handleSubmit(values, { resetForm, setSubmitting, setStatus }) {
    axios
        .post("https://reqres.in/api/users", values)
        .then(res => {
        console.log('Request successful', res);
        setStatus(res.data);
        resetForm();
        setSubmitting(false);
        })
        .catch(err => {
        console.log('Request failed', err);
        setSubmitting(false);
        });
    }
  })(UserForm);
  
  export default FormikForm;