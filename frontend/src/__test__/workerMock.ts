global["onmessage"] = () => { }

require("@mulesoft/data-weave-monaco/dist/dw.worker");

const clientWorker = {
  postMessage: (data) => {
    global["onmessage"]({ data: data })
  },
  onmessage: (data) => { }
};

global["postMessage"] = (data) => {
  clientWorker.onmessage({ data: data })
};

module.exports = () => {
  return clientWorker
}
