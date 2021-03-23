import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getUserList, deleteUser } from "../actions/userActions";

import ActionModal from "../components/Modal";

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  const [show, setShow] = useState(false);
  const [userId,setUserId] = useState('');

  useEffect(() => {
    if (userInfo && userInfo.user.isAdmin) {
      dispatch(getUserList());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, successDelete, userInfo]);

  const deleteSelectedUser = () => {
      dispatch(deleteUser(userId));
      setUserId('');
      setShow(false);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>E-SHOP | Users</title>
        <meta name="description" content="Orders placed by customers" />
      </Helmet>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h1 style={{ textAlign: "center" }}>Users</h1>
          <div className="row">
            <div className="offset-md-1 col-md-11">
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
                              onClick={()=>{
                                setShow(true)
                                setUserId(user._id)
                              }}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </thead>
              </Table>
              <ActionModal
                show={show}
                setShow={setShow}
                heading="Delete User"
                text="Are you sure you want to delete this user ?"
                delete={deleteSelectedUser}
                btnText='Delete'
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserListScreen;
