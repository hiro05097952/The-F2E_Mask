<template>
  <div class="category" :class="{'close' : !isOpen}">
    <div class="search city-selector-set">
      <select name="country" class="country" v-model="selected.country"
      @change="selected.dist = null">
        <option
          :value="item"
          v-for="(item, index) in country" :key="index"
        >
          {{ item }}
        </option>
      </select>
      <select name="dist" class="dist" v-model="selected.dist"
      @change="passLatLng">
        <option :value="null" selected>-- 請選擇 --</option>
        <option
          v-for="(item, index) in dist"
          :key="index"
          :value="item"
        >
          {{ item }}
        </option>
      </select>
      <p>
        有取得口罩數量的藥局有
        <span>
          {{ list.filter(item => item.mask_child || item.mask_adult).length }}
        </span>
        家
      </p>
    </div>
    <ul class="list">
      <li v-for="(item, index) in list" :key="index"
      @click="moveToDragStore(item.geometry.coordinates)">
        <h3>{{item.properties.name}}</h3>
        <p><i class="icon_pin"></i>{{item.properties.address}}</p>
        <p><i class="icon_tel"></i>{{item.properties.phone}}</p>
        <div class="noteWrap">
          <i class="icon_remark"></i>
          <span>{{item.properties.note}}</span>
        </div>
        <div class="btnWrap">
          <button :class="{'soldout': !item.properties.mask_adult}">
            成人：{{item.properties.mask_adult | mask}}
          </button>
          <button :class="{'soldout': !item.properties.mask_child}">
            兒童：{{item.properties.mask_child | mask}}
          </button>
        </div>
      </li>
    </ul>
    <button class="toggleBtn" @click="isOpen = !isOpen">
      <i class="icon_arrow" :class="{'close' : !isOpen}"></i>
    </button>
  </div>
</template>

<script>
/* eslint-disable camelcase */
export default {
  name: 'searchBar',
  props: {
    properties: Array,
  },
  data() {
    return {
      isOpen: true,
      twCity: [],
      api: [],
      selected: {
        country: '台北市',
        dist: null,
      },
    };
  },
  created() {
    this.getAPI();
    this.getCountry();
  },
  methods: {
    async getAPI() {
      const { data } = await this.axios.get('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR14GsJ3L_SUQSTO1F9ru1pydJrv2t9KJA5xQqqhw5Fode7Y7VGubLGjnBM');
      // console.log('api =>', data);
      this.api = Object.freeze(data.features);
    },
    async getCountry() {
      try {
        const { data } = await this.axios.get('./latlng.json');
        this.twCity = data;
        // console.log('tw =>', data);
      } catch (err) {
        console.log(err);
      }
    },
    passLatLng() {
      if (!this.selected.dist) {
        return;
      }
      const apiPassArr = this.api
        .filter(item => item.properties.address.includes(this.selected.country)
        && item.properties.address.includes(this.selected.dist));
      this.$emit('pass-evt', apiPassArr);
    },
    moveToDragStore(arr) {
      if (!this.selected.country || !this.selected.dist) {
        return;
      }
      this.$emit('pass-move-drag', arr);
    },
  },
  computed: {
    country() {
      return this.twCity
        .map(item => item.city)
        .filter((item, index, arr) => arr.indexOf(item) === index);
    },
    dist() {
      return this.twCity
        .filter(item => item.city === this.selected.country)
        .map(item => item.district)
        .filter((item, index, arr) => arr.indexOf(item) === index);
    },
    list() {
      return this.api.filter((item) => {
        if (!this.selected.dist) {
          return item.properties.address.includes(this.selected.country);
        }
        return item.properties.address.includes(this.selected.country)
        && item.properties.address.includes(this.selected.dist);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '@/assets/scss/index';
</style>
