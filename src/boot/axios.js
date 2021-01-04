import Vue from "vue";
import axios from "axios";

const service = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "https://booking.ianleong3712.space/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  }
});

Vue.prototype.$axios = service;
