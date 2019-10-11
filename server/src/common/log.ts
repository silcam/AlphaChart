function log(text: string) {
  if (shouldLog()) console.log(text);
}

function warn(text: string) {
  if (shouldLog()) console.warn(text);
}

function error(text: string) {
  if (shouldLog()) console.error(text);
}

function shouldLog() {
  return process.env.NODE_ENV !== "test";
}

export default {
  log,
  warn,
  error
};
