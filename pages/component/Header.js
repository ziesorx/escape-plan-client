import Timer from './Timer'

const Header = ({ myImg, oppoImg, isPrisoner, myScore, oppoScore, round }) => {
  const role = isPrisoner == true ? 'prisoner' : 'warder'
  const oppoRole = isPrisoner == true ? 'warder' : 'prisoner'

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
        <h6>ROUND : {round}</h6>
      </div>
      <div className="col-4">
        <div className="avatar">
          <img
            alt="profile picture"
            src={oppoImg}
            className="img-fluid rounded-circle w-100"
            style={{ objectFit: 'fill' }}
          />
        </div>
        <h6>ROLE :{oppoRole}</h6>
        <h6>SCORE : {oppoScore}</h6>
      </div>
    </header>
  )
}

export default Header
