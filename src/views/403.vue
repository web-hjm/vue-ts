<template>
  <div class='un-jurisdiction'>
    <p class='un-jurisdiction-cause'>抱歉，您暂无权限访问该页面</p>
  </div>
</template>
<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';
@Component
export default class UnJurisdiction extends Vue {
}
</script>
<style lang="scss">
    .un-jurisdiction-cause {
        position: absolute;
        top:40%;
        left:23vw;
        font-weight: 600;
    }
</style>
