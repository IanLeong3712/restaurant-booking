<template>
  <q-page
    class="flex q-mx-auto column "
    style="max-width: 636px;padding-bottom: 5vh"
  >
    <div
      class="row q-col-gutter-md q-pa-sm q-pb-lg q-pt-md"
      style="background: #55b68d;color: #fff;"
    >
      <div>
        <q-icon size="3rem" name="check_circle" />
      </div>
      <div>
        <div>謝謝, {{ bookingInfo.name }} 先生! 您的訂位已經完成.</div>
        <div>訂位資訊 #{{ bookingInfo.id }}</div>
      </div>
    </div>

    <div class="row q-col-gutter-md q-px-lg " style="background-color: #fff;">
      <div
        class="flex q-mx-auto column col-6"
        style="max-width: 636px;width: 100%"
      >
        <h1 class="text-h4 text-weight-bold" style="color: #2d333f">
          日初午訪 <br />Noon Brunch
        </h1>

        <div class="flex row">
          <div
            class="flex items-center subtitle q-mr-lg"
            style="color:#2d333f;font-size: 1.2rem;"
          >
            <q-icon class="q-mr-sm" name="today" />
            <span> {{ formatDate.format("MM月DD日 ddd") }} </span>
          </div>

          <div
            class="flex items-center subtitle q-mr-lg"
            style="color:#2d333f;font-size: 1.2rem;"
          >
            <q-icon class="q-mr-sm" name="schedule" />
            <span> {{ formatDate.format("HH:mm") }} </span>
          </div>

          <div
            class="flex items-center subtitle"
            style="color:#2d333f;font-size: 1.2rem;"
          >
            <q-icon class="q-mr-sm" name="person" />
            <span>
              {{ bookingInfo.adult }} 位大人
              <template v-if="bookingInfo.children > 0">
                {{ bookingInfo.children }} 位小孩
              </template>
            </span>
          </div>
        </div>
        <hr />
        <div class="row q-col-gutter-lg">
          <div class="col-xs-12 col-sm-5">
            <div
              class="flex items-center subtitle"
              style="color:#2d333f;font-size: 1.1rem;"
            >
              <q-icon class="q-mr-sm" name="map" />
              <span> 位置</span>
            </div>
            <div style="font-size: 1rem">{{ restaurantInfo.address }}</div>

            <div
              class="flex items-center subtitle q-mt-lg"
              style="color:#2d333f;font-size: 1.1rem;"
            >
              <q-icon class="q-mr-sm" name="phone" />
              <span> 聯絡電話</span>
            </div>
            <div style="font-size: 1rem">{{ restaurantInfo.phone }}</div>
          </div>

          <div class="col-xs-12 col-sm-7">
            <iframe
              width="100%"
              height="100%"
              frameborder="0"
              style="border:0"
              :src="
                'https://www.google.com/maps/embed/v1/place?key=AIzaSyDo2x7y_CQ1kKCoO0PCVqEzmhrgsfa0_6g&q=' +
                  restaurantInfo.address
              "
              allowfullscreen
            >
            </iframe>
          </div>
        </div>

        <hr />
        <div>
          <q-btn
            color="primary"
            unelevated
            outline
            size="1.1rem"
            class="q-mr-md"
            label="取消訂位"
            @click="cancel"
          />
        </div>
      </div>

      <div
        class="flex q-mx-auto column  col-6"
        style="max-width: 302px;width: 100%"
      ></div>
    </div>
  </q-page>
</template>

<script>
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
  name: "BookingThanks",
  props: {
    bookingInfo: Object
  },
  data() {
    return {
      occasion: ["慶生", "約會", "周年慶", "家庭用餐", "朋友聚餐", "商務聚餐"],
      options: [
        {
          label: "先生",
          value: 1
        },
        {
          label: "小姐",
          value: 0
        },
        {
          label: "其他",
          value: 3
        }
      ]
    };
  },
  created() {
    if (!this.bookingInfo) {
      this.$router.push("/");
      return;
    }
    if (this.bookingInfo.delete) {
      this.$router.push("/");
      return;
    }
  },
  computed: {
    restaurantInfo() {
      return this.$store.state.restaurant.info;
    },
    formatDate() {
      return this.$dayjs(this.bookingInfo.time);
    }
  },
  methods: {
    async cancel() {
      const res = await this.$axios.post(
        `/booking/${this.bookingInfo.id}/cancel`,
        {
          phone: this.bookingInfo.phone
        }
      );
      this.booking = res.data.data;
      this.loading = false;

      window.localStorage.clear("phone");
      window.localStorage.clear("id");
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss">
.subtitle {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #2d333f;
  font-weight: bold;
}

hr {
  border: none;
  margin: 0px;
  height: 1px;

  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgb(232, 232, 232);
  border-top-color: rgb(232, 232, 232);
  border-right-color: rgb(232, 232, 232);
  border-left-color: rgb(232, 232, 232);
}
</style>
