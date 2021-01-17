<template>
  <q-page
    class="flex q-mx-auto column "
    style="max-width: 1600px;background-color: #fff;padding-bottom: 5vh"
  >
    <q-header elevated>
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
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>

        <q-separator dark vertical />
        <q-btn
          stretch
          icon="open_in_new"
          @click="openCreateDialog(false)"
          flat
          label="新增預約"
        />

        <q-separator dark vertical />
        <q-btn class="q-ml-sm" flat round dense icon="more_vert">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-ripple @click="exportCSV">
                <q-item-section avatar>
                  <q-icon color="primary" name="open_in_new" />
                </q-item-section>

                <q-item-section>匯出資料</q-item-section>
              </q-item>

              <q-item v-ripple>
                <q-item-section avatar>
                  <q-toggle color="primary" v-model="simplify" dense />
                </q-item-section>
                <q-item-section>
                  精簡模式
                </q-item-section>
              </q-item>
            </q-list>
            <div
              style="color: rgb(142, 142, 142);text-align: right;padding-right: 1rem;padding-bottom: .5rem;"
            >
              v{{ version }}
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

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
          <template v-slot:top>
            <div class="col-2 q-table__title">{{ order.label }}</div>

            <q-space />

            <q-btn
              label="本日休息"
              color="primary"
              @click="setDayOff(order.label)"
              :disable="order.data.some(x => x.status === 'DayOff')"
            />
          </template>
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
                    {{ props.row.label }}
                  </div>

                  <q-space></q-space>
                  <q-btn
                    flat
                    icon="add"
                    outline
                    color="primary"
                    @click="openCreateDialog(props.row.timestamp)"
                  />
                  <q-btn
                    icon="visibility"
                    flat
                    outline
                    color="primary"
                    :disable="props.row.booking === 0"
                    @click="showInfo(props.row)"
                    style="margin-right: -.7rem;"
                  />
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
      <q-card style="min-width: 368px;max-width: 90vw;">
        <q-card-section class="scroll" style="max-height: 70vh;">
          <q-card
            v-for="col in data.data"
            :key="col.id"
            class="q-mb-md"
            bordered
            flat
          >
            <q-card-section class="bg-primary text-white">
              <div class="flex row text-h6">
                {{ col.name }} {{ genderOptions[col.gender] }}
                <q-space />
                <q-btn
                  color="negative"
                  class="q-mr-sm"
                  @click="openEditForm(col)"
                >
                  編輯
                </q-btn>
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

    <booking-dialog
      v-if="createDialog"
      @close-dialog="closeDialog"
      :dialog.sync="createDialog"
      :data="editForm"
      :token="token"
    />
  </q-page>
</template>
<script>
import { ExportToCsv } from "export-to-csv";

import BookingDialog from "./components/bookingDialog";
import { version } from "../../../package.json";

