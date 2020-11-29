/**
 * A simple global EventBus pattern using Vue's event system.
 *
 * This can be used to easily signal events and pass information from any component/library
 * of the application.
 *
 * USE SPARINGLY! Vue's default one way communication between components is always preferred.
 */

import Vue from "vue";

const EventBus = new Vue();

// enum-like
EventBus.events = {
  // API events
  requestStarted: "request-started",
  requestFinished: "request-finished",
  apiUnknownError: "api-unknown-error",
  apiReadError: "api-read-error",
  apiConnectError: "api-connect-error",
};

export default EventBus;
