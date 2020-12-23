import Vue from "vue";
import axios from "axios";

const service = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  }
});

Vue.prototype.$axios = service;
