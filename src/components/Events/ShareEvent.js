import React, { Component } from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TwitterShareButton,
  EmailShareButton,
  PinterestShareButton,
  WhatsappIcon,
  FacebookIcon,
  EmailIcon,
  RedditIcon,
  TwitterIcon,
  PinterestIcon,
} from "react-share";
import { Container } from "react-bootstrap";

export default class ShareEvent extends Component {
  render() {
    const shareUrl = "https://event-finder-test-56e2e.web.app/";
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
        <PinterestShareButton
          style={{ marginRight: "1rem" }}
          url={shareUrl}
          quote={"Title"}
          hashtag={"#portfolio..."}
        >
          <PinterestIcon size={35} round={true} />
        </PinterestShareButton>
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
}
