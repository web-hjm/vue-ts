<template>
  <div id="app">
     <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

@Component
export default class App extends Vue {
  mounted() {
  }
}
</script>
<style lang="scss">
@import url('./assets/common.scss')
</style>
