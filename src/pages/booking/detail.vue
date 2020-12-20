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
    <div class="row q-col-gutter-md q-px-lg">
      <div
        class="flex q-mx-auto column  col-6"
        style="max-width: 636px;width: 100%"
      >
        <h2
          class="text-h6 text-weight-bold"
          style="color: #2d333f;margin-bottom: -1rem;padding-left:2px"
        >
          快要完成了!
        </h2>
        <h1 class="text-h4 text-weight-bold" style="color: #2d333f">
          日初午訪 Noon Brunch
        </h1>

        <div class="flex row">
          <div
            class="flex items-center subtitle q-mr-lg"
            style="color:#2d333f;font-size: 1.2rem;"
          >
            <q-icon class="q-mr-sm" name="today" />
            <span> 12月25日 週五 </span>
          </div>

          <div
            class="flex items-center subtitle q-mr-lg"
            style="color:#2d333f;font-size: 1.2rem;"
          >
            <q-icon class="q-mr-sm" name="schedule" />
            <span> 1:30 下午 </span>
          </div>

          <div
            class="flex items-center subtitle"
            style="color:#2d333f;font-size: 1.2rem;"
          >
            <q-icon class="q-mr-sm" name="person" />
            <span> 2大 3小 </span>
          </div>
        </div>

        <hr />

        <div class="subtitle">聯絡資訊</div>
        <form class="row q-col-gutter-md">
          <div class="col-sm-6 col-xs-12">
            <q-input outlined v-model="form.name" label="訂位人姓名" />
          </div>
          <div class="col-sm-6  col-xs-12">
            <q-option-group
              name="preferred_genre"
              v-model="form.gender"
              :options="options"
              color="primary"
              size="lg"
              inline
            />
          </div>
          <div class="col-sm-6 col-xs-12">
            <q-input outlined v-model="form.phone" label="聯絡電話" />
          </div>
          <div class="col-sm-6 col-xs-12">
            <q-input outlined v-model="form.email" label="Email(非必填)" />
          </div>
          <div class="col-12">
            <q-select
              outlined
              v-model="form.occasion"
              :options="occasion"
              multiple
              use-chips
              label="用餐目的(非必填)"
            />
          </div>
          <div class="col-12">
            <q-input
              v-model="form.comment"
              filled
              clearable
              type="textarea"
              label="其他備註"
            />
          </div>
        </form>
        <q-btn
          color="primary"
          unelevated
          size="1.1rem"
          class="q-mt-lg "
          @click="$router.push('finish')"
          label="確認訂位"
        />
        <q-btn
          color="grey"
          unelevated
          size="1.1rem"
          class="q-mt-md "
          @click="$router.push('/')"
          label="回上一步"
        />
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
  name: "PageIndex",
  data() {
    return {
      slide: 1,
      peopleSelect: [1, 2, 3, 4, 5, 6, 7, 8],
      form: {
        adult: 1,
        children: 0,
        date: new Date().toLocaleDateString(),
        time: undefined,
        name: "",
        email: "",
        phone: "",
        occasion: undefined,
        gender: 1,
        comment: ""
      },
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
      ],

      timeout1: ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
      timeout2: [
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30"
      ],

      myLocale: {
        days: locale.days,
        daysShort: locale.daysShort,
        months: locale.months,
        monthsShort: locale.months
      }
    };
  },
  computed: {
    formatDate() {
      return this.$dayjs(this.form.date).format("YYYY/MM/DD ddd");
    },
    dateOptions() {
      const result = [];
      for (let i = 0; i < 30; i++) {
        result.push(
          this.$dayjs()
            .add(i, "day")
            .format("YYYY/MM/DD")
        );
      }
      return result;
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
