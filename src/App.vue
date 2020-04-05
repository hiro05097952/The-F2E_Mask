<template>
  <div id="app">
    <searchBar
      @pass-evt="listMask"
      @pass-move-drag="moveDrag"
    >
    </searchBar>
    <l-map
      :center="center"
      :zoom="zoom"
      :options="{zoomControl: false}"
      style="height: 100%; width: 100%"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-control-zoom position="topright"></l-control-zoom>
      <v-marker-cluster>
        <l-marker
          v-for="(item, index) in list" :key="index"
          :lat-lng="[item.geometry.coordinates[1], item.geometry.coordinates[0]]"
        >
          <l-popup>
            <h3>{{item.properties.name}}</h3>
            <p><i class="icon_pin"></i>{{item.properties.address}}</p>
            <p><i class="icon_tel"></i>{{item.properties.phone}}</p>
            <div class="noteWrap">
              <i class="icon_remark"></i>
              <span>{{item.properties.note}}</span>
            </div>
            <div class="btnWrap">
              <button :class="{'soldout': !item.properties.mask_adult}">
                成人：{{ item.properties.mask_adult | mask }}
              </button>
              <button :class="{'soldout': !item.properties.mask_child}">
                兒童：{{ item.properties.mask_child | mask }}
              </button>
            </div>
          </l-popup>
        </l-marker>
      </v-marker-cluster>
    </l-map>
  </div>
</template>

<script>
import {
  LMap, LTileLayer, LMarker, LControlZoom, LPopup,
} from 'vue2-leaflet';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
import searchBar from './components/searchBar.vue';


export default {
  name: 'app',
  components: {
    searchBar,
    LMap,
    LTileLayer,
    LMarker,
    LControlZoom,
    LPopup,
    'v-marker-cluster': Vue2LeafletMarkerCluster,
  },
  data() {
    return {
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      center: [23.8759391, 120.588669],
      zoom: 8,
      bounds: null,
      list: [],
    };
  },
  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    listMask(passArr) {
      // console.log(passArr);
      this.list = passArr;
      this.center = [passArr[0].geometry.coordinates[1], passArr[0].geometry.coordinates[0]];
      this.zoom = 13;
      setTimeout(() => {
        this.center = [passArr[0].geometry.coordinates[1], passArr[0].geometry.coordinates[0]];
      }, 500);
    },
    moveDrag(passArr) {
      this.zoom = 18;
      this.center = [passArr[1], passArr[0]];
    },
  },
  computed: {
    markList() {
      const markArr = this.list.map(item => item.geometry.coordinates);
      return markArr;
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/scss/helpers/_reset';
@import "@/assets/scss/helpers/_breakpoint";
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

html, body{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app{
  width: 100%;
  height: 100%;
}
.leaflet-popup-content-wrapper{
  border: 2px solid #668AFE;
  padding: 0;
  div.leaflet-popup-content{
    margin: 0;
    width: 340px;
    padding: 20px 20px 15px;
    box-sizing: border-box;
    h3{
      color: #333333;
      font-size: 18px;
      margin-bottom: 10px;
      letter-spacing: 1.5px;
    }
    p{
      font-size: 14px;
      color: #888888;
      margin: 0 0 8px 0;
      letter-spacing: 1px;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
    }
    ::-webkit-scrollbar{
      display: none;
    }
    span{
      color: #888888;
      letter-spacing: 0.5px;
      line-height: 20px;
      font-size: 14px;
      width: calc(100% - 15px);
    }
    .noteWrap{
      display: flex;
      align-items: baseline;
    }
  }
  .btnWrap{
    margin-top: 10px;
  }
  button{
    padding: 12px 0;
    width: 49%;
    color: white;
    background: #668AFE;
    border-radius: 0 5px 5px 0;
    border: none;
    letter-spacing: 1px;
    outline: none;
    user-select: none;
    font-size: 14px;
    max-width: 49%;
    max-height: 44px;
    &.soldout{
      background: #E2E2E2;
      color: #9C9C9C;
    }
    &:nth-child(1){
      border-radius: 5px 0 0 5px;
      margin-right: 1px;
    }
    &.toggleBtn{
      position: absolute;
      top: 0;
      bottom: 0;
      right: -18px;
      border-radius: 0 12px 12px 0;
      margin: auto;
      width: 18px;
      height: 48px;
      padding: 13px 1.2px;
      cursor: pointer;
      transition: transform .3s;
      &:hover{
        transform: scale(1.2) translateX(2px);
      }
    }
  }
  i{
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 10px;
    transform: translateY(2px);
    &.icon_pin{
      background: url('~@/assets/pin.svg') center center / contain no-repeat;
    }
    &.icon_tel{
      background: url('~@/assets/tel.svg') center center / contain no-repeat;
    }
    &.icon_remark{
      background: url('~@/assets/remark.svg') center center / contain no-repeat;
      filter: invert(63%) sepia(5%) saturate(26%) hue-rotate(326deg) brightness(85%) contrast(85%);
    }
    &.icon_arrow{
      height: 20px;
      filter: invert(1);
      background: url('~@/assets/arrow.svg') center center / cover no-repeat;
      transition: all .5s;
      &.close{
        transform: rotate(180deg);
      }
    }
  }
  &::before{
    content: '';
    position: absolute;
    bottom: -11px;
    left: 0;
    right: 0;
    margin: auto;
    width: 21px;
    height: 21px;
    background: white;
    border: 2px solid #668AFE;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg);
  }
}
.leaflet-popup-close-button{
  margin: 5px 5px 0 0;
}
@include rwd(576px) {
  .leaflet-popup-content-wrapper{
    div.leaflet-popup-content{
      max-width: 280px;
      padding: 15px 20px 10px 20px;
      h3{
        font-size: 16px
      }
    }
    button{
      padding: 8px 0;
      font-size: 12px;
    }
  }
}
</style>
