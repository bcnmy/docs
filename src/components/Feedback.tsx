// src/components/Feedback.js

import React, { useState } from 'react';
import {useLocation} from '@docusaurus/router';

const Feedback = () => {
  const location = useLocation();
  const [showYesCommentDiv, setShowYesCommentDiv] = useState(false);
  const [showNoCommentDiv, setShowNoCommentDiv] = useState(false);
  const handleFeedback = (isHelpful: boolean) => {
    // Implement logic to handle user feedback (e.g., send to analytics or API)
    console.log(`User feedback: ${isHelpful ? 'Helpful' : 'Not helpful'}`);
    if(isHelpful) {
      setShowYesCommentDiv(true);
      setShowNoCommentDiv(false);
    } else {
      setShowYesCommentDiv(false);
      setShowNoCommentDiv(true);
    }
    // You can customize this logic based on your needs
  };

  return (
    <div>
      <p>Was this page helpful?</p>
      <div className="flex justify-end gap-4">
      <label>
        <input
          type="radio"
          name="feedback"
          value="yes"
          checked={showYesCommentDiv === true}
          onChange={() => handleFeedback(true)}
        />
        Yes
      </label>
      <div className="gap-2"></div>
      <label>
        <input
          type="radio"
          name="feedback"
          value="no"
          checked={showNoCommentDiv === true}
          onChange={() => handleFeedback(false)}
        />
        No
      </label>
      </div>
      {/* <button onClick={() => handleFeedback(true)}>Yes</button>
      <button onClick={() => handleFeedback(false)}>No</button> */}
      
      {
         showYesCommentDiv && (
          <div>
          <p>Thanks!</p>
          </div>
          )
      }
      {
       
      showNoCommentDiv && (
        <div>
          <p>Thanks! Help us improve by leaving a comment:{'  '}
          <a
            href={`https://github.com/bcnmy/docs/issues/new?assignees=&amp;labels=documentation%2Cfeedback%2Ccommunity&amp;template=feedback.yml&amp;title=%5BFeedback%5D%20Page:%20${location.pathname}`}
            target="_blank"
            rel="noreferrer noopener"
          >Leave a comment
          </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Feedback;
