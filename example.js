

userInfo {
  name: 'string',
  score: Number,
  avatarId: Number
}

roomDetails {
  id: Number,
  users: [
    {...userInfo, isHost: boolean},
    {...userInfo, isHost: boolean}
  ]
}

gameElement {
  mapDetail: {
    map: [],
    hCoor: [],
    pCoor: [],
    wCoor: []
  },
  status: 'playing | end',
  users: [
    {name: 'string', isWarder: boolean},
    {name: 'string', isWarder: boolean}
  ]
}

updateCoor {
  isWarderTurn: boolean,
  mapDetail: {
    map: [],
    hCoor: [],
    pCoor: [],
    wCoor: []
  }
}