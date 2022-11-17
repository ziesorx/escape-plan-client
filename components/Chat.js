import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';

const Chat = ({
  chatMessageLeft,
  chatMessageRight,
  displayLeft,
  displayRight,
}) => {
  return (
    <>
      {/* left box */}
      <Col
        id="chatBox"
        className="text-end"
        style={{ display: displayLeft ? 'block' : 'none' }}
      >
        <div class="talk-bubble-left tri-right round btm-left-in">
          <div class="talktext">{chatMessageLeft}</div>
        </div>
      </Col>
      {/* /right box */}
      <Col
        id="chatBox"
        className="text-end"
        style={{ display: displayRight ? 'block' : 'none' }}
      >
        <div class="talk-bubble-right tri-right round btm-right-in">
          <div class="talktext">{chatMessageRight}</div>
        </div>
      </Col>
    </>
  );
};

export default Chat;
