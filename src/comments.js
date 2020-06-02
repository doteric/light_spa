import html from "./html.js";
import { VoteButtons } from "./vote-buttons.js";
import {memoize} from "./memoize.js";

const Comment = (c, index) => html`
        <div class="post__comment">
          <h2 class="post__comment-author">${c.username} wrote</h2>
          <p class="post__comment-text">
            ${c.text}
          </p>
          <${VoteButtons} index=${index} score=${c.score} />
        </div>
      `;

const memoizedComment = memoize(Comment);

const Comments = ({ comments }) => html`
  <section class="post__comments">
    <h1>Comments</h1>
    ${comments.map(memoizedComment)}
  </section>
`;

export default Comments;
