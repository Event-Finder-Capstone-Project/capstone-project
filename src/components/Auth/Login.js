import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      navigate("/");
    } catch (err) {
      setError("Failed to log in: " + err.message);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError("Failed to sign in with Google: " + err.message);
    }
  };

  return (
    <Container
      fluid="lg"
      style={{ paddingTop: "3rem" }}
      className="d-flex justify-content-center"
    >
      <Card className="form-width" style={{ width: "30rem" }}>
        <Card.Body>
          <h2 className="form-name">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group id="email" style={{ paddingTop: ".25rem" }}>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group
              id="password"
              style={{ paddingBottom: "2rem", paddingTop: ".25rem" }}
            >
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button
              variant="secondary"
              onClick={handleEmailLogin}
              disabled={loading}
              className="w-100 mb-3"
              type="submit"
            >
              Log In with Email
            </Button>
            <Button
              variant="secondary"
              onClick={handleGoogleLogin}
              className="w-100 mb-3"
              type="button"
            >
              Log In with Google
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
