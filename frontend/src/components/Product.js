import React from "react";
import Rating from "../components/Rating";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded" style={{ height: "25rem" }}>
      <Link to={`/product/${product._id}`}>
        <Card.Img variant="top" src={product.image} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
