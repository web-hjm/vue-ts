<template>
    <div class="drug-search-content">
        <form action="/">
            <van-search v-model="searchValue" placeholder="请输入搜索关键词" show-action @search="searchBtn">
                <div slot="action" @click="searchBtn">搜索</div>
            </van-search>
        </form>

        <van-cell v-for="item in list" :key="item.code" class="drugList" @click.native="toDetail(item)">
            <div>
                <van-row class="title">{{item.subtitle}}</van-row>
                <van-row>商品名: {{item.name}}</van-row>
                <van-row class="model">规格： {{item.model}}</van-row>
            </div>
        </van-cell>
        <van-loading type="spinner" class="public-loading" v-show="loadingShow"/>
    </div>
</template>
<script lang='ts'>
import { getDruByName } from "@/api";
import { Vue, Component, Watch } from "vue-property-decorator";
@Component
export default class DrugSearch extends Vue {
    private searchValue: any = "";
    private list: any[] = [];
    private loadingShow: boolean = false;
    private tag: boolean = true;
    async searchBtn() {
        if (this.tag) {
            this.tag = false;
            this.loadingShow = true;
            try {
                let data = await getDruByName({
                    name: this.searchValue
                });
                this.list = data.data.data;
                this.loadingShow = false;
                this.tag = true;
            } catch (error) {
                this.tag = true;
                this.loadingShow = false;
            }
        }
    }
    toDetail(data:any){
        this.$router.push({
            path:'/drug-detail',
            query:{
                drugCode:data.uId,
                drugName:data.name
            }
        })        
    }
}
</script>
<style lang="scss">
$km-border-color: solid 0.1vw #0bccd1;
$km-public-color: #0bccd1;
.drug-search-content {
    background: #f7f8fa;
    .van-icon-search {
        color: $km-public-color;
    }
    .van-search__action {
        color: $km-public-color;
    }
    .model {
        font-size: 14px;
    }
    .title {
        font-weight: bold;
    }
    .drugList{
        margin-top: 1.4vh;
    }
}
</style>