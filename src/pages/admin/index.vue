<template>
  <q-page
    class="flex q-mx-auto column "
    style="max-width: 1600px;background-color: #fff;padding-bottom: 5vh"
  >
    <q-toolbar
      v-if="!passwordDialog"
      class="text-white"
      style="background: #8c131b"
    >
      <q-btn
        flat
        round
        dense
        icon="keyboard_backspace"
        @click="$router.replace({ path: '/' })"
        class="q-mr-sm"
      />
      <q-toolbar-title>
        訂位資訊
      </q-toolbar-title>
      <q-space />
    </q-toolbar>

    <q-toolbar inset class="text-white" style="background: #8c131b">
      <q-space />

      <q-toggle
        color="white"
        v-model="simplify"
        label="精簡"
        dense
        class="q-mr-md"
      />

      <q-separator dark vertical />
      <q-btn
        icon="schedule"
        stretch
        flat
        outline
        :label="datePickLabel"
        :disable="loading"
      >
        <q-popup-proxy
          transition-show="scale"
          transition-hide="scale"
          @before-show="updateProxy"
        >
          <q-date v-model="form.proxyDate" range>
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="取消" color="primary" flat v-close-popup />
              <q-btn
                label="保存"
                color="primary"
                flat
                @click="save"
                v-close-popup
              /></div
          ></q-date>
        </q-popup-proxy>
      </q-btn>

      <q-separator dark vertical />
      <q-btn stretch icon="book_online" flat label="新增預約" />
    </q-toolbar>

    <div class="q-pa-md" style="margin-top: -.5rem" v-if="!passwordDialog">
      <template v-for="order in booking">
        <q-table
          :key="order.label"
          grid
          :title="order.label"
          :data="getTimeOptions(order)"
          :columns="columns"
          :pagination="{ rowsPerPage: 13 }"
          row-key="name"
          hide-header
          hide-bottom
          :loading="loading"
        >
          <template v-slot:item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-4 col-md-3 col-lg-2 grid-style-transition"
            >
              <q-card>
                <q-card-section
                  class="flex row "
                  style="align-items: center;"
                  :class="{
                    'card-grey': props.row.total == 0,
                    'card-green': props.row.total >= 1 && props.row.total <= 3,
                    'card-yellow': props.row.total >= 4 && props.row.total <= 5,
                    'card-red': props.row.total >= 6
                  }"
                >
                  <div style="font-size: 1.2rem">
                    {{ props.row.label }} - {{ props.row.booking }} 組
                  </div>

                  <q-space></q-space>
                  <q-btn
                    flat
                    icon="visibility"
                    outline
                    color="primary"
                    @click="showInfo(props.row)"
                  ></q-btn>
                </q-card-section>
                <q-separator />

                <q-list dense>
                  <q-item v-for="col in props.cols" :key="col.name">
                    <q-item-section side>
                      <q-item-label caption>{{ col.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ col.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </template>
        </q-table>

        <hr :key="order.label + '_hr'" />
      </template>
    </div>

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section
          style="min-width: 328px;max-height: 70vh;"
          class="scroll"
        >
          <q-card v-for="col in data.data" :key="col.id" class="q-mb-md">
            <q-card-section class="bg-primary text-white">
              <div class="text-h6">
                {{ col.name }} {{ genderOptions[col.gender] }}
              </div>
            </q-card-section>
            <q-list dense>
              <q-item v-for="item in bookingColumns" :key="item.label">
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ col[item.name] }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="關閉" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="passwordDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">請輸入密碼</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="password" autofocus type="password" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="返回" @click="$router.replace({ path: '/' })" />
          <q-btn flat label="確定" @click="checkPassword" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <booking-dialog :token="token"> </booking-dialog>
  </q-page>
</template>
<script>
import BookingDialog from "./components/bookingDialog";
export default {
  components: { BookingDialog },
  data() {
    return {
      simplify: false,
      form: {
        date: {
          from: this.$dayjs().format("YYYY/MM/DD"),
          to: this.$dayjs().format("YYYY/MM/DD")
        },
        proxyDate: {
          from: this.$dayjs().format("YYYY/MM/DD"),
          to: this.$dayjs().format("YYYY/MM/DD")
        }
      },
      booking: [],
      data: [],
      token: "",
      passwordDialog: true,
      password: "",
      dialog: false,
      loading: true,
      columns: [
        {
          name: "label",
          label: "時段",
          align: "left",
          field: row => row.label,
          format: val => `${val}`,
          sortable: false
        },
        {
          name: "booking",
          align: "center",
          label: "組數",
          field: row => `${row.booking} 組`,
          sortable: false
        },
        {
          name: "total",
          label: "總人數",
          field: row => `${row.adult} 位大人．${row.children} 位小孩`,
          sortable: false
        }
      ],
      bookingColumns: [
        { name: "id", label: "#" },
        { name: "phone", label: "手機號碼" },
        { name: "adult", label: "大人" },
        { name: "children", label: "小孩" },
        { name: "email", label: "信箱" },
        { name: "occasion", label: "目的" },
        { name: "comment", label: "備註" }
      ],
      genderOptions: ["先生", "小姐", ""]
    };
  },

  created() {
    const token = window.localStorage.getItem("token");
    if (!token) {
      return;
    } else if (!this.testPassword(token)) {
      return;
    }
    this.token = token;
    this.simplify =
      JSON.parse(window.localStorage.getItem("simplify")) || false;

    if (
      new Date().getHours() > 15 ||
      (new Date().getHours() == 15 && new Date().getMinutes() > 30)
    ) {
      this.form.date = {
        from: this.$dayjs(this.form.date.from)
          .add(1, "day")
          .format("YYYY/MM/DD"),
        to: this.$dayjs(this.form.date.to)
          .add(1, "day")
          .format("YYYY/MM/DD")
      };
    }

    this.passwordDialog = false;
    this.getBooking();
  },
  watch: {
    "form.date"(newValue, oldValue) {
      this.getBooking();
    },
    simplify(value) {
      window.localStorage.setItem("simplify", value);
    }
  },
  computed: {
    datePickLabel() {
      if (!this.form.date) return "";
      return (
        this.$dayjs(this.form.date.from).format("MM/DD") +
        " - " +
        this.$dayjs(this.form.date.to).format("MM/DD")
      );
    }
  },
  methods: {
    updateProxy() {
      this.form.proxyDate = this.form.date;
    },

    save() {
      this.form.date = this.form.proxyDate;
    },
    getTimeOptions(data) {
      const timeOptions = [
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
      ];
      let result = timeOptions.map(time => {
        const timestamp = new Date(data.label + " " + time).getTime();
        const groupData = data.data.filter(x => x.time === timestamp);
        const adult = groupData.reduce((a, b) => a + b.adult, 0);
        const children = groupData.reduce((a, b) => a + b.children, 0);
        return {
          label: time,
          timestamp,
          data: groupData,
          booking: groupData.length,
          total: adult + children,
          adult,
          children
        };
      });

      if (this.simplify) {
        result = result.filter(x => x.data.length > 0);
      }
      return result;
    },
    testPassword(password) {
      return password === "NjchITY3Kio=";
    },
    checkPassword() {
      try {
        if (this.testPassword(btoa(this.password))) {
          this.passwordDialog = false;
          window.localStorage.setItem("token", btoa(this.password));
        } else {
          throw new Error("密碼錯誤");
        }
      } catch (error) {
        window.localStorage.removeItem("token");
        this.$q.notify({
          type: "negative",
          message: `密碼錯誤!`,
          timeout: 500
        });
      }
    },
    showInfo(data) {
      this.dialog = true;
      this.data = data;
    },
    async getBooking() {
      this.loading = true;
      const token = btoa(this.token + ":" + new Date().getTime()).replaceAll(
        "=",
        ""
      );

      const startAt = this.$dayjs(this.form.date.from);
      const endAt = this.$dayjs(this.form.date.to);
      const res = await this.$axios.post("/booking/admin", {
        token,
        startAt: startAt.toDate().getTime(),
        endAt: endAt.toDate().getTime()
      });

      let data = [];
      const selectDays = endAt.subtract(startAt).date();
      for (let i = 0; i < selectDays; i++) {
        data.push({
          label: startAt.add(i, "day").format("YYYY/MM/DD"),
          data: []
        });
      }

      res.data.data.forEach(x => {
        const dayString = this.$dayjs(x.time).format("YYYY/MM/DD");
        const index = data.findIndex(x => x.label === dayString);
        data[index].data.push(x);
      });

      this.booking = data;
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.card-grey {
  background: #e8e8e8;
}
.card-yellow {
  background: yellow;
}
.card-green {
  background: greenyellow;
}
.card-red {
  background: #f44336;
  color: #fff;
}
</style>
