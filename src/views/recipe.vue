<template>
  <div class='recipe-content'>
    <form action="/">
      <van-search
        v-model="searchVal"
        placeholder="请输入处方号、患者、手机号码"
        show-action
        @search="onSearch"
        shape="round"
      >
        <div slot="action" @click="rightModuleShow = !rightModuleShow"><van-icon name="filter-o" v-if='$route.params.type == "normal"'/>
        </div>
      </van-search>
    </form>
    <van-popup v-model="rightModuleShow" position="right" :overlay="true">
      <div class="right-module">
        <van-row class="btn-group">
          <van-col span="24">
            <span class="btn-group-label">上传类型：</span>
          </van-col>
          <van-col span="24">
            <van-row type="flex" >
              <van-col span="8" v-for='(item, index) in recipeType'>
                <button type="default" class="km-btn-nobg-default" 
                :class=" recipeTypeVal == item.name && recipeTypeVal !== ''? 'active-radio km-btn-nobg-default' : 'km-btn-nobg-default'"
                @click='recipeTypeVal = item.name'>{{item.text}}</button>
              </van-col>
            </van-row>
          </van-col>
        </van-row>
        <Public-From label="来源渠道" :columns='sourceSelectData' pickerRef='source' @picker-confirm='getSourceVal' type="select" ref='sourceNode'/>
         <Public-From label="子渠道 / 医疗机构" :columns='childrenSelectData' pickerRef='childrenNode' ref='childrenNode' type="select" @picker-confirm='(obj)=> {
           childrenSelectVal = obj.code
         }'/>
        <Public-From label="上传时间范围" ref='date'  type="time" @put-start-val='(val) => {
          startTime = val;
        }' @put-end-val='(val) => {
          endTime = val;
        }'/>
        <van-row class="btn-group">
          <van-col span="24">
            <van-row type="flex" >
              <van-col span="8"><button class="km-btn-boder-large" @click='reset'>重置</button></van-col>
              <van-col span="8"><button class="km-btn-boder-large" style='color:#0bccd1' @click='rightModuleClick'>搜索</button></van-col>
            </van-row>
          </van-col>
        </van-row>
      </div>
    </van-popup>
    <van-row type="flex" class='radio-group' v-if='$route.params.type == "normal"'>
      <van-col span="6" v-for='(item, index) in selectBtnGroup'   :class=" selectVal == item.name ? 'active-radio radio-item' : 'radio-item'">
        <span @click='radioClick(item.name)'>
          {{item.text}}
        </span>
      </van-col>
    </van-row>
    <van-panel v-for='(item, index) in panelData' style='margin-top:1.4vh' @click='auditDeatil(item)'>
      <div slot="header" class='panel-header'>
        <van-icon name="passed" class='pandel-header-icon'/>
        <span class='pandel-header-title'>处方单</span>
        <van-tag size="large" class="panel-header-status" color="#0bccd1" v-if="item.status == 1">待审核</van-tag>
        <van-tag size="large" class="panel-header-status" color="#f47979" v-else-if="item.status == 2">已拒绝</van-tag>
        <van-tag size="large" class="panel-header-status" color="#d9d9d9" v-else="item.status == 3">已完成</van-tag>
        <span class='pandel-remark'>{{item.createTime}}</span>
      </div>
      <div slot="footer" class='panel-footer'>
          <van-row type="flex">
            <van-col span="24">
              <span class='panel-footer-label'>处方号：</span>{{item.recipeNum}}
            </van-col>
          </van-row>
          <van-row type="flex">
            <van-col span="15">
              <span class='panel-footer-label'>患者姓名：</span>{{item.patientName}}
            </van-col>
            <van-col span="9">
              <span class='panel-footer-label'>开方医生：</span>{{item.billDoctor}}
            </van-col>
          </van-row>
          <van-row type="flex">
            <van-col span="15">
              <span class='panel-footer-label'>处方类型：
                <span v-if='item.recipeType == 1'>西药</span>
                <span v-else-if='item.recipeType == 2'>中成药</span>
                <span v-else-if='item.recipeType == 3'>中草药 - 
                  <span v-if='item.recipeTypeCn == 0'>
                    中药
                  </span>
                  <span v-else-if='item.recipeTypeCn == 1'>
                    西药或中成药
                  </span>
                  <span v-else-if='item.recipeTypeCn == 2'>
                    膏方
                  </span>
                  <span v-else-if='item.recipeTypeCn == 3'>
                    丸剂
                  </span>
                  <span v-else-if='item.recipeTypeCn == 5'>
                    散剂
                  </span>
                  <span v-else-if='item.recipeTypeCn == 6'>
                    固定膏方
                  </span>
                </span>
              </span>
            </van-col>
            <van-col span="9">
              <span class='panel-footer-label' v-if='item.machineStatus == 1'>机审状态：1级</span>
              <span class='panel-footer-label' v-else-if='item.machineStatus == 2'>机审状态：2级</span>
              <span class='panel-footer-label' v-else-if='item.machineStatus == 3'>机审状态：3级</span>
              <span class='panel-footer-label' v-else>机审状态：审核通过</span>
            </van-col>
          </van-row>
          <van-row type="flex">
            <van-col span="24">
              <span class='panel-footer-label'>处方来源：</span>{{item.requestSourceTypeName}}-{{item.childChannelCodeName}}
            </van-col>
          </van-row>
      </div>
    </van-panel>
    <van-loading type="spinner" class='public-loading' v-show='loadingShow'/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PublicFrom from '@/components/PublicFrom.vue'
