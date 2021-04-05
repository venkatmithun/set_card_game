import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    cards: null,
    properties: {
      colors: ["green", "purple", "red"],
      numbers: [1, 2, 3],
      shapes: ["diamond", "oval", "squiggle"],
    },
    deck: [],
    activeCards: [],
    solutions: [],
    possibleSets: 0,
    difficulty: 0,
  },
  reducers: {
    setDifficulty: (state, action) => {
      const difficulty = action.payload;
      state.difficulty = difficulty;
      if (difficulty === 0) {
        state.cards = _.range(1, 28);
        state.cards = _.shuffle(state.cards);
        state.deck = _.map(state.cards, (id) => {
          return {
            id: id,
            attr: {
              color: state.properties.colors[Math.floor((id % 27) / 9)],
              number: state.properties.numbers[Math.floor((id % 9) / 3)],
              shape: state.properties.shapes[Math.floor(id % 3)],
            },
          };
        });
      } else {
        state.cards = _.range(1, 82);
        state.cards = _.shuffle(state.cards);
        state.properties["shades"] = ["clear", "shaded", "solid"];
        state.deck = _.map(state.cards, (id) => {
          return {
            id: id,
            attr: {
              color: state.properties.colors[Math.floor((id % 81) / 27)],
              number: state.properties.numbers[Math.floor((id % 27) / 9)],
              shade: state.properties.shades[Math.floor((id % 9) / 3)],
              shape: state.properties.shapes[Math.floor(id % 3)],
            },
          };
        });
      }
      state.activeCards = [];
      state.solutions = [];
      state.possibleSets = 0;
    },
    createDeck: (state, action) => {
      console.log("Create Deck Reducer");
      const { displayCards, showSolutions } = action.payload;
      const upperBound = state.deck.length > 12 ? state.deck.length - 12 : 0;
      state.activeCards = state.deck.splice(_.random(0, upperBound), 12);
      displayCards(state.activeCards, state.difficulty);
      gameSlice.caseReducers.solveDeck(state, action);
      showSolutions(false, state.solutions, state.difficulty);
    },
    solveDeck: (state, action) => {
      try {
        console.log("Solve Deck Reducer");
        let threeCardSet = [];
        let attributes = [];
        let solutions = [];
        const matchNeeded = state.difficulty === 0 ? 3 : 4;
        const activeCards = [...state.activeCards];
        let numCards = activeCards.length;
        for (let card1 = 0; card1 < numCards - 2; card1++) {
          for (let card2 = card1 + 1; card2 < numCards - 1; card2++) {
            for (let card3 = card2 + 1; card3 < numCards; card3++) {
              threeCardSet = [
                activeCards[card1],
                activeCards[card2],
                activeCards[card3],
              ];

              let matchCounter = 0;
              // iterate through atteributes of each card
              for (let attribute in threeCardSet[0].attr) {
                attributes = [];
                for (let card in threeCardSet) {
                  attributes.push(threeCardSet[card].attr[attribute]);
                }
                // check for same or different attributes between 3 cards
                if (
                  !(
                    (attributes[0] === attributes[1] &&
                      attributes[1] === attributes[2]) ||
                    (attributes[0] !== attributes[1] &&
                      attributes[1] !== attributes[2] &&
                      attributes[0] !== attributes[2])
                  )
                ) {
                  break;
                } else {
                  matchCounter++;
                }
              }
              if (matchCounter === matchNeeded) {
                solutions.push(threeCardSet);
                break;
              }
            }
          }
        }
        console.log("solutions length", solutions.length);
        if (
          solutions.length === 0 &&
          state.deck.length > 0 &&
          state.difficulty < 2
        ) {
          gameSlice.caseReducers.drawMore(state, action);
        }
        state.solutions = solutions;
        state.possibleSets = solutions.length;
      } catch (error) {
        console.log("error solving set", error);
      }
    },
    drawMore: (state, action) => {
      const { showSolutions, displayCards } = action.payload;
      const upperBound = state.deck.length > 3 ? state.deck.length - 3 : 0;
      state.activeCards = [
        ...state.activeCards,
        ...state.deck.splice(_.random(0, upperBound), 3),
      ];
      displayCards(state.activeCards, state.difficulty);
      gameSlice.caseReducers.solveDeck(state, action);
      showSolutions(true, state.solutions, state.difficulty);
    },
    checkSet: (state, action) => {
      try {
        const {
          arrayOfCards,
          displayCards,
          setFound,
          showSnackBar,
        } = action.payload;
        const solutions = state.solutions;
        for (let j = 0; j < solutions.length; j++) {
          let solutionSet = solutions[j].map((i) => i.id);
          let result = _.isEqual(_.sortBy(arrayOfCards), _.sortBy(solutionSet));
          if (result) {
            solutions.splice(j, 1);
            let newArr = [];
            let deck = [...state.deck];
            if (deck.length >= 3) {
              for (let i = 0; i < 3; ++i) {
                newArr.push(deck.splice(0, 1)[0]);
              }
            }
            for (let j = state.activeCards.length - 1; j >= 0; j--) {
              if (arrayOfCards.includes(state.activeCards[j].id)) {
                if (newArr.length > 0) {
                  state.activeCards[j] = newArr.pop();
                } else {
                  state.activeCards.splice(j, 1);
                }
              }
            }

            state.deck = deck;
            //displaying cards
            displayCards(state.activeCards, state.difficulty);
            if (state.possibleSets > 0) {
              state.possibleSets--;
            } else if (state.possibleSets === 0 && state.deck.length === 0) {
              showSnackBar("All possible Sets already found! End");
            }
            gameSlice.caseReducers.solveDeck(state, action);
            setFound(true, state.solutions, state.difficulty);
            return;
          }
        }
        gameSlice.caseReducers.solveDeck(state, action);
        setFound(false, state.solutions);
        return;
      } catch (error) {
        console.log("Error check set", error);
      }
    },
  },
});

export const {
  createDeck,
  solveDeck,
  checkSet,
  setDifficulty,
  drawMore,
} = gameSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectDeck = (state) => state.game.deck;

export default gameSlice.reducer;
