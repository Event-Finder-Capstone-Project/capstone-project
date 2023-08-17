import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider,db } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup ,updateProfile,GoogleAuthProvider} from "firebase/auth";
import { doc, setDoc,getDoc } from "firebase/firestore";
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
    const googleProvider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, googleProvider);

    // You can customize the behavior after successful login here
    console.log("Successfully signed in with Google:", user);

    // If you want to check if the user is new or existing and perform additional actions, you can do so here
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      const name = user.displayName || "No Name";

      // Update the user's profile with their name (regardless of whether it's a new user)
      await updateProfile(user, { displayName: name });

      // Add the user's data to the "users" collection in Firestore
      const userData = {
        id: user.uid,
        name: name,
        email: user.email,
      };
      // Use setDoc to explicitly specify the document ID (user's uid) in the "users" collection
      await setDoc(doc(db, "users", user.uid), userData);
      navigate("/user-details");
    } else {
      // User is existing, perform any necessary actions for existing users
      console.log("Existing user, performing login...");
      navigate("/");
    }   
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
          <h2 className="form-name title mb-4 text-center">Log In</h2>
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
