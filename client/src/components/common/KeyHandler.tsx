type Listeners = { [key: string]: () => void };

export default function keyHandler(listeners: Listeners) {
  return (e: React.KeyboardEvent<any>) => {
    // console.log(`Keypress: ${e.key}`);
    if (listeners[e.key] !== undefined) {
      listeners[e.key]();
    }
  };
}

export function enterHandler(action: () => void) {
  return keyHandler({ Enter: action });
}
