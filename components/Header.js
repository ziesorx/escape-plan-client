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
        <h6>ROLE :{role}</h6>
        <h6>SCORE : {myScore}</h6>
      </div>
      <div className="col-4 text-center">
        <h6>
          <Timer />
        </h6>
        <h6>turn</h6>
        <p className="display-3">{round ?? 1}</p>
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
        <h6>ROLE :{oppoRole}</h6>
        <h6>SCORE : {oppoScore}</h6>
      </div>
    </header>
  );
};

export default Header;
