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
}) => {
  const role = isWarder == false ? 'prisoner' : 'warder';
  const oppoRole = isWarder == false ? 'warder' : 'prisoner';
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(prev => prev - 1), 1000);
  }, [timer]);

  return (
    <header className="row justify-content-between">
      <div className="col-4">
        <div className="d-flex align-items-center">
          <img
            alt="profile picture"
            src={myImg}
            className="img-fluid rounded-circle w-25"
            style={{ objectFit: 'fill', aspectRatio: '1' }}
          />
          <span className="h4 mb-0">{myName ?? 'poraor'}</span>
        </div>

        <h4>ROLE : {role}</h4>
        <h4>SCORE : {myScore}</h4>
      </div>
      <div className="col-4 text-center">
        <span className="display-3">{timer}</span>
        <h3 className="mb-0">turn </h3>
        {/* <p className="display-3">{round ?? 1}</p> */}
      </div>
      <div className="col-4 d-flex flex-column align-items-end">
        <div className=" d-flex align-items-center justify-content-end">
          <span className="h4 mb-0">{myName ?? 'poraor'}</span>
          <img
            alt="profile picture"
            src={oppoImg}
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
