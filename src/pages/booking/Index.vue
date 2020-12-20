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
        日初午訪 Noon Brunch
      </h1>

      <div class="text-h6" style="color:#2d333f;margin-bottom: 5px">
        台南市北區育德二路261號
      </div>

      <div class="flex row">
        <div class="flex items-center q-mr-lg">
          <q-icon
            class="q-mr-sm"
            style="color:#2d333f;font-size: 1.3rem;"
            name="call"
          />
          <span style="color:#da3743;font-size: 1.2rem;"> 06-2810982</span>
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
              :value="formatDate"
              class="q-mr-lg"
              style="width: 16rem"
              outlined
            >
            </q-select>
          </div>
        </div>
      </div>

      <!-- <div class="q-pa-md">
        <q-date
          v-model="form.date"
          :locale="myLocale"
          class="datepicker"
          no-unset
          :years-in-month-view="true"
          flat
          minimal
          title="title"
          subtitle="用餐日期"
          :options="dateOptions"
        />
        <q-date
          v-model="form.date"
          :locale="myLocale"
          class="datepicker"
          no-unset
          flat
          minimal
          title="title"
          subtitle="用餐日期"
          :options="dateOptions"
          default-year-month="1964/08"
        />
      </div> -->

      <hr />
      <div class="subtitle">用餐時段</div>
      <div style="color:#888">中午</div>

      <div class="q-pa-0 q-mt-sm">
        <q-btn
          v-for="i in timeout1"
          @click="form.time = i"
          :outline="form.time !== i"
          :color="form.time === i ? 'primary' : 'grey'"
          unelevated
          size="1.1rem"
          class="q-mr-sm q-px-sm q-mb-sm"
          :key="i"
          :label="i"
        />
      </div>
      <div class="q-mt-md" style="color:#888">下午</div>

      <div class="q-pa-0 q-mt-sm">
        <q-btn
          v-for="i in timeout2"
          @click="form.time = i"
          :outline="form.time !== i"
          :color="form.time === i ? 'primary' : 'grey'"
          unelevated
          size="1.1rem"
          class="q-mr-sm q-px-sm q-mb-sm"
          :key="i"
          :label="i"
        />
      </div>
      <hr />
      <div class="subtitle">餐廳資訊</div>

      <div class="row q-col-gutter-lg">
        <div class="col-7">
          <iframe
            width="100%"
            height="100%"
            frameborder="0"
            style="border:0"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDo2x7y_CQ1kKCoO0PCVqEzmhrgsfa0_6g&q=Space+Needle,Seattle+WA"
            allowfullscreen
          >
          </iframe>
        </div>
        <div class="col-5">
          <div
            class="flex items-center subtitle"
            style="color:#2d333f;font-size: 1.1rem;"
          >
            <q-icon class="q-mr-sm" name="map" />
            <span> 位置</span>
          </div>
          <div style="font-size: 1rem">台南市北區育德二路261號</div>
          <hr />

          <div
            class="flex items-center subtitle"
            style="color:#2d333f;font-size: 1.1rem;"
          >
            <q-icon class="q-mr-sm" name="phone" />
            <span> 聯絡電話</span>
          </div>
          <div style="font-size: 1rem">06-2810982</div>
          <hr />
          <div
            class="flex items-center subtitle"
            style="color:#2d333f;font-size: 1.1rem;"
          >
            <q-icon class="q-mr-sm" name="today" />
            <span> 營業時間</span>
          </div>
          <div style="font-size: 1rem">08:30-15:30</div>
          <hr />
          <div
            class="flex items-center subtitle"
            style="color:#2d333f;font-size: 1.1rem;"
          >
            <q-icon class="q-mr-sm" name="fastfood" />
            <span> 料理類型</span>
          </div>
          <div style="font-size: 1rem">中式料理, 火鍋</div>
        </div>
      </div>
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
        <!-- <div class="text-subtitle1 ">
          <div>{{ formatDate }} {{ form.time }}</div>
          <div>2大 3小</div>
        </div> -->

        <q-btn
          color="primary"
          unelevated
          size="1.1rem"
          class="q-mr-sm q-px-sm q-mb-sm full-width"
          label="下一步"
          @click="$router.push('detail')"
        />
      </div>
    </q-footer>
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
        time: undefined
      },

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