import util from '@/util'
import qs from 'qs'
@Component({
  components: {
    PublicFrom
  }
})
export default class Recipe extends Vue {
  private selectVal: any = 1 // 状态值
  private rightModuleShow: boolean = false
  private searchVal: string | number = '' // 搜索框值
  private panelData:any = [] // 面板数据
  private pageNum:number = 1 // 页数
  private loadingShow: boolean = true
  private recipeTypeVal: string | number = '' // 上传类型
  private sourceSelectData: any = [] //来源渠道
  private sourceSelectVal: any = ''
  private childrenSelectData: any = [] // 子渠道
  private childrenSelectVal: any = ''
  private startTime: any = '' //起始时间
  private endTime: any = '' //起始时间
  private pageTotal: number = 0;
  private recipeType: any[] = [{
    text: '拍方上传',
    name: 1
  },{
    text: '电子处方',
    name: 0
  }]
  private selectBtnGroup: any[] = [{
    name: '1',
    text: '待审核'
  }, {
    name: '2',
    text: '已拒绝'
  }, {
    name: '3',
    text: '已完成'
  }, {
    name: '',
    text: '全部'
  }]
  private apis:object = {
    '/recipe/normal': {
      api: 'prescription/precision/recipes/recipe/list',
    },
    '/recipe/question': {
      api: 'prescription/precision/recipes/recipe/unqualified-list'
    }
  }
  activated() {
   this.loadingShow = false; 
  }
  onSearch (val:any) {
    this.searchVal = val;
    this.pageNum = 0;
    this.panelData = [];
    this.pageTotal = 0;
    this.getPanelData('clear');
  } // 头部搜索
  radioClick (name: string | number) {
    this.pageNum = 1;
    this.selectVal = name;
    // this.panelData = [];
    this.pageTotal = 0;
    this.getPanelData('clear'); // 点击切换数据源
  } // 头部单选
  getPanelData (option ?: string):any {
    this.loadingShow = true;
    option === 'clear' && (this.panelData = []);
    if (this.pageTotal > 0 && (Math.ceil(this.pageTotal / 10) < this.pageNum) && this.$toast('没有更多数据了')) {
      this.loadingShow = false;
      return;
    }
    this.$post((this as any).apis[process.env.NODE_ENV == 'dev' ?  this.$route.path : util.getUrlParams().type].api, this.$route.params.type == 'normal' ? {
      pageNum: this.pageNum,
      pageSize: 10,
      status: this.selectVal,
      searchValue: this.searchVal,
      prescriptionType: this.recipeTypeVal, // 上传类型
      requestSourceType: this.sourceSelectVal,
      uploadStartDate: this.startTime,
      uploadEndDate: this.endTime,
      childChannelCode: this.childrenSelectVal,
      orderByColumn: 'createTime',
      isAsc: 'desc',
    } : {
      pageNum: this.pageNum,
      pageSize: 10,
      orderByColumn: 'billDate',
			isAsc: 'desc',
      searchValue: this.searchVal,
    }, {
      headers: {
        "Content-Type" : 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      transformRequest:  [function (data:any) {
        data = qs.stringify(data)
        return data;
      }],
    }).then((res:any):any => {
      this.loadingShow = false;
      this.pageTotal = res.data.data.total;
      this.panelData = this.panelData.concat(res.data.data.rows);
      console.log(this.panelData)
      if ((this.panelData.length <= 0) || (res.data.data.rows.length <= 0)) {
        this.$toast('没有更多数据啦');
        this.panelData = [];
      }
    }).catch((req:any):any => {
      this.loadingShow = false;
    })
  } // 获取面板数据
  getSourceVal (obj:any) {
    this.sourceSelectVal = obj.code;
    this.childrenSelectVal = '';
    (this as any).$refs.childrenNode['inpVal'] = '';  // 清空子级输入框内容
    console.log(obj)
    this.$post(`prescription/prePrescriptionChannel/getChildChannelByParentChannelCode?code=${obj.code}`).then((res: any):any => {
      this.childrenSelectData = res.data.data.map((item:any) => {
        item.text = item.name;
        return item
      });
    })
  } // 选择来源渠道
  reset () {
    this.pageNum = 1;
    this.pageTotal = 0;
    this.recipeTypeVal = '';
    this.startTime = '';
    this.endTime = '';
    this.sourceSelectVal = '';
    this.childrenSelectVal = ''; 
    (this as any).$refs.childrenNode['inpVal'] = ''; 
    (this as any).$refs.sourceNode['inpVal'] = ''; 
    (this as any).$refs.date['startTime'] = '';
    (this as any).$refs.date['endTime'] = '';
    this.getPanelData('clear');
  }
  rightModuleClick () {
    this.panelData = [];
    this.pageTotal = 0;
    this.getPanelData();
  }
  auditDeatil (obj: any) {
    this.$router.push({
      name: 'recipe-detail',
      // params: {
      //   option: obj
      // },
      query: {
        uId: obj.uId,
        sourceType: this.$route.params.type,
        sourceStatus: obj.status
      }
    })
  }
  mounted() {
    this.getPanelData();
    this.$route.path == '/recipe/normal' && this.$post('prescription/prePrescriptionChannel/getParentChannelByUserId').then((res: any):any => {
      this.sourceSelectData = res.data.data.map((item:any) => {
        item.text = item.name;
        return item
      });
    }) // 请求来源
    let _this = this;
    window.onscroll = () => {
      if(this.$route.params.type == 'normal' || this.$route.params.type == 'question') {
        let Allheight = document.documentElement.scrollHeight || document.body.scrollHeight;
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;;
        let viewHeight = document.documentElement.clientHeight || document.body.clientHeight;
        if (scrollTop + viewHeight == Allheight) {
          _this.pageNum++;
          _this.getPanelData();
        }
      }
    }
  }
}
</script>
<style lang="scss">
  $km-border-color: solid 0.1vw #0bccd1;
  $km-public-color: #0bccd1;
  @media screen and (max-width:350px){
    .panel-header .pandel-remark {
      margin-left: 5vw !important;
    }
  }
  .active-radio {
    background-color: $km-public-color;
	  border: $km-border-color;
    color: white !important;
  }
  .radio-group {
    width: 100vw;
    height: 10vw;
    background:white;
    margin-top: 2vw;
    border-top: $km-border-color;
    border-bottom: $km-border-color;
    .radio-item {
      height:100%;
      position: relative;
      z-index: 999;
      font-family: PingFang-SC-Medium;
      font-size: 4.3vw;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0vw;
      color: $km-border-color;
      text-align: center;
      line-height: 10vw;
      border-right: $km-border-color;
    }
    .radio-item:last-child{border:none}
  }
  .recipe-content .van-search .van-icon, .pandel-header-icon{
    color: $km-public-color;
  }
  .panel-header {
    height:12.8vw;
    .pandel-header-title, .pandel-header-icon {
        font-size: 4.3vw;
        height: 100%;
        display: inline-block;
        line-height: 12.8vw;
        vertical-align: middle;
    }
    .pandel-header-title, .pandel-header-icon, .panel-header-status {
        margin-left: 4vw;
    }
    .pandel-remark {
      font-size: 3.2vw;
      color: #999999;
      margin-left: 23vw
    }
  }
  .panel-footer {
    font-size: 3.7vw;
    color: #999999;
    .panel-footer-label {
      color: #4d4d4d;
    }
    .van-row {
      padding-top: 2.8vh
    }
    .van-row:first-child {padding-top: 0px}
  }
  .right-module {
    height: 100vh;
    width: 80vw;
  } 
  .btn-group{
    > .van-col {
      padding: 4.1vw 0vw 0vw 4vw
    }
    .btn-group-label {
      font-family: PingFang-SC-Medium;
      font-size: 3.7vw;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0vw;
      color: $km-border-color;
    }
}
</style>