import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { auth, db } from "../../firebase";
import { setDoc, doc, updateDoc, getDoc } from "firebase/firestore";

// Component for collecting and saving user details
const UserDetails = ({ user }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [interests, setInterests] = useState("");

    // Use effect hook to fetch user data from Firestore when component mounts
    useEffect(() => {
      const fetchUserData = async () => {
        if (user && user.uid) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
  
          // If the user data exists, populate the form fields
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
  
      // Invoke the fetchUserData function
      fetchUserData();
    }, []); // Empty dependency array to run only once
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        // Create a reference to the user document in Firestore based on the uid
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
  
        // Check if a user document already exists for the current user
        if (userDocSnapshot.exists()) {
          // If exists, update the document with the form data
          await updateDoc(userDocRef, {
            gender: gender,
            name: name,
            bio: bio,
            dateOfBirth: dateOfBirth,
            interests: interests,
          });
        } else {
          // If doesn't exist, create a new document with the form data
          await setDoc(userDocRef, {
            gender: gender,
            name: name,
            bio: bio,
            dateOfBirth: dateOfBirth,
            interests: interests,
          });
        }
  
        // Navigate to the user-profile route after saving details
        navigate("/user-profile");
      } catch (err) {
        console.error("Error adding/updating data:", err);
      }
    };
  
    // Render the form for user details
    return (
      <Container className="d-flex justify-content-center mt-5 vh-100">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h2 className="text-center mb-4">User Details</h2>
          <Form onSubmit={handleSubmit}>
            {/* Form fields are here */}
            <Button type="submit" variant="secondary" className="mt-3 w-100">
              Save
            </Button>
          </Form>
        </div>
      </Container>
    );
  };
  
  export default UserDetails;