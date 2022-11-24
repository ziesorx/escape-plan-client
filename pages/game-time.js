/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Router from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Card,
  Row,
  Col,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  Input,
  InputGroup,
} from 'reactstrap';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Chat from '../components/Chat';
import { socket } from '../services/socket';
import {
  clearCurrentGame,
  clearCurrentPlayer,
  clearCurrentRoom,
  setCurrentPlayer,
} from '../store/features/roomSlice';
import {
  clearOpponent,
  setOpponent,
  setUser,
} from '../store/features/userSlice';
import 'animate.css';
import { tutorials } from '../variables/tutorials';
import useSound from 'use-sound';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GamePage = () => {
  const { user } = useSelector(state => state.user);
  const { opponent } = useSelector(state => state.user);
  const { currentGame } = useSelector(state => state.room);
  const { currentPlayer } = useSelector(state => state.room);
  const [isWarder, setIsWarder] = useState(false);
  const [isWarderTurn, setIsWarderTurn] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [alreadyWalk, setAlreadyWalk] = useState(false);
  const [matrix, setMatrix] = useState(null);
  const [timer, setTimer] = useState(10);
  const [startCount, setStartCount] = useState(false);
  const [goingCoor, setGoingCoor] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessageLeft, setChatMessageLeft] = useState('');
  const [chatMessageRight, setChatMessageRight] = useState('');
  const [displayLeft, setDisplayLeft] = useState(false);
  const [displayRight, setDisplayRight] = useState(false);
  const [chatUserInfo, setChatUserInfo] = useState('');
  const [isWin, setIsWin] = useState(null);
  const dispatch = useDispatch();

  const [mute, setMute] = useState(false);
  const option = {
    volume: mute ? 0 : 0.6,
    soundEnabled: !mute,
  };
  const [playDefeat, { stop: stopDefeat }] = useSound(
    '/sounds/defeat.wav',
    option
  );
  const [playVictory, { stop: stopVictory }] = useSound(
    '/sounds/victory.wav',
    option
  );
  const [playWalk, { stop: stopWalk }] = useSound(
    '/sounds/walking.mp3',
    option
  );
  const [playChatsound, { stop: stopChatsound }] = useSound(
    '/sounds/chatsound.wav',
    { volume: mute ? 0 : 0.4, soundEnabled: !mute }
  );
  const inputRef = useRef(null);
  const [inputFocus, setInputFocus] = useState(false);

  const setWarder = gameElement => {
    console.log(gameElement);
    const myUser = gameElement.users.filter(
      currentUser => currentUser.name === user.name
    )[0];
    setIsWarder(myUser.isWarder);

    if (myUser.isWarder) setGoingCoor(gameElement.mapDetail.wCoor);
    else setGoingCoor(gameElement.mapDetail.pCoor);

    Swal.fire({
      title: `You are ${myUser.isWarder ? 'Warder' : 'Prisoner'}`,
      imageUrl: myUser.isWarder
        ? 'img/warder-icon.png'
        : 'img/prisoner-icon.png',
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: 'role image',
      showClass: {
        popup: 'animate__animated animate__fadeInLeft',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutRight',
      },
      showConfirmButton: false,
      timer: 2000,
      allowOutsideClick: false,
    }).then(result => {
      if (result.dismiss === Swal.DismissReason.timer) {
        setStartCount(true);
      }
    });
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
          setIsWin(null);
          setIsWarder(myUser.isWarder);
          setAlreadyWalk(false);
          setGoingCoor(null);
          setIsWarderTurn(true);
          setTimer(10);

          Swal.fire({
            title: `You are ${myUser.isWarder ? 'Warder' : 'Prisoner'}`,
            imageUrl: myUser.isWarder
              ? 'img/warder-icon.png'
              : 'img/prisoner-icon.png',
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'role image',
            showClass: {
              popup: 'animate__animated animate__fadeInLeft',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutRight',
            },
            showConfirmButton: false,
            timer: 2000,
            allowOutsideClick: false,
          }).then(result => {
            if (result.dismiss === Swal.DismissReason.timer)
              setStartCount(true);
          });
        }
      });

      socket.on('user:disconnect', roomDetails => {
        if (roomDetails.users.length < 2) {
          let timerInterval;
          Swal.fire({
            title: `Other player has left the room!`,
            html: 'Leaving the room in <strong></strong> seconds.',
            timer: 5300,
            timerProgressBar: true,
            showDenyButton: true,
            showConfirmButton: false,
            denyButtonText: `Leave room`,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();

              const b = Swal.getHtmlContainer().querySelector('strong');
              timerInterval = setInterval(() => {
                b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0);
              }, 100);
            },
          }).then(result => {
            if (
              result.isDenied ||
              result.dismiss === Swal.DismissReason.timer
            ) {
              dispatch(clearCurrentRoom());
              dispatch(clearCurrentPlayer());
              dispatch(clearCurrentGame());
              dispatch(clearOpponent());
              socket.emit('room:leave');
              Router.push('main-menu');
            }
          });
        }
      });
    });

    socket.on('game:update-done', newCoor => {
      console.log('update done');
      setMatrix(newCoor.mapDetail.map);
      setAlreadyWalk(false);
      setIsWarderTurn(newCoor.isWarderTurn);
    });

    socket.on('game:end-done', (gameElement, winnerUserInfo) => {
      setTimer(-1);
      setStartCount(false);
      const winUser = gameElement.users.filter(
        user => user.name === winnerUserInfo.name
      )[0];

      const { hCoor, wCoor, pCoor, map } = gameElement.mapDetail;
      const newBoard = JSON.parse(JSON.stringify(map));
      if (winUser.isWarder) {
        newBoard[wCoor[0]][wCoor[1]] = 0;
        newBoard[pCoor[0]][pCoor[1]] = 'ww';

        setMatrix(newBoard);
      } else {
        newBoard[pCoor[0]][pCoor[1]] = 0;
        newBoard[hCoor[0]][hCoor[1]] = 'pw';

        setMatrix(newBoard);
      }

      if (winnerUserInfo.name === user.name) dispatch(setUser(winnerUserInfo));
      else dispatch(setOpponent(winnerUserInfo));

      if (winUser.name === user.name) setIsWin(true);
      else setIsWin(false);

      if (user.isHost) {
        Swal.fire({
          title: `${winnerUserInfo.name} (${
            winUser.isWarder ? 'Warder' : 'Prisoner'
          }) win!`,
          text: `Waiting for host to start over...`,
          imageUrl: winUser.isWarder
            ? 'img/warder-win-pic.png'
            : 'img/prisoner-win-pic.png',
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: 'winner image',
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
            socket.emit('room:leave');
            Router.push('main-menu');
          }
        });
      } else {
        Swal.fire({
          title: `${winnerUserInfo.name} (${
            winUser.isWarder ? 'Warder' : 'Prisoner'
          }) win!`,
          text: `Waiting for host to start over...`,
          imageUrl: winUser.isWarder
            ? 'img/warder-win-pic.png'
            : 'img/prisoner-win-pic.png',
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: 'Custom image',
          showDenyButton: true,
          showConfirmButton: false,
          denyButtonText: `Leave room`,
          allowOutsideClick: false,
        }).then(result => {
          if (result.isDenied) {
            dispatch(clearCurrentRoom());
            dispatch(clearCurrentPlayer());
            dispatch(clearOpponent());
            socket.emit('room:leave');
            Router.push('main-menu');
          }
        });
      }
    });

    socket.on('room:leave-done', roomDetails => {
      dispatch(setCurrentPlayer(roomDetails.users.length));
      dispatch(clearOpponent());
      dispatch(setUser({ ...user, isHost: true }));
    });

    socket.on('game:reset-done', gameElement => {
      setTimer(-1);
      setStartCount(false);

      let timerInterval;
      Swal.fire({
        allowOutsideClick: false,
        title: 'Admin resetted the game!',
        html: 'New game will start in <strong></strong> seconds. <br></br>',
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

          Swal.fire({
            title: `You are ${myUser.isWarder ? 'Warder' : 'Prisoner'}`,
            imageUrl: myUser.isWarder
              ? 'img/warder-icon.png'
              : 'img/prisoner-icon.png',
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'role image',
            showClass: {
              popup: 'animate__animated animate__fadeInLeft',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutRight',
            },
            showConfirmButton: false,
            timer: 2000,
            allowOutsideClick: false,
          }).then(result => {
            if (result.dismiss === Swal.DismissReason.timer)
              setStartCount(true);
          });
        }
      });
    });

    socket.on('game:error', gameElement => {
      console.log(gameElement);
    });
  }, []);

  useEffect(() => {
    if (timer === -1) return;

    let timeout;

    if (startCount) {
      if (timer > 0)
        timeout = setTimeout(() => setTimer(prev => prev - 1), 1000);

      if (timer === 0) {
        if (isWarder === isWarderTurn) {
          socket.emit('game:update', goingCoor, isWarderTurn);
          return;
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [startCount, timer]);

  useEffect(() => {
    setTimer(10);
  }, [isWarderTurn]);

  useEffect(() => {
    if (isWin === null) return;

    if (isWin) playVictory();
    else playDefeat();
  }, [isWin]);

  useEffect(() => {
    if (mute) {
    }
  }, [mute]);

  useEffect(() => {
    let isCancelled = false;
    const messageChange = async () => {
      setTimeout(() => {
        socket.on('game:chat-done', (message, userInfo) => {
          console.log(message);
          setChatUserInfo(userInfo);

          if (user.name === userInfo.name) {
            setTimeout(() => {
              setChatMessageLeft(message);
              setDisplayLeft(true);
              playChatsound();
            }, 500);
            setTimeout(() => {
              setDisplayLeft(false);
              setChatMessageLeft('');
            }, 3000);
          }
          if (user.name != userInfo.name) {
            setTimeout(() => {
              setChatMessageRight(message);
              setDisplayRight(true);
              playChatsound();
            }, 500);
            setTimeout(() => {
              setDisplayRight(false);
              setChatMessageRight('');
            }, 3000);
          }
        });
      }, 1000);
    };
    messageChange();
  }, [message]);

  useOnKeyDown(
    useCallback(
      e => {
        if (e.key === 't' && !inputFocus) {
          e.preventDefault();
          setInputFocus(true);
        } else if (e.key === 'Escape') {
          setInputFocus(false);
        } else if (e.key === 'Enter') {
          if (message != '') sendMsg(message);
          inputBox.blur();
        }
      },
      [message, inputFocus]
    )
  );

  useEffect(() => {
    if (inputFocus) inputRef.current?.focus();
    else inputRef.current?.blur();
  }, [inputFocus]);

  useEffect(() => {
    if (currentPlayer === 1) {
      let timerInterval;
      Swal.fire({
        title: `Other player has left the room!`,
        html: 'Leaving the room in <strong></strong> seconds.',
        timer: 5300,
        timerProgressBar: true,
        showDenyButton: true,
        showConfirmButton: false,
        denyButtonText: `Leave room`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();

          const b = Swal.getHtmlContainer().querySelector('strong');
          timerInterval = setInterval(() => {
            b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0);
          }, 100);
        },
      }).then(result => {
        if (result.isDenied || result.dismiss === Swal.DismissReason.timer) {
          dispatch(clearCurrentRoom());
          dispatch(clearCurrentPlayer());
          dispatch(clearOpponent());
          socket.emit('room:leave');
          Router.push('main-menu');
        }
      });
    }
  }, [currentPlayer]);

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
        else if (
          isWarder &&
          coord.y === findPos(matrix, 'h').y &&
          coord.x === findPos(matrix, 'h').x
        )
          return 'danger-highlighted';

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
            src="/img/hole-icon.png"
            className="img-fluid"
            alt="Obstacle pic"
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </>
      );
    } else if (character === 'ww') {
      return (
        <>
          <img
            src="/img/warder-win-pic.png"
            className="img-fluid"
            alt="Obstacle pic"
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </>
      );
    } else if (character === 'pw') {
      return (
        <>
          <img
            src="/img/prisoner-win-pic.png"
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

    const newBoard = JSON.parse(JSON.stringify(matrix));

    if (
      isWarder &&
      rowIdx === findPos(matrix, 'p').y &&
      columnIdx === findPos(matrix, 'p').x
    ) {
      console.log('You win');
      socket.emit('game:end');
      return;
    } else if (
      !isWarder &&
      rowIdx === findPos(matrix, 'h').y &&
      columnIdx === findPos(matrix, 'h').x
    ) {
      console.log('You win');
      socket.emit('game:end');
      return;
    }

    newBoard[charCoor.y][charCoor.x] = 0;
    newBoard[rowIdx][columnIdx] = isWarder ? 'w' : 'p';

    socket.emit('game:update', [rowIdx, columnIdx], isWarderTurn);
    playWalk();

    setMatrix(newBoard);
  };

  const sendMsg = sendMessage => {
    socket.emit('game:chat', sendMessage);
    setMessage('');
  };

  // Tutorial Modal
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const slides = tutorials.map(tutorial => {
    return (
      <CarouselItem
        style={{ width: '412.5px', height: '540px' }}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={tutorial.id}
      >
        <img
          style={{
            objectFit: 'contain',
            width: '412.5px',
            height: '540px',
            opacity: 0.6,
          }}
          src={tutorial.src}
          alt={tutorial.text}
        />
        <CarouselCaption
          className="text-dark"
          captionHeader={tutorial.header}
          captionText={tutorial.text}
        />
      </CarouselItem>
    );
  });

  const next = () => {
    if (animating) return;

    if (activeIndex < 2) setActiveIndex(prev => prev + 1);
  };

  const previous = () => {
    if (animating) return;

    if (activeIndex > 0) setActiveIndex(prev => prev - 1);
  };

  const goToIndex = newIndex => {
    if (animating) return;

    if (newIndex < 2) setActiveIndex(newIndex);
  };

  const renderModal = () => {
    return (
      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(prev => !prev)}
        style={{ width: '412.5px', height: '540px' }}
      >
        <ModalHeader toggle={() => setShowModal(prev => !prev)}>
          Tutorial
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="rounded-bottom overflow-hidden">
            <Carousel
              dark
              activeIndex={activeIndex}
              next={next}
              previous={previous}
            >
              <CarouselIndicators
                items={tutorials}
                activeIndex={activeIndex}
                onClickHandler={goToIndex}
              />
              {slides}
              {activeIndex !== 0 && (
                <CarouselControl
                  direction="prev"
                  directionText="Previous"
                  onClickHandler={previous}
                />
              )}
              {activeIndex !== tutorials.length - 1 && (
                <CarouselControl
                  direction="next"
                  directionText="Next"
                  onClickHandler={next}
                />
              )}
            </Carousel>
          </div>
        </ModalBody>
      </Modal>
    );
  };

  const volumeOnOff = () => {
    setMute(prev => !prev);
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
                className="border border-1 border-dark"
                style={{
                  backgroundColor:
                    isWarder === isWarderTurn
                      ? 'rgba(255, 255, 255, 1)'
                      : 'rgba(0, 0, 0, 0.3)',
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
            <a className="mb-1 mx-2 position-absolute bottom-0 start-0">
              <FontAwesomeIcon
                icon={mute === false ? faVolumeUp : faVolumeMute}
                size="2x"
                onClick={volumeOnOff}
                className="icon"
              />
            </a>
            <Row
              className="mt-4 mb-2 justify-content-center"
              style={{ marginRight: '4rem', marginLeft: '4rem' }}
            >
              <Col className="d-flex text-center">
                <InputGroup size="sm">
                  <Input
                    maxLength={14}
                    innerRef={inputRef}
                    id="inputBox"
                    className="w-50"
                    placeholder="Press t to type message..."
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                    onClick={() => {
                      setInputFocus(true);
                      inputRef.current?.focus();
                    }}
                    onBlur={() => setInputFocus(false)}
                    autoComplete="off"
                  />
                  <Button
                    size="sm"
                    outline
                    color="secondary"
                    onClick={sendMsg}
                    disabled={message === '' ? true : false}
                  >
                    SEND
                  </Button>
                </InputGroup>
              </Col>
            </Row>
            <a
              className="instruction mb-1 mx-1 position-absolute bottom-0 end-0"
              onClick={() => setShowModal(prev => !prev)}
            >
              <img
                src="/img/instruction-icon.jpg"
                className="img-fluid rounded w-100"
              />
            </a>
            {renderModal()}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GamePage;

function useOnKeyDown(callback) {
  useEffect(() => {
    document.addEventListener('keydown', callback);
    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [callback]);
}
