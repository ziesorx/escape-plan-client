/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Router from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Container } from 'reactstrap';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Chat from '../components/Chat';
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
  const { currentGame } = useSelector(state => state.room);
  const [isWarder, setIsWarder] = useState(false);
  const [isWarderTurn, setIsWarderTurn] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [alreadyWalk, setAlreadyWalk] = useState(false);
  const [matrix, setMatrix] = useState(null);
  const [timer, setTimer] = useState(10);
  const [goingCoor, setGoingCoor] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessageLeft, setChatMessageLeft] = useState('');
  const [chatMessageRight, setChatMessageRight] = useState('');
  const [displayLeft, setDisplayLeft] = useState(false);
  const [displayRight, setDisplayRight] = useState(false);
  const [chatUserInfo, setChatUserInfo] = useState('');
  const dispatch = useDispatch();

  const setWarder = gameElement => {
    console.log(gameElement);
    const myUser = gameElement.users.filter(
      currentUser => currentUser.name === user.name
    )[0];
    setIsWarder(myUser.isWarder);
  };

  useEffect(() => {
    setMatrix(currentGame.mapDetail.map);
    setWarder(currentGame);

    socket.on('room:play-again-done', gameElement => {
      let timerInterval;
      Swal.fire({
        allowOutsideClick: false,
        title: 'NEW GAME IS STARTING!',
        html: 'Game will start in <strong></strong> seconds. <br></br>',
        timer: 5300,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getHtmlContainer().querySelector('strong');
          timerInterval = setInterval(() => {
            b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0);
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then(result => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log(gameElement);
          setMatrix(gameElement.mapDetail.map);
          const myUser = gameElement.users.filter(
            currentUser => currentUser.name === user.name
          )[0];
          setIsWarder(myUser.isWarder);
          setAlreadyWalk(false);
          setGoingCoor(null);
          setIsWarderTurn(true);
          setTimer(10);
        }
      });
    });

    socket.on('game:update-done', newCoor => {
      console.log(newCoor);
      setMatrix(newCoor.mapDetail.map);
      setAlreadyWalk(false);
      setIsWarderTurn(newCoor.isWarderTurn);
    });

    socket.on('game:end-done', (gameElement, winnerUserInfo) => {
      setTimer(-1);
      console.log(winnerUserInfo);
      const winUser = gameElement.users.filter(
        user => user.name === winnerUserInfo.name
      )[0];

      if (winnerUserInfo.name === user.name) dispatch(setUser(winnerUserInfo));
      else dispatch(setOpponent(winnerUserInfo));

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
          if (result.isConfirmed) {
            socket.emit('room:play-again', winUser.name);
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
          if (result.isDenied) {
            dispatch(clearCurrentRoom());
            dispatch(clearCurrentPlayer());
            dispatch(clearOpponent());
            Router.push('main-menu');
          }
        });
    });
  }, []);

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

  useEffect(() => {
    let isCancelled = false;
    const messageChange = async () => {
      setTimeout(() => {
        if (!isCancelled) {
          socket.on('game:chat-done', (message, userInfo) => {
            console.log(message);
            setChatUserInfo(userInfo);
            if (user.name === userInfo.name) {
              setTimeout(() => {
                setDisplayLeft(true);
              }, 500);
              setTimeout(() => {
                setDisplayLeft(false);
              }, 3000);
              setChatMessageLeft(message);
            }
            if (user.name != userInfo.name) {
              setTimeout(() => {
                setDisplayRight(true);
              }, 500);
              setTimeout(() => {
                setDisplayRight(false);
              }, 3000);
              setChatMessageRight(message);
            }
          });
        }
      }, 1000);
    };
    messageChange();
    return () => {
      isCancelled = true;
    };
  }, [message]);

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
      }

      newBoard[charCoor.y] = [...newBoard[charCoor.y]];
      newBoard[charCoor.y][charCoor.x] = 0;
      newBoard[rowIdx][columnIdx] = isWarder ? 'w' : 'p';

      return newBoard;
    });
  };

  const sendMsg = () => {
    socket.emit('game:chat', message);
    console.log(message);
    setMessage('');
  };

  if (!matrix) return;

  return (
    <Container className="mt--6" fluid>
      <Row className="justify-content-center mx-auto">
        <Col className="position-relative" md="10">
          <Chat
            chatMessageLeft={chatMessageLeft}
            chatMessageRight={chatMessageRight}
            displayLeft={displayLeft}
            displayRight={displayRight}
          ></Chat>
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
            <Row className="justify-content-center">
              <Col className="text-center">
                <input
                  className="mt-4"
                  bsSize="lg"
                  placeholder="Enter the text..."
                  onChange={e => setMessage(e.target.value)}
                  value={message}
                />
                <button
                  class="btn btn-outline-secondary"
                  onClick={sendMsg}
                  type="button"
                  id="button-addon2"
                  disabled={message === '' ? true : false}
                >
                  SEND
                </button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GamePage;
