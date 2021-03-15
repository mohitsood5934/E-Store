import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getUserList, deleteUser } from "../actions/userActions";
const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.user.isAdmin) {
      dispatch(getUserList());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, successDelete, userInfo]);

  const deleteSelectedUser = (id) => {
    if (window.confirm("Are you sure ?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tbody>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
              {users &&
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber}</td>
                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                    <td>
                      {/* <LinkContainer to={`/admin/user/${user._id}`}>
                        <Button variant="light" className="btn-sm">
                          <i className="fas fa-edit"></i>
                        </Button>
                      </LinkContainer> */}
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteSelectedUser(user._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </thead>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
