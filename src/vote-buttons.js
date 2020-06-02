import html from "./html.js";

const VoteUp = index => state => {
  const newState = { ...state };
  newState.comments[index].score = newState.comments[index].score + 1;
  return newState;
};

const VoteDown = index => state => {
  const newState = { ...state };
  newState.comments[index].score = newState.comments[index].score - 1;
  return newState;
};

export const VoteButtons = ({ score, index }) => html`
  <div class="post__vote-buttons">
    <button class="post__vote-down" onclick=${VoteDown(index)}>-</button>
    <span class="post__vote-score"
      >${score === 0 ? "0" : score > 0 ? "+" + score : score}</span
    >
    <button class="post__vote-up" onclick=${VoteUp(index)}>+</button>
  </div>
`;
