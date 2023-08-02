import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import AllEvents from "./Events/AllEvents";

const Home = () => {
  return (
    <div>
      <AllEvents />
    </div>
  );
};

export default Home;
