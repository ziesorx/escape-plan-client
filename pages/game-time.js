/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { WrappedBuildError } from 'next/dist/server/base-server';
import { Router } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Container } from 'reactstrap';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import { socket } from '../services/socket';
import {
  clearCurrentPlayer,
  clearCurrentRoom,
} from '../store/features/roomSlice';
import {
  clearOpponent,
  setOpponent,
  setUser,
} from '../store/features/userSlice';

const GamePage = () => {
  const { user } = useSelector(state => state.user);
  const { opponent } = useSelector(state => state.user);
  const { currentRoom } = useSelector(state => state.room);
  const [isHost, setIsHost] = useState(false);
  const [isWarder, setIsWarder] = useState(false);
  const [isWarderTurn, setIsWarderTurn] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [alreadyWalk, setAlreadyWalk] = useState(false);
  const [matrix, setMatrix] = useState(null);
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

    socket.on('game:end-done', (gameElement, winnerUserInfo) => {
      setTimer(-1);
      const myUser = gameElement.users.filter(
        currentUser => currentUser.name === user.name
      )[0];
      const winUser = gameElement.users.filter(
        user => user.name === winnerUserInfo.name
      )[0];

      if (user.isHost)
        Swal.fire({
          title: `${winnerUserInfo.name} (${
            winUser.isWarder ? 'Warder' : 'Prisoner'
          }) win!`,
          text: `Waiting for host to start over...`,
          showDenyButton: true,
          confirmButtonText: 'Play again?',
          denyButtonText: `Leave room`,
          allowOutsideClick: false,
        }).then(result => {
          if (winnerUserInfo.name === user.name) setUser(winnerUserInfo);
          else setOpponent(winnerUserInfo);

          if (result.isConfirmed) {
            Swal.fire('kuay wai gorn');
          } else if (result.isDenied) {
            dispatch(clearCurrentRoom());
            dispatch(clearCurrentPlayer());
            dispatch(clearOpponent());
            Router.push('main-menu');
          }
        });
      else
        Swal.fire({
          title: `${winnerUserInfo.name} (${
            winUser.isWarder ? 'Warder' : 'Prisoner'
          }) win!`,
          text: `Waiting for host to start over...`,
          showDenyButton: true,
          showConfirmButton: false,
          denyButtonText: `Leave room`,
          allowOutsideClick: false,
        }).then(result => {
          if (winnerUserInfo.name === user.name) setUser(winnerUserInfo);
          else setOpponent(winnerUserInfo);

          if (result.isConfirmed) {
            // socket.emit('game:play-again')
            Swal.fire('kuay wai gorn');
          } else if (result.isDenied) {
            dispatch(clearCurrentRoom());
            dispatch(clearCurrentPlayer());
            dispatch(clearOpponent());
            Router.push('main-menu');
          }
        });
    });
  }, []);

  useEffect(() => {
    if (isHost) socket.emit('room:start', user.name, opponent.name);
  }, [isHost]);

  useEffect(() => {
    if (timer === -1) return;

    let timeout;

    if (timer > 0) timeout = setTimeout(() => setTimer(prev => prev - 1), 1000);

    if (timer === 0) {
      if (isWarder === isWarderTurn) {
        console.log(goingCoor);
        socket.emit('game:update', goingCoor, isWarderTurn);
      }
    }

    return () => clearTimeout(timeout);
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
        if (
          !isWarder &&
          coord.y === findPos(matrix, 'w').y &&
          coord.x === findPos(matrix, 'w').x
        )
          return 'danger-highlighted';
        else if (
          isWarder &&
          coord.y === findPos(matrix, 'p').y &&
          coord.x === findPos(matrix, 'p').x
        )
          return 'success-highlighted';

        return 'highlighted';
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
      !isWarder &&
      rowIdx === findPos(matrix, 'w').y &&
      columnIdx === findPos(matrix, 'w').x
    ) {
      return;
    } else if (
      isWarder &&
      rowIdx === findPos(matrix, 'h').y &&
      columnIdx === findPos(matrix, 'h').x
    ) {
      return;
    }

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

      if (
        isWarder &&
        rowIdx === findPos(matrix, 'p').y &&
        columnIdx === findPos(matrix, 'p').x
      ) {
        socket.emit('game:end');
      } else if (
        !isWarder &&
        rowIdx === findPos(matrix, 'h').y &&
        columnIdx === findPos(matrix, 'h').x
      ) {
        socket.emit('game:end');
        return;
      }

      newBoard[charCoor.y] = [...newBoard[charCoor.y]];
      newBoard[charCoor.y][charCoor.x] = 0;
      newBoard[rowIdx][columnIdx] = isWarder ? 'w' : 'p';

      return newBoard;
    });
  };

  if (!matrix) return;

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
              myName={user.name}
              oppoName={opponent.name}
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
