class Timer {
  // calculates seconds, minutes, hours from provided seconds
  static calculateDisplay(seconds) {
    const secondsPer = {
      minute: 60,
      hour: 60 * 60,
      day: 60 * 60 * 24,
    }

    return {
      seconds: seconds % secondsPer['minute'],
      minutes: Math.floor(
        (seconds % secondsPer['hour']) / secondsPer['minute']
      ),
      hours: Math.floor((seconds % secondsPer['day']) / secondsPer['hour']),
    }
  }

  // init with DOM references
  constructor({ display, startStop, reset }) {
    this.defaultSecondsRemaining = 0 * 60 * 60 + 20 * 60 + 0

    this.state = {
      secondsRemaining: this.defaultSecondsRemaining,
      isRunning: false,
      timerId: null,
      input: [],
    }

    this.domElements = {
      display,
      reset,
      startStop,
    }

    this.registerEventHandlers()

    // initial render of display
    this.renderTimer()
  }

  registerEventHandlers() {
    this.domElements.startStop.addEventListener('click', () => this.startStop())
    this.domElements.reset.addEventListener('click', () => this.reset())

    const input = document.querySelector('input')

    input.addEventListener('keydown', (e) => {
      this.handleInputKeyDown(e)
    })
  }

  // allows for manual entry of time
  handleInputKeyDown(e) {
    e.preventDefault()

    const whiteListKeys = [...Array.from({ length: 10 }).keys()].map((num) =>
      String(num)
    )

    if (e.key === 'Enter') {
      this.handleInputSubmit()
    } else if (e.key === 'Backspace') {
      this.state.input.pop()
    } else if (whiteListKeys.includes(e.key)) {
      this.state.input.push(e.key)
    }

    // limit length
    if (this.state.input.length > 6) {
      this.state.input = this.state.input.slice(-6)
    }

    const copy = Object.assign([], this.state.input)

    const s = copy.splice(-2).join('')
    const m = copy.splice(-2).join('')
    const h = copy.splice(-2).join('')

    e.target.value = `${h || ''}H ${m || ''}M ${s || ''}S`
  }

  handleInputSubmit() {
    const getSecondsFromInput = (inputArray) => {
      const copy = Object.assign([], this.state.input)
      const seconds = copy.splice(-2).join('') * 1
      const minuteSeconds = copy.splice(-2).join('') * 60
      const hourSeconds = copy.splice(-2).join('') * 60 * 60

      return hourSeconds + minuteSeconds + seconds
    }

    this.state.secondsRemaining = getSecondsFromInput(this.state.input)

    // set running
    this.state.isRunning = true
    this.tick()
  }

  // update if isRunning and time remains, then schedule next update
  tick() {
    if (this.state.isRunning && this.state.secondsRemaining === 0) {
      this.complete()
      this.state.isRunning = false
    } else if (this.state.isRunning && this.state.secondsRemaining > 0) {
      this.timerId = setTimeout(() => {
        this.state.secondsRemaining -= 1
        this.tick()
      }, 1000)
    } else {
      clearTimeout(this.timerId)
    }

    this.renderTimer()
  }

  complete() {
    this.alarm(true)

    window.addEventListener('click', () => {
      this.alarm(false)
    })
  }

  alarm(isActive) {
    const alarmAudio = document.querySelector('audio')

    if (isActive) {
      alarmAudio.play()
      document.body.style.border = '1rem solid orangered'
    } else {
      alarmAudio.pause()
      alarmAudio.currentTime = 0
      document.body.style.border = 'initial'
    }
  }

  inputTime() {
    this.domElements.display.innerHTML =
      '<input type="text" value="0" autofocus>'
  }

  renderTimer() {
    const { seconds, minutes, hours } = Timer.calculateDisplay(
      this.state.secondsRemaining
    )

    const pad = (string) => String(string).padStart(2, '0')

    this.domElements.display.innerHTML = `
      ${pad(hours)}<small>H</small>${' '}
      ${pad(minutes)}<small>M</small>${' '}
      ${pad(seconds)}<small>S</small>
    `

    this.domElements.startStop.innerText = this.state.isRunning
      ? 'Pause'
      : 'Start'
  }

  startStop() {
    this.state.isRunning = !this.state.isRunning

    // reset timer if started after counting down
    if (this.state.secondsRemaining === 0) {
      this.state.secondsRemaining = this.defaultSecondsRemaining
    }

    this.tick()
  }

  reset() {
    this.state.isRunning = false
    this.state.secondsRemaining = this.defaultSecondsRemaining
    clearTimeout(this.timerId)
    this.renderTimer()
  }
}

globalThis.qs = document.querySelector.bind(document)

window.timer = new Timer({
  display: qs('.display'),
  startStop: qs('.startStop'),
  reset: qs('.reset'),
})
