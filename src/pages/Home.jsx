import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "../components/Card-Component";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CarouselComponent from "../utils/CarouselComponent";
import Spinner from "react-bootstrap/Spinner";

const Home = () => {
  const [foodData, setFoodData] = useState([]);
  const [copyFoodData, setCopyFoodData] = useState([]);
  const [stateChange, setStateChange] = useState(false);
  const [filteredData, setFilteredData] = useState("");

  const fetchFoodData = async () => {
    try {
      const response = await axios.get(
        "https://food-point-backend-api-s.onrender.com/api/v1/food/get-all-food-items"
      );
      setFoodData(response?.data?.data);
      setCopyFoodData(response?.data?.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchFoodData();
  }, [stateChange]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleSearchChange = (e) => {
    setFilteredData(e.target.value);
    const data = foodData?.filter((ele) =>
      ele.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    if (e.target.value == "") {
      setFoodData(copyFoodData);
    } else {
      setFoodData(data);
    }
  };

  return (
    <>
      <CarouselComponent />
      <Container>
        <div className="container my-2 my-md-4">
          {foodData.length <= 0 &&    <div className="d-flex mb-2 justify-content-center align-items-center"><Spinner animation="border" variant="info" size={"md"} /></div>}
          <Form className="d-flex" onSubmit={handleSearchSubmit}>
            <Form.Control
              type="search"
              placeholder="Search Food Item"
              className="me-2"
              aria-label="Search"
              value={filteredData}
              onChange={(e) => handleSearchChange(e)}
            />
          </Form>
        </div>
        <Row className="py-2">
          {foodData ? (
            foodData.map((ele) => {
              return (
                <Col
                  key={ele._id}
                  xs={12}
                  md={6}
                  lg={4}
                  className="justify-content-center my-2"
                >
                  <CardComponent setStateChange={setStateChange} {...ele} />
                </Col>
              );
            })
          ) : (
            <Col xs={12}>
              <h2>No Item Available</h2>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Home;
