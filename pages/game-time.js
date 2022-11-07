/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Container } from 'reactstrap';
import Header from '../components/Header';
import { socket } from '../services/socket';

const GamePage = () => {
  const { user } = useSelector(state => state.user);
  const { opponent } = useSelector(state => state.user);
  const { currentRoom } = useSelector(state => state.room);
  const [isHost, setIsHost] = useState(false);
  const [isWarder, setIsWarder] = useState(false);
  const [isWarderTurn, setIsWarderTurn] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [alreadyWalk, setAlreadyWalk] = useState(false);
  const [matrix, setMatrix] = useState([
    [0, 0, 0, 0, 'h'],
    ['w', 1, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 1, 0, 'p'],
    [0, 0, 0, 0, 0],
  ]);
  const [timer, setTimer] = useState(10);
  const [goingCoor, setGoingCoor] = useState(null);

  useEffect(() => {
    user.name === currentRoom?.users.filter(user => !!user.isHost)[0].name &&
      setIsHost(true);

    socket.on('room:start-done', gameElement => {
      console.log(gameElement);
      setMatrix(gameElement.mapDetail.map);
      const myUser = gameElement.users.filter(
        currentUser => currentUser.name === user.name
      )[0];
      setIsWarder(myUser.isWarder);
    });

    socket.on('game:update-done', newCoor => {
      console.log(newCoor);
      setMatrix(newCoor.mapDetail.map);
      setAlreadyWalk(false);
      setIsWarderTurn(newCoor.isWarderTurn);
    });
  }, []);

  useEffect(() => {
    if (isHost) socket.emit('room:start', user.name, opponent.name);
  }, [isHost]);

  useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(prev => prev - 1), 1000);

    if (timer === 0) {
      if (isWarder === isWarderTurn) {
        console.log(goingCoor);
        socket.emit('game:update', goingCoor, isWarderTurn);
      }
    }
  }, [timer]);

  useEffect(() => {
    setTimer(10);
  }, [isWarderTurn]);

  const findPos = (array, symbol) => {
    const string = array.toString().replace(/,/g, '');
    const pos = string.indexOf(symbol);

    const d = (array[0] || []).length;

    const x = pos % d;
    const y = Math.floor(pos / d);

    return { y, x };
  };

  const highlightTile = coord => {
    const charCoor = isWarder ? findPos(matrix, 'w') : findPos(matrix, 'p');

    if (isWarder === isWarderTurn && !alreadyWalk && isHover) {
      if (
        matrix[coord.y][coord.x] !== 1 &&
        ((coord.y === charCoor.y + 1 && coord.x === charCoor.x) ||
          (coord.y === charCoor.y - 1 && coord.x === charCoor.x) ||
          (coord.y === charCoor.y && coord.x === charCoor.x + 1) ||
          (coord.y === charCoor.y && coord.x === charCoor.x - 1))
      ) {
        return `highlighted`;
      } else {
        return '';
      }
    }
  };

  const renderCharacter = character => {
    if (character === 'w') {
      return (
        <>
          <img
            src="/img/warder-icon.png"
            className="img-fluid"
            alt="Wanderder pic"
            style={{ height: '100%', objectFit: 'cover' }}
            onMouseEnter={() => isWarder && setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          />
        </>
      );
    } else if (character === 'p') {
      return (
        <>
          <img
            src="/img/prisoner-icon.png"
            className="img-fluid"
            alt="Prisoner pic"
            style={{ height: '100%', objectFit: 'cover' }}
            onMouseEnter={() => !isWarder && setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          />
        </>
      );
    } else if (character === 1) {
      return (
        <>
          <img
            src="/img/obstacle-icon.png"
            className="img-fluid"
            alt="Obstacle pic"
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </>
      );
    } else if (character === 'h') {
      return (
        <>
          <img
            src="/img/instruction-icon.jpg"
            className="img-fluid"
            alt="Obstacle pic"
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </>
      );
    }

    return <div className="free-space-tile"></div>;
  };

  const updateCurrentBoard = (rowIdx, columnIdx) => {
    const charCoor = isWarder ? findPos(matrix, 'w') : findPos(matrix, 'p');

    if (
      matrix[rowIdx][columnIdx] === 1 ||
      (!(rowIdx === charCoor.y + 1 && columnIdx === charCoor.x) &&
        !(rowIdx === charCoor.y - 1 && columnIdx === charCoor.x) &&
        !(rowIdx === charCoor.y && columnIdx === charCoor.x + 1) &&
        !(rowIdx === charCoor.y && columnIdx === charCoor.x - 1))
    )
      return;

    setGoingCoor([rowIdx, columnIdx]);
    setAlreadyWalk(true);

    setMatrix(prevBoard => {
      const newBoard = [...prevBoard];

      newBoard[charCoor.y] = [...newBoard[charCoor.y]];
      newBoard[charCoor.y][charCoor.x] = 0;
      newBoard[rowIdx][columnIdx] = isWarder ? 'w' : 'p';

      return newBoard;
    });
  };

  return (
    <Container className="mt--6" fluid>
      <Row className="justify-content-center mx-auto">
        <Col className="position-relative" md="10">
          <Card
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '3px solid white',
            }}
          >
            <Header
              myImg={user.avatarId}
              oppoImg={opponent.avatarId}
              isWarder={isWarder}
              myScore={user.score}
              oppoScore={opponent.score}
              timer={timer}
              isWarderTurn={isWarderTurn}
            />

            <Row className="justify-content-center mx-auto">
              <Col
                md="5"
                className="bg-white border border-1 border-dark"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8) !important',
                }}
              >
                {matrix.map((row, rowIdx) => {
                  return (
                    <Row key={rowIdx}>
                      {row.map((column, columnIdx) => {
                        return (
                          <Col
                            key={columnIdx}
                            className={`border border-1 border-dark game-tile px-0 ${highlightTile(
                              { x: columnIdx, y: rowIdx }
                            )}`}
                            onClick={() => {
                              if (isWarder === isWarderTurn && !alreadyWalk) {
                                updateCurrentBoard(rowIdx, columnIdx);
                              }
                            }}
                          >
                            {renderCharacter(column)}
                          </Col>
                        );
                      })}
                    </Row>
                  );
                })}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GamePage;
