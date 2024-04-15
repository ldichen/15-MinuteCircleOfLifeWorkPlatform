import gsap from 'gsap'

const positionEnum = {
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
  CENTER: 'center'
}

export default class PositionHelper {
  constructor() {
    this.positions = []
  }
  add(id, defaultType) {
    const item = {
      id,
      type: defaultType
    }
    this.positions.push(item)
  }
  change(id, type) {
    const index = this.positions.findIndex((item) => item.id === id)
    if (index !== -1) {
      if (type === this.positions[index].type) {
        return
      }
      this.positions[index].type = type
    } else {
      this.add(id, type)
    }
    this.execute({ id, type })
  }
  execute(position) {
    const { id, type } = position
    const allvh = window.innerHeight
    const allvw = window.innerWidth
    if (type === positionEnum.LEFT) {
      let x = ((allvw / 100) * 25 + 8) * -1
      gsap.to(`#${id}`, {
        x: `${x}px`,
        y: 0,
        height: 'calc(100vh - 128px)',
        width: '25vw',
        duration: 0.6
      })
    } else if (type === positionEnum.CENTER) {
      gsap.to(`#${id}`, {
        x: '0',
        y: '0',
        height: 'calc(100vh - 150px)',
        width: 'calc(50vw - 32px)',
        duration: 0.6
      })
    } else if (type === positionEnum.RIGHT) {
      let x = (allvw / 100) * 50 - 24
      gsap.to(`#${id}`, {
        x: `${x}px`,
        y: 0,
        height: 'calc(100vh - 128px)',
        width: '25vw',
        duration: 0.6
      })
    } else if (type === positionEnum.BOTTOM) {
      let y = (allvh / 100) * 50 - 4
      gsap.to(`#${id}`, {
        x: '0',
        y: `${y}px`,
        width: 'calc(50vw - 32px)',
        height: `calc(100vh - ${y + 150}px)`,
        duration: 0.6
      })
    }
  }
  getType(id) {
    return (this.positions.find((item) => item.id === id) || {}).type
  }
  static enterLeftAction(id, delay = 0) {
    gsap.fromTo(
      `#${id}`,
      { transform: 'translateX(calc(-25vw - 8px))' },
      {
        transform: 'translateX(0)',
        duration: 0.6,
        delay: delay
      }
    )
    return (delay += 0.15)
  }
  static enterLeftActions(ids, delay = 0) {
    ids.forEach((element) => {
      delay = this.enterLeftAction(element, delay)
    })
    return delay
  }
  static enterRightAction(id, delay = 0) {
    gsap.fromTo(
      `#${id}`,
      { transform: 'translateX(calc(25vw + 8px))' },
      {
        transform: 'translateX(0)',
        duration: 0.6,
        delay: delay
      }
    )
    return (delay += 0.15)
  }
  static enterRightActions(ids, delay = 0) {
    ids.forEach((element) => {
      delay = this.enterRightAction(element, delay)
    })
    return delay
  }
  static enterUpAction(id, delay = 0) {
    gsap.fromTo(
      `#${id}`,
      { y: '120%' },
      {
        y: '0%',
        duration: 0.6,
        delay: delay
      }
    )
    return (delay += 0.15)
  }

  static leaveLeftAction(id, delay = 0) {
    gsap.fromTo(
      `#${id}`,
      { transform: 'translateX(0)' },
      {
        transform: 'translateX(calc(-25vw - 15px))',
        duration: 0.6,
        delay: delay
      }
    )
    return (delay += 0.15)
  }
  static leaveLeftActions(ids, delay = 0) {
    ids.forEach((element) => {
      delay = this.leaveLeftAction(element, delay)
    })
    return delay
  }
  static leaveRightAction(id, delay = 0) {
    gsap.fromTo(
      `#${id}`,
      { transform: 'translateX(0)' },
      {
        transform: 'translateX(calc(35vw + 15px))',
        duration: 0.6,
        delay: delay
      }
    )
    return (delay += 0.15)
  }
  static leaveRightActions(ids, delay = 0) {
    ids.forEach((element) => {
      delay = this.leaveRightAction(element, delay)
    })
    return delay
  }
  static leaveUpActions(ids, delay = 0) {
    ids.forEach((element) => {
      delay = this.leaveUpAction(element, delay)
    })
    return delay
  }
  static leaveUpAction(id, delay = 0) {
    gsap.fromTo(
      `#${id}`,
      { y: '0%' },
      {
        y: '-200%',
        duration: 0.6,
        delay: delay
      }
    )
    return (delay += 0.15)
  }
}
