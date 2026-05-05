type EventName = "unauthorized";

const listeners = new Map<EventName, (() => void)[]>();

export const apiEvents = {
  on(event: EventName, cb: () => void) {
    const cbs = listeners.get(event) ?? [];
    listeners.set(event, [...cbs, cb]);
    return () => apiEvents.off(event, cb);
  },
  off(event: EventName, cb: () => void) {
    listeners.set(
      event,
      (listeners.get(event) ?? []).filter((c) => c !== cb),
    );
  },
  emit(event: EventName) {
    (listeners.get(event) ?? []).forEach((cb) => cb());
  },
};

export default apiEvents;
