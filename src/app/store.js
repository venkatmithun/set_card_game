import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import gameReducer from "../features/game/gameSlice";

export default configureStore({
  reducer: {
    game: gameReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types
      ignoredActions: [
        "game/createDeck",
        "game/setDifficulty",
        "game/solveDeck",
        "game/drawMore",
        "game/checkSet",
      ],
    },
  }),
});
