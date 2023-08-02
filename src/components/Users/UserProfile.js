import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

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
    <div className="container">
      <div>
      <h2 className="title">Welcome to Event Finder!</h2>
      </div>
      <div className="front-top-link">
        <div>
        <Link to='/home'>Home</Link>  
        </div>
        <div>
        <Link to="/user-details">Edit Profile</Link>
        </div>    
           </div>
     <div className="profile-view">
      {userProfile ? (
        <> 
        <h2 className="form-name">{userProfile.name}  Profile</h2>
          <p className="text-content"><strong>Name:</strong> {userProfile.name || "N/A"}</p>
          <p><strong>Email:</strong> {userProfile.email || "N/A"}</p>
          <p><strong>Gender:</strong> {userProfile.gender || "N/A"}</p>
          <p><strong>Bio/About Me:</strong> {userProfile.bio || "N/A"}</p>
            <p><strong>Date of Birth:</strong> {userProfile.dateOfBirth || "N/A"}</p>
            <p><strong>Interests:</strong> {userProfile.level || "N/A"}</p>     
        </>
      ) : (
        <p>Please set your <Link to='/user-profile'>Profile</Link> first!</p>
      )}
      </div>
      
    </div>
  );
  
};

export default UserProfile;