import React, { Component } from 'react'
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
    PinterestIcon
  } from 'react-share';

  export default class ShareEvent extends Component {
    render() {
      const shareUrl = 'https://event-finder-test-56e2e.web.app/';
      return (
        <div
          style={{
            background: '#0000',
            height: '100vh',
            width: '100%',
          }}
        >
  
          <FacebookShareButton
            url={shareUrl}
            quote={'Title'}
          >
            <FacebookIcon size={35} round={true} />
          </FacebookShareButton>
  
          <WhatsappShareButton
            url={shareUrl}
            quote={'Title'}
            hashtag={'#portfolio...'}
          >
            <WhatsappIcon size={35} round={true} />
          </WhatsappShareButton>
          <RedditShareButton
            url={shareUrl}
            quote={'Title'}
            hashtag={'#portfolio...'}
          >
            <RedditIcon size={35} round={true} />
          </RedditShareButton>
          <TwitterShareButton
            url={shareUrl}
            quote={'Title'}
            hashtag={'#portfolio...'}
          >
            <TwitterIcon size={35} round={true} />
          </TwitterShareButton>
          <PinterestShareButton
            url={shareUrl}
            quote={'Title'}
            hashtag={'#portfolio...'}
          >
            <PinterestIcon size={35} round={true} />
          </PinterestShareButton>
          <EmailShareButton
            url={shareUrl}
            quote={'Title'}
            hashtag={'#portfolio...'}
          >
            <EmailIcon size={35} round={true} />
          </EmailShareButton>
        </div>
      );
    }
  }