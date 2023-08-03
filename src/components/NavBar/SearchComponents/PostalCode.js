import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Toastify from 'toastify-js'
import { setPostalCode } from "../../../store/locationSlice";

const PostalCode = () => {

    const dispatch = useDispatch();
    const postalCode = useSelector((state) => state.location.postalCode);
    const [inputPostalCode, setInputPostalCode] = useState(postalCode);
  
      const handlePostalCodeSubmit = (e) => {
        e.preventDefault();
        const isValidZip = /(^\d{5}$)/;
        if (!isValidZip.test(inputPostalCode)) {
          Toastify({
            text: "Please input a valid 5-digit zip code!",
            duration: 2000,
            close: true,
            gravity: "top", 
            position: "center",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
        } else {
          dispatch(setPostalCode(inputPostalCode));
        }
      };

    return (
        <>
        <form onSubmit={handlePostalCodeSubmit}>
        <input
          type="text"
          value={inputPostalCode}
          onChange={(e) => setInputPostalCode(e.target.value)}
          placeholder="Enter Zip Code"
        />
        <button type="submit">Submit</button>
      </form>
      </>
      );
    }

export default PostalCode;