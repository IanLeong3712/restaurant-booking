<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section style="max-height: 80vh;" class="scroll">
        <q-form class="row q-col-gutter-md" ref="contactForm">
          <div class="flex row q-mb-sm">
            <div>
              <div class="subtitle">用餐日期</div>
              <div class="flex row">
                <q-select
                  v-model="formatDate"
                  :options="dateOptions"
                  class="q-mr-sm"
                  style="width: 9rem"
                  outlined
                >
                </q-select>

                <q-select
                  v-model="form.time"
                  :options="timeSelect"
                  style="width: 7rem"
                  outlined
                >
                </q-select>
              </div>
            </div>
          </div>

          <div class="flex row">
            <div>
              <div class="subtitle">用餐人數</div>
              <div class="flex row">
                <q-select
                  v-model="form.adult"
                  class="q-mr-sm q-mb-sm"
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
          </div>

          <div class="flex row">
            <div>
              <div class="subtitle">聯絡資訊</div>
              <div class="flex row">
                <div class="col-sm-6 col-xs-12">
                  <q-input
                    outlined
                    v-model="form.name"
                    :rules="[
                      val => (val && val.length > 0) || '請輸入訂位人姓名'
                    ]"
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
                <div class="col-sm-6 col-xs-12 q-mb-lg">
                  <q-input
                    outlined
                    v-model="form.phone"
                    :maxlength="10"
                    label="聯絡手機號碼"
                  />
                </div>
                <div class="col-sm-6 col-xs-12 q-mb-lg">
                  <q-input
                    outlined
                    v-model="form.email"
                    label="Email"
                    type="email"
                  />
                </div>
                <div class="col-12 q-mb-lg">
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
                    label="其他備註"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="關閉" color="primary" v-close-popup />
        <q-btn @click="booking" label="保存" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ["token"],
  data() {
    return {
      form: {
        adult: 2,
        children: 0,
        date: this.$dayjs().add(1, "days"),
        time: undefined,
        name: "",
        email: "",
        phone: "",
        occasion: [],
        gender: 1,
        comment: ""
      },
      dialog: true,
      loading: true,
      peopleSelect: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      timeSelect: [
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30"
      ],
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
          value: 2
        }
      ],
      occasion: ["慶生", "約會", "周年慶", "家庭用餐", "朋友聚餐", "商務聚餐"]
    };
  },

  created() {},
  watch: {},
  computed: {
    formatDate: {
      get() {
        return this.$dayjs(this.form.date).format("YYYY/MM/DD");
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
            .format("YYYY/MM/DD")
        );
      }
      return result;
    }
  },
  methods: {
    async booking() {
      if (!this.form.time) {
        return this.$q.notify({
          type: "negative",
          message: `錯誤: 請選擇預約時段!`,
          timeout: 500
        });
      }

      if (await this.$refs.contactForm.validate()) {
        this.loading = true;

        const token = btoa(this.token + ":" + new Date().getTime()).replaceAll(
          "=",
          ""
        );

        const form = {
          ...this.form,
          time: new Date(
            this.form.date.format("YYYY/MM/DD ") + this.form.time
          ).getTime(),
          token
        };
        delete form.date;
        try {
          const res = await this.$axios.post("/booking/admin/create", form);
        } catch (error) {
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
