/* eslint-disable @next/next/no-img-element */
import Timer from './Timer';

const Header = ({ myImg, oppoImg, isWarder, myScore, oppoScore, round }) => {
  const role = isWarder == false ? 'prisoner' : 'warder';
  const oppoRole = isWarder == false ? 'warder' : 'prisoner';

  return (
    <header className="row justify-content-between">
      <div className="col-4">
        <div className="avatar">
          <img
            alt="profile picture"
            src={myImg}
            className="img-fluid rounded-circle w-100"
            style={{ objectFit: 'fill' }}
          />
        </div>
        <h4>ROLE : {role}</h4>
        <h4>SCORE : {myScore}</h4>
      </div>
      <div className="col-4 text-center">
        <span>
          <Timer />
        </span>
        <h3 className="mb-0">turn {round ?? 1}</h3>
        {/* <p className="display-3">{round ?? 1}</p> */}
      </div>
      <div className="col-4 text-end align-items-end d-flex flex-column">
        <div className="avatar">
          <img
            alt="profile picture"
            src={oppoImg}
            className="img-fluid rounded-circle w-100 justify-content-end"
            style={{ objectFit: 'fill' }}
          />
        </div>
        <h4>ROLE : {oppoRole}</h4>
        <h4>SCORE : {oppoScore}</h4>
      </div>
    </header>
  );
};

export default Header;
