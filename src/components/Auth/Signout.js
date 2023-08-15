import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { Button } from "react-bootstrap";

const Signout = () => {
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/signup");
    } catch (err) {
      console.error("Failed to log out: ", err.message);
    }
  };

  return (
    <div className="form-container">
      <div>
        <Button
          variant="secondary"
          onClick={logOut}
          // since you're doing a good amount of manual styling, one thing you could do is use some variables for that. Sort of like CSS but indirectly, I guess :)
          // You could either make a variable representing a whole object to pass into style, like this:
          // const buttonStyle = { fontSize: "15px" }
          // style = { buttonStyle }

          // or make size variables like this:
          // const regularButtonSize = "15px"
          // style = {{ fontSize: regularButtonSize }}

          // this is helpful because you can see all the values in one file and if you want to change the size of something, you can change it in one file instead of in several places. Also, once it's in place, if you want to make changes to your styling, you only have to make changes in that file -- so fewer merge conflicts!
          style={{ fontSize: "15px" }}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Signout;
