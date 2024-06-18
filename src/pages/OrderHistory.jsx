import React, { useEffect } from "react";
import { useGlobalContext } from "../store/context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const { adminButton } = useGlobalContext();
  const navigate = useNavigate();
  const [orderHistory, setOrderHistory] = useState([]);
  const [date, setDate] = useState(null);

  if (adminButton) {
    return navigate("/");
  }

  const token = localStorage.getItem("token");
  if (!token) return;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchUserOrderHistory = async (req, res) => {
    try {
      const response = await axios.get(
        `https://food-point-backend-api-s.onrender.com/api/v1/order/get-user-order-history`,
        { headers }
      );

      if (response.data.success) {
        setOrderHistory(response.data.cartItem);
        // UTC date string
        const utcDateTimeString = response.data.createdAt;

        // Parse UTC date string into Date object
        const utcDate = new Date(utcDateTimeString);

        // Adjust for Indian Standard Time (IST) offset (+5:30)
        const istOffset = 5.5 * 60 * 60 * 1000; // Convert 5 hours and 30 minutes to milliseconds
        const istDate = new Date(utcDate.getTime() + istOffset);

        // Function to pad numbers with leading zeros (for formatting)
        const pad = (num) => {
          return num.toString().padStart(2, "0");
        };

        // Get IST date components
        const istYear = istDate.getUTCFullYear();
        const istMonth = pad(istDate.getUTCMonth() + 1); // Months are zero-indexed
        const istDay = pad(istDate.getUTCDate());
        const istHours = pad(istDate.getUTCHours());
        const istMinutes = pad(istDate.getUTCMinutes());

        // Format the date in DD-MM-YYYY format (Indian format)
        const indianDateFormat = `${istDay}-${istMonth}-${istYear}`;
        setDate(indianDateFormat);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUserOrderHistory();
  }, []);

  return (
    <Container className="mb-4">
      <Row>
        <h2>Orders' History</h2>
        {orderHistory.length > 0 ? (
          orderHistory?.map((ele) => {
            return (
              <Col
                key={ele._id}
                xs={12}
                md={6}
                lg={4}
                className="justify-content-center"
              >
                <Card className="my-2 h-100">
                  <Card.Img
                    variant="top"
                    src={ele.imgURL}
                    width={50}
                    height={200}
                    alt="Picture"
                  />
                  <Card.Body>
                    <Card.Title>{ele.name}</Card.Title>
                    <Card.Text>{ele.description}</Card.Text>
                    <p>Quantity : {ele.qty}</p>
                    <h6>Price : ₹{ele.price}</h6>
                    <p>Order Date : {date} </p>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <h4 className="text-danger">No Order History</h4>
        )}
      </Row>
    </Container>
  );
};

export default OrderHistory;
