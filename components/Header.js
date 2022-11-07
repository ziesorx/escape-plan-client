/* eslint-disable @next/next/no-img-element */
import { avatars } from '../variables/avatars';
import { Col, Row } from 'reactstrap';
import { useEffect, useState } from 'react';

const Header = ({
  myName,
  oppoName,
  myImg,
  oppoImg,
  isWarder,
  myScore,
  oppoScore,
  timer,
  isWarderTurn,
}) => {
  const role = isWarder == false ? 'prisoner' : 'warder';
  const oppoRole = isWarder == false ? 'warder' : 'prisoner';

  return (
    <header className="row justify-content-between">
      <div className="col-4">
        <div className="d-flex align-items-center">
          <img
            alt="profile picture"
            src={avatars.find(avatar => avatar.id === myImg)?.img_src}
            className="img-fluid rounded-circle w-25"
            style={{ objectFit: 'fill', aspectRatio: '1' }}
          />
          <span className="h4 mb-0">{myName ?? 'poraor'}</span>
        </div>

        <h4>ROLE : {role}</h4>
        <h4>SCORE : {myScore}</h4>
      </div>
      <div className="col-4 text-center">
        <span className="display-3">{timer === -1 ? 'Ended' : timer}</span>
        <h3 className="mb-0">{isWarderTurn ? 'Warder' : 'Prisoner'} turn</h3>
        {/* <p className="display-3">{round ?? 1}</p> */}
      </div>
      <div className="col-4 d-flex flex-column align-items-end">
        <div className=" d-flex align-items-center justify-content-end">
          <span className="h4 mb-0">{oppoName ?? 'poraor'}</span>
          <img
            alt="profile picture"
            src={avatars.find(avatar => avatar.id === oppoImg)?.img_src}
            className="img-fluid rounded-circle w-25"
            style={{ objectFit: 'fill', aspectRatio: '1' }}
          />
        </div>

        <h4>ROLE : {oppoRole}</h4>
        <h4>SCORE : {oppoScore}</h4>
      </div>
    </header>
  );
};

export default Header;
