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
      style="width: 100%;max-height: 512px;height: auto;"
    >
      <q-carousel-slide
        :name="i"
        v-for="(image, i) in slideImages"
        :key="image"
        style="padding: 0"
        class="column no-wrap flex-center"
      >
        <q-img :src="image" :ratio="16 / 9" />
      </q-carousel-slide>
    </q-carousel>

    <div class="row q-col-gutter-md q-px-lg">
      <div
        class="flex q-mx-auto column  col-xs-12  col-sm-6"
        style="max-width: 636px;width: 100%"
      >
        <h2
          class="text-h6 text-weight-bold"
          style="color: #2d333f;margin-bottom: -1rem;padding-left:2px"
        >
          快要完成了!
        </h2>
        <h1 class="text-h4 text-weight-bold" style="color: #2d333f">
          {{ restaurantInfo.name }}
        </h1>

        <div class="flex row">
          <div
            class="flex items-center subtitle q-mr-lg"
            style="color:#2d333f;font-size: 1.2rem;"
          >
            <q-icon class="q-mr-sm" name="today" />
            <span> {{ timeForm.date.format("MM月DD日 ddd") }} </span>
          </div>

          <div
            class="flex items-center subtitle q-mr-lg"
            style="color:#2d333f;font-size: 1.2rem;"
          >
            <q-icon class="q-mr-sm" name="schedule" />
            <span> {{ timeForm.time }} </span>
          </div>

          <div
            class="flex items-center subtitle"
            style="color:#2d333f;font-size: 1.2rem;"
          >
            <q-icon class="q-mr-sm" name="person" />
            <span>
              {{ timeForm.adult }} 位大人 {{ timeForm.children }} 位小孩
            </span>
          </div>
        </div>

        <hr />

        <div class="subtitle">聯絡資訊</div>
        <q-form class="row q-col-gutter-md" ref="contactForm">
          <div class="col-sm-6 col-xs-12">
            <q-input
              outlined
              v-model="form.name"
              :rules="[val => (val && val.length > 0) || '請輸入訂位人姓名']"
              label="訂位人姓名*"
            />
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
            <q-input
              outlined
              v-model="form.phone"
              :maxlength="10"
              :rules="[
                val =>
                  (val && /^09[0-9]{8}$/.test(val)) || '請輸入訂位人手機號碼'
              ]"
              label="聯絡手機號碼*"
            />
          </div>
          <div class="col-sm-6 col-xs-12">
            <q-input
              outlined
              v-model="form.email"
              label="Email*"
              type="email"
              :rules="[
                val =>
                  (val &&
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                      val
                    )) ||
                  '請輸入有效 Email'
              ]"
            />
          </div>
          <div class="col-12">
            <q-select
              outlined
              v-model="form.occasion"
              :options="occasion"
              multiple
              use-chips
              label="用餐目的"
            />
          </div>
          <div class="col-12">
            <q-input
              v-model="form.comment"
              filled
              clearable
              type="textarea"
              label="其他備註(ex.如果需兒童椅 請提出需求)"
            />
          </div>
        </q-form>
        <q-btn
          color="primary"
          unelevated
          size="1.1rem"
          class="q-mt-lg "
          @click="next"
          label="確認訂位"
          :loading="loading"
        />
        <q-btn
          color="grey"
          unelevated
          size="1.1rem"
          class="q-mt-md "
          @click="$router.push('/')"
          :disable="loading"
          label="回上一步"
        />
      </div>

      <div
        class="flex q-mx-auto column col-xs-12  col-sm-6"
        style="max-width: 302px;width: 100%"
      ></div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "BookingDetail",
  props: {
    timeForm: Object
  },
  data() {
    return {
      slideImages: [
        "https://booking.ianleong3712.space/16x9/16x9_04.jpg",
        "https://booking.ianleong3712.space/16x9/16x9_05.jpg",
        "https://booking.ianleong3712.space/16x9/16x9_06.jpg"
      ],
      loading: false,
      slide: 1,
      form: {
        name: "",
        email: "",
        phone: "",
        occasion: [],
        gender: 1,
        comment: ""
      },
      occasion: ["慶生", "約會", "周年慶", "家庭用餐", "朋友聚餐", "商務聚餐"],
      options: [
        {
          label: "小姐",
          value: 0
        },
        {
          label: "先生",
          value: 1
        },
        {
          label: "其他",
          value: 2
        }
      ]
    };
  },
  created() {
    if (!this.timeForm) {
      this.$router.replace({ name: "BookingTime" });
    }
  },
  computed: {
    restaurantInfo() {
      return this.$store.state.restaurant.info;
    }
  },
  methods: {
    async next() {
      const form = {
        ...this.form,
        adult: this.timeForm.adult,
        children: this.timeForm.children,
        time: new Date(
          this.timeForm.date.format("YYYY/MM/DD ") + this.timeForm.time
        ).getTime()
      };
      if (await this.$refs.contactForm.validate()) {
        this.loading = true;
        try {
          const res = await this.$axios.post("/booking", form);
          window.localStorage.setItem("id", res.data.data.id);
          window.localStorage.setItem("phone", res.data.data.phone);
          this.$router.push({
            name: "BookingOver",
            params: { bookingInfo: res.data.data }
          });
        } catch (error) {
          console.log(error);
          this.$q.notify({
            type: "negative",
            message: `伺服器繁忙, 請稍後重試!`,
            timeout: 500
          });
        } finally {
          this.loading = false;
        }
      }
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
