/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Row, Col } from 'reactstrap';

const GamePage = () => {
  const [matrix, setMatrix] = useState([
    [0, 0, 0, 0, 0],
    ['w', 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 'p', 0],
    [0, 0, 0, 0, 0],
  ]);
  const [isWanderer, setIsWanderer] = useState(true);
  const [isHover, setIsHover] = useState(false);

  const findPos = (array, symbol) => {
    const string = array.toString().replace(/,/g, '');
    const pos = string.indexOf(symbol);

    const d = (array[0] || []).length;

    const x = pos % d;
    const y = Math.floor(pos / d);

    return { y, x };
  };

  const highlightTile = (coord) => {
    const charCoor = isWanderer ? findPos(matrix, 'w') : findPos(matrix, 'p');

    if (isHover) {
      if (
        (coord.y === charCoor.y + 1 && coord.x === charCoor.x) ||
        (coord.y === charCoor.y - 1 && coord.x === charCoor.x) ||
        (coord.y === charCoor.y && coord.x === charCoor.x + 1) ||
        (coord.y === charCoor.y && coord.x === charCoor.x - 1)
      ) {
        return `highlighted`;
      } else {
        return '';
      }
    }
  };

  const renderCharacter = (character) => {
    if (character === 'w') {
      return (
        <>
          <img
            src="/img/police-icon.png"
            className="img-fluid"
            alt="Wanderder pic"
            style={{ height: '100%', objectFit: 'cover' }}
            onMouseEnter={() => isWanderer && setIsHover(true)}
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
            onMouseEnter={() => !isWanderer && setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          />
        </>
      );
    }

    return <div className="free-space-tile"></div>;
  };

  return (
    <Container className="mt--6" fluid>
      <Row className="justify-content-center mx-auto">
        <Col
          md="5"
          className="bg-white border border-1 border-dark"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8) !important' }}
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
                        console.log(rowIdx, columnIdx);
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
    </Container>
  );
};

export default GamePage;
