import initstate from "./store.js";
export default (state = initstate, action) => {
  switch (action.type) {
    case "changeStore":
      return { ...state, ...action.payload };
      break;

    default:
      return state;
      break;
  }
};
