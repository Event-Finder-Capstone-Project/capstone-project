import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button,Container } from "react-bootstrap";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  setDoc,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

const UserDetails = ({ user }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [interests, setInterests] = useState("");

  // Load user data if it exists in Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setGender(userData.gender || "");
          setName(userData.name || "");
          setBio(userData.bio || "");
          setDateOfBirth(userData.dateOfBirth || "");
          setInterests(userData.interests || "");
        }
      }
    };

    // Fetch user data only once when the component mounts
    fetchUserData();
  }, []); // Empty dependency array to run only once

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a reference to the user document in Firestore based on the uid
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // If user document exists, update the existing document
        await updateDoc(userDocRef, {
          gender: gender,
          name: name,
          bio: bio,
          dateOfBirth: dateOfBirth,
          interests: interests,
        });
      } else {
        // If user document doesn't exist, create a new document
        await setDoc(userDocRef, {
          gender: gender,
          name: name,
          bio: bio,
          dateOfBirth: dateOfBirth,
          interests: interests,
        });
      }

      navigate("/user-profile");
    } catch (err) {
      console.error("Error adding/updating data:", err);
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5 vh-100">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">User Details</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="gender">
            <Form.Label>Gender:</Form.Label>
            <Form.Control
              as="select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="bio">
            <Form.Label>Bio/About Me:</Form.Label>
            <Form.Control
              as="textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </Form.Group>
          <Form.Group controlId="dateOfBirth">
            <Form.Label>Date of Birth:</Form.Label>
            <Form.Control
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="interests">
            <Form.Label>Interests:</Form.Label>
            <Form.Control
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="secondary" className="mt-3 w-100">Save</Button>
        </Form>
      </div>
    </Container>
  );
};

export default UserDetails;
