"use strict";

import config from "./config";
import socket from "./socket";
import messages from "./messages";
import roomie from "./roomie";
import chatbox from "./chatbox";
import files from "./files";
import reload from "./reload";
import splitter from "./splitter";
import privmsg from "./privmsg";
import "./templates";

export default new class Registry {
  constructor() {
    Object.defineProperty(this, "roomid", {
      value: document.location.pathname.replace(/^\/r\//, ""),
      enumerable: true
    });
  }
  async init() {
    delete this.init;
    const components = {
      socket,
      config,
      messages,
      roomie,
      chatbox,
      files,
      reload,
      splitter,
      privmsg,
    };
    for (const [k, component] of Object.entries(components)) {
      this[k] = component;
    }
    for (const [k, component] of Object.entries(components)) {
      if (typeof component === "function") {
        const rv = component();
        if (rv && rv.then) {
          this[k] = await rv;
        }
        else {
          this[k] = rv;
        }
      }
      if (typeof component.init === "function") {
        const rv = component.init();
        if (rv && rv.then) {
          await rv;
        }
      }
    }
  }
}();
