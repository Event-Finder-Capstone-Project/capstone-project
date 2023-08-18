import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Container, Col,} from "react-bootstrap";

const UserProfile = () => {
  // Using useState hook to store and manage user profile data
  const [userProfile, setUserProfile] = useState(null);

  // useEffect hook for performing side effects, in this case, fetching user data once the component mounts
  useEffect(() => {
    
    // Asynchronous function to fetch user data from Firestore based on their UID
    const fetchUserProfile = async () => {
      try {
        // Getting the currently authenticated user's UID
        const userId = auth.currentUser.uid;

        // Referencing the Firestore document based on user ID
        const docRef = doc(db, "users", userId);
        
        // Fetching the document snapshot for the given reference
        const docSnap = await getDoc(docRef);

        // Checking if the document exists and setting the user profile data
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        // Handling and logging errors in case fetching fails
        console.error("Error fetching user profile:", error);
      }
    };

    // Invoking the user profile fetching function
    fetchUserProfile();

  // Empty dependency array ensures that the effect runs only once, similar to componentDidMount lifecycle method
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