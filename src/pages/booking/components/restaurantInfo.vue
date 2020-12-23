<template>
  <div class="row q-col-gutter-lg">
    <div class="col-xs-12 col-sm-7">
      <iframe
        width="100%"
        height="100%"
        frameborder="0"
        style="border:0"
        :src="
          `https://www.google.com/maps/embed/v1/place?key=AIzaSyDo2x7y_CQ1kKCoO0PCVqEzmhrgsfa0_6g&q=${restaurantInfo.address}`
        "
        allowfullscreen
      >
      </iframe>
    </div>
    <div class="col-xs-12 col-sm-5">
      <div
        class="flex items-center subtitle"
        style="color:#2d333f;font-size: 1.1rem;"
      >
        <q-icon class="q-mr-sm" name="map" />
        <span> 位置</span>
      </div>
      <div style="font-size: 1rem">{{ restaurantInfo.address }}</div>
      <hr />

      <div
        class="flex items-center subtitle"
        style="color:#2d333f;font-size: 1.1rem;"
      >
        <q-icon class="q-mr-sm" name="phone" />
        <span> 聯絡電話</span>
      </div>
      <div style="font-size: 1rem">{{ restaurantInfo.phone }}</div>
      <hr />
      <div
        class="flex items-center subtitle"
        style="color:#2d333f;font-size: 1.1rem;"
      >
        <q-icon class="q-mr-sm" name="today" />
        <span> 營業時間</span>
      </div>
      <div style="font-size: 1rem">{{ restaurantInfo.opening }}</div>
      <hr />
      <div
        class="flex items-center subtitle"
        style="color:#2d333f;font-size: 1.1rem;"
      >
        <q-icon class="q-mr-sm" name="fastfood" />
        <span> 料理類型</span>
      </div>
      <div style="font-size: 1rem">{{ restaurantInfo.type }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RestaurantInfo",
  computed: {
    restaurantInfo() {
      return this.$store.state.restaurant.info;
    }
  }
};
</script>
