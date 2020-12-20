import Vue from "vue";

import dayjs from "dayjs";
import "dayjs/locale/zh-tw";

dayjs.locale("zh-tw");

Vue.prototype.$dayjs = dayjs;
