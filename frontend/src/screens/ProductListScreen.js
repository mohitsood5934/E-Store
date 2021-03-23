import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { productCreateReducer } from "../reducers/productReducers";
import ActionModal from "../components/Modal";

const ProductListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDeleteProduct,
    error: productDeleteError,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreateProduct,
    error: productCreateError,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const [productId, setProductId] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (userInfo && !userInfo.user.isAdmin) {
      history.push("/login");
    }
    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts());
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
  ]);

  const deleteSelectedProduct = () => {
    dispatch(deleteProduct(productId));
    setProductId("");
    setShow(false);
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
    <Helmet>
        <meta charSet="utf-8" />
        <title>E-SHOP | Products</title>
        <meta name="description" content="Products available in E-Shop" />
      </Helmet>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i>Create Product
          </Button>
        </Col>
      </Row>
      {loadingDeleteProduct && <Loader />}
      {loadingCreateProduct && <Loader />}
      {productDeleteError && (
        <Message variant="danger">{productDeleteError}</Message>
      )}
      {productCreateError && (
        <Message variant="danger">{productCreateError}</Message>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Actions</th>
                </tr>
                {products &&
                  products.map((product, index) => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>{[product.price]}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                        <LinkContainer
                          to={`/admin/product/${product._id}/edit`}
                        >
                          <Button variant="light" className="btn-sm">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </LinkContainer>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => {
                            setShow(true);
                            setProductId(product._id);
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
            heading="Delete Product"
            text="Are you sure you want to delete this product ?"
            delete={deleteSelectedProduct}
            btnText="Delete"
          />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
