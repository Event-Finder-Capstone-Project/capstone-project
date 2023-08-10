import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Function to fetch user data from Firestore based on UID
    const fetchUserProfile = async () => {
      try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap.data());
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

    return (
      <Container className="d-flex flex-column align-items-center mt-5 vh-100">
        <h2 className="title mb-4 text-center">Welcome to Event Finder!</h2>    
        <div className="profile-view">
          {userProfile ? (
            <>
              <h3 className="form-name mb-3">{userProfile.name} Profile</h3>
              <p className="text-content"><strong>Name:</strong> {userProfile.name || "N/A"}</p>
              <p><strong>Email:</strong> {userProfile.email || "N/A"}</p>
              <p><strong>Gender:</strong> {userProfile.gender || "N/A"}</p>
              <p><strong>Bio/About Me:</strong> {userProfile.bio || "N/A"}</p>
              <p><strong>Date of Birth:</strong> {userProfile.dateOfBirth || "N/A"}</p>
              <p><strong>Interests:</strong> {userProfile.interests || "N/A"}</p>
            </>
          ) : (
            <p className="mt-4">Please set your <Link to='/user-profile' className="btn btn-primary">Profile</Link> first!</p>
          )}
          <Col >
              <Link to="/user-details" className="btn btn-secondary mt-3" style={{ width: '300px' }}>Edit Profile</Link>
             </Col>
        </div>
      </Container>
    );
  
};

export default UserProfile;