<template>
    <div class="drug-detail">
        <van-cell class="title">药品说明书</van-cell>
        <van-cell v-for="item in list" :key="item.code" class="detailList">
            <div>
                <van-row class="title">{{item.subtitle}}</van-row>
                <van-row>{{item.name}}：</van-row>
                <van-row class="model">{{item.describe}}</van-row>
            </div>
        </van-cell>
        <van-loading type="spinner" class="public-loading" v-show="loadingShow"/>
    </div>
</template>
<script lang='ts'>
import { queryDrugLink } from "@/api";
import { Vue, Component } from "vue-property-decorator";
@Component
export default class DrugDeatil extends Vue {
    private list: any[] = [];
    private loadingShow: boolean = false;

    created() {
        this.getDetail();
    }
    async getDetail() {
        this.loadingShow = true;
        let myThis:any = this
        try {
            let data:any = await queryDrugLink({
                drugName: this.$route.query.drugName,
                drugCode: this.$route.query.drugCode
            });
            this.list = data.data.data;
            this.loadingShow = false;
        } catch (error) {
            this.loadingShow = false;
        }
    }
}
</script>

<style lang="scss">
.drug-detail {
    background: #f7f8fa;
    .title .van-cell__value--alone {
        text-align: center;
        font-size: 16px;
    }
    .detailList {
        margin-top: 0.4vh;
    }
}
</style>