export default {
  components: { BookingDialog },
  data() {
    return {
      simplify: false,
      form: {
        date: this.$dayjs().format("YYYY/MM/DD"),
        proxyDate: this.$dayjs().format("YYYY/MM/DD")
      },
      booking: [],
      data: [],
      editForm: {},
      token: "",
      passwordDialog: true,
      createDialog: false,
      password: "",
      version,
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
      genderOptions: ["小姐", "先生", ""]
    };
  },

  created() {
    const token = window.localStorage.getItem("token");
    if (!token || !this.testPassword(token)) {
      return;
    }
    this.token = token;
    this.simplify =
      JSON.parse(window.localStorage.getItem("simplify")) || false;

    if (
      new Date().getHours() > 15 ||
      (new Date().getHours() == 15 && new Date().getMinutes() > 30)
    ) {
      this.form.date = this.$dayjs(this.form.date.from)
        .add(1, "day")
        .format("YYYY/MM/DD");
    }

    this.passwordDialog = false;
    this.getBooking();
  },
  watch: {
    "form.date"(value) {
      this.getBooking();
    },
    simplify(value) {
      window.localStorage.setItem("simplify", value);
    }
  },
  computed: {
    datePickLabel() {
      if (!this.form.date) return "";
      if (typeof this.form.date === "string") {
        return this.$dayjs(this.form.date).format("MM/DD");
      }

      const startAt = this.$dayjs(this.form.date.from);
      const endAt = this.$dayjs(this.form.date.to);

      return startAt.format("MM/DD") + " - " + endAt.format("MM/DD");
    },
    tokenString() {
      return btoa(
        unescape(
          encodeURIComponent(this.token + ":" + new Date().getTime()).replace(
            /=/g,
            ""
          )
        )
      );
    }
  },
  methods: {
    exportCSV() {
      const rows = this.booking.reduce((a, b) => {
        b.data
          .filter(x => x.status !== "DayOff")
          .sort((a, b) => a.time - b.time)
          .forEach(data => {
            a.push({
              date: b.label,
              time: this.$dayjs(data.time).format("HH:mm"),
              name: data.name,
              gender: this.genderOptions[data.gender],
              adult: data.adult,
              children: data.children,
              email: data.email,
              phone: `="${data.phone}"`,
              occasion: data.occasion.length > 0 ? `="${data.occasion}"` : "",
              comment: data.comment.length > 0 ? `="${data.comment}"` : ""
            });
          });
        return a;
      }, []);

      const csvExporter = new ExportToCsv({
        showLabels: true,
        useTextFile: false,
        filename: `booking-${this.datePickLabel}`,
        useBom: true,
        headers: [
          "日期",
          "時間",
          "姓名",
          "性別",
          "大人",
          "小孩",
          "信箱",
          "電話",
          "目的",
          "備註"
        ]
      });

      csvExporter.generateCsv(rows);
    },
    openCreateDialog(time) {
      if (time) {
        const date = this.$dayjs(time);
        this.editForm = {
          date,
          time: date.format("hh:mm")
        };
      }
      this.createDialog = true;
    },
    closeDialog(reload = false) {
      this.createDialog = false;
      this.dialog = false;
      this.editForm = {};
      if (reload) {
        this.getBooking();
      }
    },
    updateProxy() {
      this.form.proxyDate = this.form.date;
    },

    save() {
      if (!this.form.proxyDate) return;
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
    setDayOff(day) {
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
      const form = {
        adult: 99,
        children: 99,
        time: undefined,
        status: "DayOff",
        name: "",
        email: "",
        phone: "",
        occasion: [],
        gender: 1,
        comment: "[本日休息]",
        token: this.tokenString
      };
      const data = timeOptions.map(x => ({
        ...form,
        time: new Date(`${day} ${x}`).getTime()
      }));
      this.$q
        .dialog({
          title: "本日休息設定",
          message: "是否要取消開放當日預約?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          this.loading = true;

          for (let i = 0; i < data.length; i++) {
            try {
              await this.$axios.post("/pd/booking", data[i]);
            } catch (error) {
              this.$q.notify({
                type: "negative",
                message: `伺服器繁忙, 請稍後重試!`,
                timeout: 500
              });
            }
          }
          this.loading = false;
          this.getBooking();
        });
    },
    openEditForm(form) {
      this.createDialog = true;
      this.editForm = {
        id: form.id,
        adult: form.adult,
        children: form.children,
        date: this.$dayjs(form.time),
        time: this.$dayjs(form.time).format("HH:mm"),
        name: form.name,
        email: form.email,
        phone: form.phone,
        occasion: form.occasion,
        gender: form.gender,
        comment: form.comment
      };
    },
    checkPassword() {
      try {
        if (this.testPassword(btoa(this.password))) {
          this.passwordDialog = false;
          window.localStorage.setItem("token", btoa(this.password));

          window.location.reload();
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

      const token = btoa(
        unescape(
          encodeURIComponent(this.token + ":" + new Date().getTime()).replace(
            /=/g,
            ""
          )
        )
      );
      let startAt, endAt;
      if (typeof this.form.date === "string") {
        startAt = this.$dayjs(this.form.date);
        endAt = this.$dayjs(this.form.date);
      } else {
        startAt = this.$dayjs(this.form.date.from);
        endAt = this.$dayjs(this.form.date.to);
      }
      const res = await this.$axios.post("/pd/booking/list", {
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
