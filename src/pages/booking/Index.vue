<template>
  <q-page
    class="flex q-mx-auto column "
    style="max-width: 1600px;background-color: #fff;padding-bottom: 5vh"
  >
    <q-carousel
      animated
      v-model="slide"
      arrows
      navigation
      infinite
      style="width: 100%;max-height: 512px;"
    >
      <q-carousel-slide
        :name="1"
        img-src="https://resizer.otstatic.com/v2/photos/wide-huge/1/31667434.jpg"
      />
      <q-carousel-slide
        :name="2"
        img-src="https://cdn.quasar.dev/img/parallax1.jpg"
      />
      <q-carousel-slide
        :name="3"
        img-src="https://cdn.quasar.dev/img/parallax2.jpg"
      />
      <q-carousel-slide
        :name="4"
        img-src="https://cdn.quasar.dev/img/quasar.jpg"
      />
    </q-carousel>

    <div class="flex q-mx-auto column q-px-lg" style="max-width: 992px">
      <h1 class="text-h4 text-weight-bold" style="color: #2d333f">
        {{ restaurantInfo.name }}
      </h1>

      <div class="text-h6" style="color:#2d333f;margin-bottom: 5px">
        {{ restaurantInfo.address }}
      </div>

      <div class="flex row">
        <div class="flex items-center q-mr-lg">
          <q-icon
            class="q-mr-sm"
            style="color:#2d333f;font-size: 1.3rem;"
            name="call"
          />
          <span style="color:#da3743;font-size: 1.2rem;">
            {{ restaurantInfo.phone }}</span
          >
        </div>
        <div class="flex items-center">
          <q-icon
            class="q-mr-sm"
            style="color:#2d333f;font-size: 1.3rem;"
            name="map"
          />
          <span style="color:#da3743;font-size: 1.2rem;"> 查看地圖</span>
        </div>
      </div>
      <hr />
      <div class="flex row">
        <div class="q-mr-lg">
          <div class="subtitle">用餐人數</div>
          <div class="flex row">
            <q-select
              v-model="form.adult"
              class="q-mr-lg q-mb-sm"
              style="width: 150px;max-width: 45%"
              outlined
              :options="peopleSelect"
            >
              <template v-slot:append>
                <div style="font-size: 16px">位大人</div>
              </template>
            </q-select>

            <q-select
              v-model="form.children"
              class="q-mb-sm"
              style="width: 150px;max-width: 45%"
              outlined
              :options="[0, ...peopleSelect]"
            >
              <template v-slot:append>
                <div style="font-size: 16px">位小孩</div>
              </template>
            </q-select>
          </div>
        </div>
        <div>
          <div class="subtitle">用餐日期</div>
          <div class="flex row">
            <q-select
              v-model="formatDate"
              :options="dateOptions"
              class="q-mr-lg"
              style="width: 16rem"
              outlined
            >
            </q-select>
          </div>
        </div>
      </div>
      <hr />
      <div class="subtitle">用餐時段</div>
      <template v-if="loading">
        <q-skeleton width="100%" height="12rem" />
      </template>
      <template v-else>
        <template v-for="(timeRange, j) in timeOptions">
          <div style="color:#888" :key="j + '_label'">
            {{ timeRange.label }}
          </div>
          <div class="q-pa-0 q-mt-sm" :key="j">
            <q-btn
              v-for="time in timeRange.options"
              @click="form.time = time.label"
              :outline="form.time !== time.label"
              :color="form.time === time.label ? 'primary' : 'grey'"
              unelevated
              size="1.1rem"
              class="q-mr-sm q-px-sm q-mb-sm"
              :key="time.label"
              :label="time.label"
              :disable="
                time.value + time.current + form.adult + form.children > 8
              "
              :class="{
                'text-decoration':
                  time.value + time.current + form.adult + form.children > 8
              }"
            />
          </div>
        </template>

        <span style="color:#888">*預約時段只保留10分鐘 有特殊需求請致電</span>
      </template>
      <hr />

      <div class="subtitle">餐廳資訊</div>

      <restaurant-info />

      <hr />
      <div class="subtitle">菜單</div>

      <q-carousel
        animated
        v-model="slide"
        arrows
        infinite
        style="width: 100%;height: 512px;"
      >
        <q-carousel-slide
          :name="1"
          img-src="https://resizer.otstatic.com/v2/photos/wide-huge/1/31667434.jpg"
        />
        <q-carousel-slide
          :name="2"
          img-src="https://cdn.quasar.dev/img/parallax1.jpg"
        />
        <q-carousel-slide
          :name="3"
          img-src="https://cdn.quasar.dev/img/parallax2.jpg"
        />
        <q-carousel-slide
          :name="4"
          img-src="https://cdn.quasar.dev/img/quasar.jpg"
        />
      </q-carousel>
    </div>

    <q-footer style="background: #fff;border-top: 1px solid rgb(232, 232, 232)">
      <div
        class="flex q-px-lg q-py-sm q-mx-auto row"
        style="max-width: 861px;color: #24292e;"
      >
        <q-btn
          color="primary"
          unelevated
          size="1.1rem"
          class="q-mr-sm q-px-sm q-mb-sm full-width"
          label="下一步"
          @click="next"
        />
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import RestaurantInfo from "./components/restaurantInfo";
const locale = {
  months: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
  ],
  days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  daysShort: ["日", "一", "二", "三", "四", "五", "六"]
};
export default {
  name: "BookingTime",
  components: { RestaurantInfo },
  data() {
    return {
      slide: 1,
      loading: true,
      peopleSelect: [1, 2, 3, 4, 5, 6, 7, 8],
      booking: {},
      form: {
        adult: 2,
        children: 0,
        date: this.$dayjs(),
        time: undefined
      },

      timeout1: ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
      timeout2: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"],

      timeOptionsDefault: [
        {
          label: "早上",
          data: ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]
        },
        {
          label: "中午",
          data: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"]
        }
      ]
    };
  },
  async created() {
    const history = {
      id: window.localStorage.getItem("id"),
      phone: window.localStorage.getItem("phone")
    };
    if (history.id && history.phone) {
      try {
        const bookingInfo = await this.getbookingInfo({
          id: history.id,
          phone: history.phone
        });
        this.$router.push({
          name: "BookingOver",
          params: {
            bookingInfo
          }
        });
      } catch (error) {
        window.localStorage.clear("phone");
        window.localStorage.clear("id");
      }
    }
    this.getBooking();
  },
  watch: {
    "form.date"(value) {
      this.getBooking();

      this.form.time = undefined;
    },
    "form.adult"() {
      this.form.time = undefined;
    },
    "form.children"() {
      this.form.time = undefined;
    }
  },
  computed: {
    restaurantInfo() {
      return this.$store.state.restaurant.info;
    },
    formatDate: {
      get() {
        return this.$dayjs(this.form.date).format("YYYY/MM/DD ddd");
      },
      set(val) {
        this.form.date = this.$dayjs(new Date(val.substr(0, 10)));
      }
    },
    dateOptions() {
      const result = [];
      for (let i = 0; i < 30; i++) {
        result.push(
          this.$dayjs()
            .add(i, "day")
            .format("YYYY/MM/DD ddd")
        );
      }
      return result;
    },
    timeOptions() {
      const result = this.timeOptionsDefault.map(time => {
        time.options = time.data.map(x => ({
          label: x,
          value: this.booking[x] || 0,
          current: 0
        }));
        return time;
      });

      const _d = [...result[0].options, ...result[1].options];
      _d.forEach((x, i) => {
        try {
          _d[i + 1].current += x.value;
          _d[i + 2].current += x.value;
          _d[i + 3].current += x.value;
          _d[i - 1].current += x.value;
          _d[i - 2].current += x.value;
          _d[i - 3].current += x.value;
        } catch (error) {}
      });

      result.forEach(time => {
        time.options.map((x, i) => {
          const data = _d.find(j => j.label === x.label);
          x.current = data.current;
        });
      });

      return result;
    }
  },
  methods: {
    async getbookingInfo(data) {
      const res = await this.$axios.get(`/booking/${data.id}`, {
        params: {
          phone: data.phone
        }
      });
      console.log(res.data.data);
      return res.data.data;
    },
    async getBooking() {
      const res = await this.$axios.get("/booking", {
        params: {
          date: this.form.date.toDate().getTime()
        }
      });
      this.booking = res.data.data;
      this.loading = false;
    },
    next() {
      if (!this.form.time) {
        this.$q.notify({
          type: "negative",
          message: `請先選擇用餐時段!`,
          timeout: 500
        });
        return;
      }

      this.$router.push({
        name: "BookingDetail",
        params: { timeForm: this.form }
      });
    }
  }
};
</script>

<style lang="scss">
.text-decoration {
  text-decoration: line-through;
}
</style>
