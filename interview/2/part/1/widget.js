class MouseTrackerObservable {
  observers = []

  constructor() {
    window.addEventListener("mousemove", (e) => {
      this.observers.forEach((observer) =>
        observer.handleEvent({ x: e.clientX, y: e.clientY })
      )
    })
  }

  addEventListener(observer) {
    this.observers.push(observer)
  }
}

// delay operator modifying the wrapper observable
// Basically get in between the observer and the observable to modify behaviour
// Similar to the HOC component pattern of augmenting the behaviour or dependencies of a wrapped component
const delayOperator = (observable) => ({
  // re-implement the observable interface
  addEventListener: (observer) => {
    // pass on the intercepted message to the original observableObservable
    observable.addEventListener({
      // re-implement the (console|visual)Observer `handleEvent` interface
      handleEvent({ x, y }) {
        // !👇 MEDDLE WITH THE BEHAVIOUR
        window.setTimeout(() => {
          // ! ☝️  MEDDLE WITH THE BEHAVIOUR
          // pass on the intercepted message to the original observer
          observer.handleEvent({ x, y })
        }, 1000)
      },
    })
  },
})

const consoleObserver = {
  handleEvent({ x, y }) {
    console.log({ x, y })
  },
}

const pointer = document.createElement("div")
pointer.style.cssText = `height: 25px; width: 25px; background-color: #bbb; border-radius: 50%; position: absolute;`
document.body.appendChild(pointer)

const visualObserver = {
  handleEvent({ x, y }) {
    pointer.style.transform = `translate(${x}px, ${y}px)`
  },
}

const mouseTrackerObservable = new MouseTrackerObservable()
delayOperator(mouseTrackerObservable).addEventListener(consoleObserver)
delayOperator(mouseTrackerObservable).addEventListener(visualObserver)

// Code snippet provided

// const consoleObserver = {
//   handleEvent({ x, y }) {
//     console.log({ x, y });
//   }
// }

// const pointer = document.createElement('div');
// pointer.style.cssText = `height: 25px; width: 25px; background-color: #bbb; border-radius: 50%; position: absolute;`;
// document.body.appendChild(pointer)

// const visualObserver = {
//   handleEvent({ x, y }) {
//     pointer.style.transform = `translate(${x}px, ${y}px)`;
//   }
// }

// mouseTracker.addEventListener(consoleObserver);
// mouseTracker.addEventListener(visualObserver);

// Question 1
// Implement the mouseTracker observable so that the observers handleEvent's will be called on mouse move

// Question 2
// Implement a `delay` observable `operator` which will delay the it's observers handleEvents from firing
