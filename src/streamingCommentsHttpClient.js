export const fetchComments = (dispatch, action) => {
  fetch("http://localhost:3000/public/data.ndjson").then(response => {
    // response.body gives you a stream you can read from
    var comments = response.body.pipeThrough(decodeText()).pipeThrough(splitStream('\n')).pipeThrough(parseJSON());

    consumeComments(comments.getReader());
  });

  // as parts of the stream arrive we need to translate them from bytes to text
  // we use TextDecoder for that - not all browsers support it
  function decodeText() {
    const decoder = new TextDecoder();
    return new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(decoder.decode(chunk, {stream: true}));
      }
    });
  }

  // as chunks of data arrive we need to split them on a predefined separator
  // we push forward chunks split on the separator
  function splitStream(splitOn) {
    let buffer = '';

    return new TransformStream({
      transform(chunk, controller) {
        buffer += chunk;
        const parts = buffer.split(splitOn);
        parts.slice(0, -1).forEach(part => controller.enqueue(part));
        buffer = parts[parts.length - 1];
      },
      flush(controller) {
        if (buffer) controller.enqueue(buffer);
      }
    });
  }

  // each chunk that we get should be parsed from string to object
  function parseJSON() {
    return new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(JSON.parse(chunk));
      }
    });
  }

  // as objects arrive one after another we add them to the model/state
  function consumeComments(reader) {
    var promise = reader.read();
    promise.then(result => {
      if (result.done) return;
      dispatch(action, result.value);
      // main.addComment(result.value);
      consumeComments(reader);
    });
  }
};