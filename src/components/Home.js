import React from "react";
import { AllEventsNew } from "./";

const Home = ({eventsData}) => {
  return (
    <div>
      <AllEventsNew eventsData={eventsData}/>
    </div>
  );
};

export default Home;
