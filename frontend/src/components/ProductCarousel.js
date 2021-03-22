import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Image, Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { getTopProducts } from "../actions/productActions";

const ProductCaraousel = () => {
  const dispatch = useDispatch();
  const productTop = useSelector((state) => state.productTop);
  const { error, loading, topProducts } = productTop;

  useEffect(() => {
    dispatch(getTopProducts());
  }, [dispatch]);

  return (
    <>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {!loading && !error && topProducts && (
        <Carousel pause="hover" className="bg-dark">
          {topProducts.map((product) => {
            return (
              <Carousel.Item key={product._id}>
                <Link to={`/product/${product._id}`}>
                  <Image src={product.image} alt={product.name} fluid />
                  <Carousel.Caption className="carousel-caption">
                    <h2>
                      {product.name} ({product.price})
                    </h2>
                  </Carousel.Caption>
                </Link>
              </Carousel.Item>
            );
          })}
        </Carousel>
      )}
    </>
  );
};

export default ProductCaraousel;
