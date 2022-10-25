/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Card, Row, Col, Container } from 'reactstrap'
import Header from '../components/Header'
import { socket } from '../services/socket'

const GamePage = () => {
  const { user } = useSelector((state) => state.user)
  const [hCoor, setHCoor] = useState(null)
  const [pCoor, setPCoor] = useState(null)
  const [wCoor, setWCoor] = useState(null)
  const [isHost, setIsHost] = useState(null)
  const [isWarder, setIsWarder] = useState(null)
  const [isHover, setIsHover] = useState(false)
  const [matrix, setMatrix] = useState([
    [0, 0, 0, 0, 'h'],
    ['w', 1, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 1, 0, 'p'],
    [0, 0, 0, 0, 0],
  ])

  useEffect(() => {
    socket.emit('room:start')
  }, [])

  useEffect(() => {
    socket.on('room:start-done', (gameElement) => {
      console.log(gameElement)
      setMatrix(gameElement.mapDetail.map)
      setHCoor(gameElement.mapDetail.hCoor)
      setPCoor(gameElement.mapDetail.pCoor)
      setWCoor(gameElement.mapDetail.wCoor)
      const myUser = gameElement.users.filter(
        (currentUser) => currentUser.name == user.name
      )[0]

      setIsWarder(myUser.isWarder)
      setIsHost(myUser.role === 'host')
      console.log(myUser)
    })
  })
  const findPos = (array, symbol) => {
    const string = array.toString().replace(/,/g, '')
    const pos = string.indexOf(symbol)

    const d = (array[0] || []).length

    const x = pos % d
    const y = Math.floor(pos / d)

    return { y, x }
  }

  const highlightTile = (coord) => {
    const charCoor = isWarder ? findPos(matrix, 'w') : findPos(matrix, 'p')

    if (isHover) {
      if (
        matrix[coord.y][coord.x] !== 1 &&
        ((coord.y === charCoor.y + 1 && coord.x === charCoor.x) ||
          (coord.y === charCoor.y - 1 && coord.x === charCoor.x) ||
          (coord.y === charCoor.y && coord.x === charCoor.x + 1) ||
          (coord.y === charCoor.y && coord.x === charCoor.x - 1))
      ) {
        return `highlighted`
      } else {
        return ''
      }
    }
  }

  const renderCharacter = (character) => {
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
      )
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
      )
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
      )
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
      )
    }

    return <div className="free-space-tile"></div>
  }

  const updateBoard = (rowIdx, columnIdx) => {
    const charCoor = isWarder ? findPos(matrix, 'w') : findPos(matrix, 'p')

    if (
      matrix[rowIdx][columnIdx] === 1 ||
      (!(rowIdx === charCoor.y + 1 && columnIdx === charCoor.x) &&
        !(rowIdx === charCoor.y - 1 && columnIdx === charCoor.x) &&
        !(rowIdx === charCoor.y && columnIdx === charCoor.x + 1) &&
        !(rowIdx === charCoor.y && columnIdx === charCoor.x - 1))
    ) {
      return
    }

    setMatrix((prevBoard) => {
      const newBoard = [...prevBoard]

      newBoard[charCoor.y] = [...newBoard[charCoor.y]]
      newBoard[charCoor.y][charCoor.x] = 0
      newBoard[rowIdx][columnIdx] = isWarder ? 'w' : 'p'

      return newBoard
    })
  }

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
              myImg={'/img/Bluepackman.png'}
              oppoImg={'/img/Greenpackman.png'}
              isWarder={true}
              myScore={2}
              oppoScore={300}
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
                              updateBoard(rowIdx, columnIdx)
                            }}
                          >
                            {renderCharacter(column)}
                          </Col>
                        )
                      })}
                    </Row>
                  )
                })}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default GamePage
