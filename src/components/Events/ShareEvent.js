import React from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TwitterShareButton,
  EmailShareButton,
  WhatsappIcon,
  FacebookIcon,
  EmailIcon,
  RedditIcon,
  TwitterIcon,
} from "react-share";
import { Container } from "react-bootstrap";

const ShareEvent = (props) => {
  const baseUrl = "https://event-finder-test-56e2e.web.app/";
  const shareUrl = `${baseUrl}event/${props.eventId}`;

  return (
    <Container
      style={{
        background: "#0000",
        height: "100vh",
        width: "100%",
        marginTop: "2.3rem",
      }}
    >
      <h5 style={{ paddingLeft: "3.8rem" }}>Share This Event </h5>
      <FacebookShareButton
        style={{ marginLeft: "-.7rem", marginRight: "1rem" }}
        url={shareUrl}
        quote={"Title"}
      >
        <FacebookIcon size={35} round={true} />
      </FacebookShareButton>
      <WhatsappShareButton
          style={{ marginRight: "1rem" }}
          url={shareUrl}
          quote={"Title"}
          hashtag={"#portfolio..."}
        >
          <WhatsappIcon size={35} round={true} />
        </WhatsappShareButton>
        <RedditShareButton
          style={{ marginRight: "1rem" }}
          url={shareUrl}
          quote={"Title"}
          hashtag={"#portfolio..."}
        >
          <RedditIcon size={35} round={true} />
        </RedditShareButton>
        <TwitterShareButton
          style={{ marginRight: "1rem" }}
          url={shareUrl}
          quote={"Title"}
          hashtag={"#portfolio..."}
        >
          <TwitterIcon size={35} round={true} />
        </TwitterShareButton>
        <EmailShareButton
          url={shareUrl}
          quote={"Title"}
          hashtag={"#portfolio..."}
        >
          <EmailIcon size={35} round={true} />
        </EmailShareButton>
      </Container>
    );
  }
  export default ShareEvent;