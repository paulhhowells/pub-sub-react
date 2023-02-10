type Callback = (x: any) => void;
type CallbackId = string;
type CallbackSet = Set<CallbackId>;
type ChannelId = string;
type Subscription = { 
  channelId: ChannelId; 
  callbackId: CallbackId; 
  callback: Callback; 
}

let idCounter = 1;
const channels = new Map<ChannelId, CallbackSet>(); 
const callbacks = new Map<CallbackId, Subscription>();

export const PubSub = Object.freeze({
  subscribe: (channelId: ChannelId, callback: Callback) => {
    const callbackId: CallbackId = newCallbackId();
    const subscription: Subscription = { callbackId, channelId, callback };

    callbacks.set(callbackId, subscription);

    if (channels.has(channelId)) {
      channels.get(channelId)?.add(callbackId);
    } else {
      channels.set(channelId, new Set<CallbackId>([ callbackId ]));
    }

    return callbackId;
  },
  publish: (channelId: ChannelId, message: string) => {
    if (channels.has(channelId)) {
      channels.get(channelId)?.forEach(
        (callbackId: CallbackId) => callbacks.get(callbackId)?.callback(message)
      );
    }
  },
  delete: (callbackId: CallbackId) => {
    // TypeScript doesn’t like destructuring channelId instead of this line.
    const channelId = callbacks.get(callbackId)?.channelId;

    if (channelId) {
      channels.get(channelId)?.delete(callbackId);
      callbacks.delete(callbackId);
    }
  },
});

function newCallbackId () {
  idCounter++;

  return 'ID-' + idCounter;
}
