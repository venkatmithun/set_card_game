import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { createDeck, checkSet, setDifficulty, drawMore } from "./gameSlice";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { attempCounts: 0, errorCounts: 0 };
    this.selectedCards = [];
  }

  // display card on gameboard
  displayCards = (activeCards = [], difficulty = 0) => {
    let gameboard = document.getElementById("gameboard");
    gameboard.innerHTML = "";
    let cardDiv;
    let imageDiv;
    for (let i = 0; i < activeCards.length; i++) {
      cardDiv = document.createElement("div");
      cardDiv.id = activeCards[i].id;
      cardDiv.className = "card th";
      gameboard.appendChild(cardDiv);

      for (let j = 0; j < activeCards[i].attr.number; j++) {
        imageDiv = document.createElement("div");
        let shade = "";
        if (difficulty > 0) {
          shade = activeCards[i].attr.shade + "-";
        }
        imageDiv.className =
          "cardImage " +
          shade +
          activeCards[i].attr.shape +
          " " +
          activeCards[i].attr.color +
          "Card"; // producing class names that describe the card image
        cardDiv.appendChild(imageDiv);
      }
    }
    this.activateCards();
  };

  // display hint solutions with ready SETs
  showSolutions = (clear = false, solutions = [], difficulty = 0) => {
    let solutionsDiv = document.getElementById("solutions");
    if (clear) {
      solutionsDiv.innerHTML = "";
    }
    let title = document.createElement("h1");
    title.innerHTML = "Solutions";
    solutionsDiv.appendChild(title);
    for (let solution in solutions) {
      let set = document.createElement("div");
      set.className = "set";
      let cardDiv;
      let imageDiv;
      solutionsDiv.appendChild(set);

      for (let i = 0; i < solutions[solution].length; i++) {
        cardDiv = document.createElement("div");
        cardDiv.className = "cardSolution";
        set.appendChild(cardDiv);

        for (let j = 0; j < solutions[solution][i].attr.number; j++) {
          imageDiv = document.createElement("div");
          let shade = "";
          if (difficulty > 0) {
            shade = solutions[solution][i].attr.shade + "-";
          }
          imageDiv.className =
            "cardImage " +
            shade +
            solutions[solution][i].attr.shape +
            " " +
            solutions[solution][i].attr.color +
            "Card"; // producing class names that describe the card image
          cardDiv.appendChild(imageDiv);
        }
      }
    }
  };

  addEventListeners = () => {
    // new game session
    document.getElementById("reset").addEventListener("click", () => {
      this.props.setDifficulty(this.props.difficulty);
      this.setState({ attempCounts: 0, errorCounts: 0 });
      let solutionsDiv = document.getElementById("solutions");
      solutionsDiv.innerHTML = "";
      this.cleanSelect(this.selectedCards);
      this.selectedCards = [];
      this.props.createDeck({
        displayCards: this.displayCards,
        showSolutions: this.showSolutions,
      });
    });
  };

  componentDidMount() {
    this.props.createDeck({
      displayCards: this.displayCards,
      showSolutions: this.showSolutions,
    });
    this.addEventListeners();
  }

  setFound = (bool, solutions, difficulty) => {
    if (bool) {
      this.showSnackBar("Set found!");
      this.showSolutions(true, solutions, difficulty);
      this.selectedCards = [];
      this.setState({ attempCounts: this.state.attempCounts + 1 });
    } else {
      this.showSnackBar("Sorry, this is not a Set!");
      this.setState({ errorCounts: this.state.errorCounts + 1 });
      this.errorCounts++;
    }
  };

  checkSet = () => {
    if (this.props.solutions.length === 0) {
      this.showSnackBar("No Sets left to find!");
    } else if (this.selectedCards.length !== 3) {
      this.showSnackBar("To check Sets, please select 3 cards");
    } else {
      this.props.checkSet({
        arrayOfCards: this.selectedCards,
        displayCards: this.displayCards,
        setFound: this.setFound,
        showSolutions: this.showSolutions,
        showSnackBar: this.showSnackBar,
      });
    }
    this.cleanSelect(this.selectedCards);
    this.selectedCards = [];
  };

  activateCards = () => {
    let elements = document.getElementsByClassName("card");
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener(
        "click",
        (event) => {
          event.stopPropagation();
          // alert(attribute);
          elements[i].classList.toggle("selected");
          let id = elements[i].getAttribute("id");
          let found = this.selectedCards.indexOf(parseInt(id));

          //selected card already clicked
          if (found >= 0 && this.selectedCards.length > 0) {
            elements[i].classList.remove("selected");
            this.selectedCards.splice(found, 1);
          } else {
            // Card was not selected before, add it.
            if (this.selectedCards.length < 3) {
              this.selectedCards.push(parseInt(id));
            } else {
              elements[i].classList.toggle("selected");
              console.log("Three cards already selected!");
            }
          }
          if (this.selectedCards.length === 3) {
            this.checkSet();
          }
        },
        false
      );
    }
  };

  cleanSelect = (array) => {
    if (array.length > 0) {
      _.forEach(array, (id) => {
        let el = document.getElementById(id);
        console.log("cleaning...", id, el);
        if (el) {
          el.classList.remove("selected");
        }
      });
    }
  };

  // change Hint div with ready solutions of SET game

  show_hide = (target_id, button_id) => {
    let e = document.getElementById(target_id);
    let btn = document.getElementById(button_id);

    if (e.style.display === "block") {
      e.style.display = "none";
      btn.innerHTML = "Show Solutions";
    } else {
      e.style.display = "block";
      btn.innerHTML = "Hide Solutions";
    }
  };

  showSnackBar = (msg) => {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = msg;
    setTimeout(function () {
      x.className = x.className.replace("show", "");
      x.innerHTML = "";
    }, 3000);
  };

  render() {
    return (
      <div id="game-parent">
        <Link to="/" className="back-home">
          <h3>Back to Home Page</h3>
        </Link>
        <div className="flex-start-center">
          <div>
            <div id="snackbar">Some text some message..</div>
            <h1>Set Game</h1>
            <h3>Select 3 cards from the deck below</h3>
            <div id="gameboard"></div>
          </div>
          <div className="flex-start-center flex-col pl-60">
            <h3>Possible sets: {this.props.solutions.length}</h3>
            <h3>Cards left: {this.props.deck.length}</h3>
            <h3>Found sets: {this.state.attempCounts}</h3>
            <h3>Errors: {this.state.errorCounts}</h3>

            <div className="flex-col">
              <button
                id="cheatMode"
                onClick={() => this.show_hide("solutions", "cheatMode")}
              >
                Show solutions
              </button>

              <button id="reset">New Deck</button>

              <button
                disabled={this.props.deck.length < 1}
                onClick={() =>
                  this.props.drawMore({
                    displayCards: this.displayCards,
                    showSolutions: this.showSolutions,
                  })
                }
              >
                Draw 3
              </button>

              <p>
                <a
                  href="https://en.wikipedia.org/wiki/Set_(card_game)"
                  target="blank"
                >
                  How to play?
                </a>
              </p>
            </div>
          </div>
        </div>

        <div id="solutions" className="sol"></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deck: state.game.deck,
    activeCards: state.game.activeCards,
    solutions: state.game.solutions,
    possibleSets: state.game.possibleSets,
    difficulty: state.game.difficulty,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { createDeck, checkSet, setDifficulty, drawMore },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Parent);
