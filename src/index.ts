interface EventType {
  callback: Function;
  once: boolean;
}

interface EventsType {
  [key: string]: EventType[];
}

/* event-emitter */
export default class EventEmitter {
  private _events: EventsType = {};

  /**
   * 监听一个事件
   * @param evt
   * @param callback
   * @param once
   */
  on(evt: string, callback: Function, once?: boolean) {
    if (!this._events[evt]) {
      this._events[evt] = [];
    }
    this._events[evt].push({
      callback,
      once: !!once,
    });
    return this;
  }

  /**
   * 监听一个事件一次
   * @param evt
   * @param callback
   */
  once(evt: string, callback: Function) {
    this.on(evt, callback, true);
    return this;
  }

  /**
   * 触发一个事件
   * @param evt
   * @param args
   */
  emit(evt: string, ...args: any[]) {
    const events = this._events[evt] || [];

    let length = events.length;
    for (let i = 0; i < length; i ++) {
      const { callback, once } = events[i];

      callback.apply(this, args);
      if (once) {
        events.splice(i, 1);

        if (events.length === 0) {
          delete this._events[evt];
        }

        length --;
        i --;
      }
    }
  }

  /**
   * 取消监听一个事件，或者一个channel
   * @param evt
   * @param callback
   */
  off(evt?: string, callback?: Function) {
    if (!evt) {
      // evt 为空全部清除
      this._events = {};
    } else {
      if (!callback) {
        // evt 存在，callback 为空，清除事件所有方法
        delete this._events[evt];
      } else {
        // evt 存在，callback 存在，清除匹配的
        const events = this._events[evt] || [];

        let length = events.length;
        for (let i = 0; i < length; i ++) {
          if (events[i].callback === callback) {
            events.splice(i, 1);
            length --;
            i --;
          }
        }

        if (events.length === 0) {
          delete this._events[evt];
        }
      }
    }

    return this;
  }

  /* 当前所有的事件 */
  getEvents() {
    return this._events;
  }
}
