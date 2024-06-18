import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../store/context";
import { toast } from 'react-toastify';

const Address = () => {
  const [data, setData] = useState({
    fullName: "",
    phone: "",
    pinCode: "",
    city: "",
    state: "",
    address: "",
  });
  const [freeze, setFreeze] = useState(false);
  const navigate = useNavigate();
  const { adminButton } = useGlobalContext();

  if (adminButton) {
    return navigate("/");
  }

  const token = localStorage.getItem("token");

  if (!token) return;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchUserAddress = async () => {
    const response = await axios.get(
      `https://food-point-backend-api-s.onrender.com/api/v1/address/user-address`,
      { headers }
    );

    if (response.data.success) {
      setData({
        address: response.data.userAddressDetail.address,
        pinCode: response.data.userAddressDetail.pinCode,
        city: response.data.userAddressDetail.city,
        state: response.data.userAddressDetail.state,
        phone: response.data.userAddressDetail.phone,
        fullName: response.data.userAddressDetail.fullName,
      });
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    if (
      !data.fullName ||
      !data.phone ||
      !data.pinCode ||
      !data.city ||
      !data.state ||
      !data.address
    ) {
      return toast.error("All fields are required");
    }

    try {
      setFreeze(true); // Disable the button
      const response = await axios.post(
        "https://food-point-backend-api-s.onrender.com/api/v1/address/address",
        {
          fullName: data.fullName,
          phone: data.phone,
          pinCode: data.pinCode,
          city: data.city,
          state: data.state,
          address: data.address,
        },
        { headers }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      // console.error("Error:", error);
      toast.error(error.response.data.message);
    } finally {
      setFreeze(false); // Enable the button
    }
  };

  return (
    <Container>
      <Row className="pb-md-3 justify-content-between">
        <h2>Address Details</h2>
        <Col sm={12} md={5} className="d-none d-md-block">
          <img
            src="https://plus.unsplash.com/premium_photo-1682310158823-917a4f726802?q=80&w=1512&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Picture"
            className="w-100 h-auto object-fit-cover"
          />
        </Col>

        <Col sm={12} md={5}>
          <Form onSubmit={handleSubmit}>
            <div className="d-flex flex-md-row flex-column gap-1 justify-content-md-between align-content-md-center">
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Full Name"
                  required
                  value={data.fullName}
                  onChange={(e) =>
                    setData({ ...data, fullName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
                  required
                  value={data.city}
                  onChange={(e) => setData({ ...data, city: e.target.value })}
                />
              </Form.Group>
            </div>

            <div className="d-flex flex-md-row flex-column gap-1 justify-content-md-between align-content-md-center">
              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Phone Number"
                  required
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPinCode">
                <Form.Label>Pin Code</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Pin Code"
                  required
                  value={data.pinCode}
                  onChange={(e) =>
                    setData({ ...data, pinCode: e.target.value })
                  }
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Address"
                required
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter State"
                required
                value={data.state}
                onChange={(e) => setData({ ...data, state: e.target.value })}
              />
            </Form.Group>
            <button className="btn btn-outline-info my-2" disabled={freeze}>
              {freeze ? "Loading..." : "Proceed To Pay"}
            </button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Address;
