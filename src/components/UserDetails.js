import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
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

      navigate("/");
    } catch (err) {
      console.error("Error adding/updating data:", err);
    }
  };

  return (
    <div>
      <h2>User Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>
        <div>
          <label>Bio/About Me:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div>
          <label>Interests:</label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserDetails;
