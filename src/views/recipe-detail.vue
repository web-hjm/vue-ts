<template>
  <div class='recipe-detail-content'>
    <van-steps direction="vertical" class="recipe-detatil-progress" v-show='detailData && progressData'>
      <span>上一步：{{getPreStatus(progressData.handleStatus, progressData.isAuditAgain)}}</span>
      <span style='margin-left:19.7vw'>{{progressData.handleTime || ""}}</span>
        <van-step>
          <div @click='$router.push({name: "progress-audit",query: {uId: $route.query.uId, prescriptionType: detailData.prescriptionType, billDoctor: detailData.billDoctor}})'>
            <p v-if='(progressData.handleStatus== 30 && (detailData.machineStatus == 1 || detailData.machineStatus == 2 || detailData.machineStatus == 3))'>审核状态：{{detailData.machineStatus || ''}}级</p>
            <p v-if='progressData.handleStatus != 30'>{{progressData.handlerRealName || progressData.billDoctor || ""}}</p>
            <p v-if='(progressData.handleStatus== 30 && (progressData.machineStatus == 1 || progressData.machineStatus == 2 || progressData.machineStatus == 3)) || (progressData.handleStatus== 41 || progressData.handleStatus== 60)'>
            未通过原因：{{ progressData.handleStatus != '30' ? detailData.auditOpinion : (progressData.machineStatus == 1 || progressData.machineStatus == 2 || progressData.machineStatus == 3) ? JSON.parse(progressData.machineResult)[0].machineTitle : '' }}
            </p>
            <p v-if='(progressData.handleStatus== 30 && (progressData.machineStatus == 0 || progressData.machineStatus == 9)) ||progressData.handleStatus == 40'>审核通过</p>
          </div>
        </van-step>
      <span>当前进度：{{getCurrentStatus(progressData.handleStatus)}}</span>
     </van-steps>

     <van-panel style='margin-top:5.3vw'>
        <div slot="header" class="recipe-detail-panel-header">
          <span class='header-title'>处方信息</span>
           <van-tag size="medium" text-color='#333333' class="header-icon" color="#f6f39b" v-if="detailData.recipeKind == 2">急诊</van-tag>
          <van-tag size="medium" text-color='#333333' class="header-icon" color="#ee96bd" v-else-if="detailData.recipeKind == 4">麻、精一</van-tag>
          <van-tag size="medium" text-color='#333333' class="header-icon" color="#ee96bd" v-else-if="detailData.recipeKind == 5">精二</van-tag>
          <van-tag size="medium" text-color='#333333' class="header-icon" color="#a0cd64" v-else-if="detailData.recipeKind == 3">儿科</van-tag>
          <van-tag size="medium" text-color='#333333' class="header-icon" color="#ffffff" v-else-if="detailData.recipeKind == 1" style='border:0.1vw solid #999999'>普通</van-tag>
        </div>
        <div class="recipe-detail-panel-body">
          <van-row type="flex" >
              <van-col span="8">
                处方号：
              </van-col>
              <van-col span="16">
                <span>{{detailData.recipeNum || ''}}</span>
              </van-col>
          </van-row>
          <van-row type="flex" >
              <van-col span="8">
                处方类型：
              </van-col>
              <van-col span="16">
                <span v-if='detailData.recipeType == 1'>西药</span>
                <span v-else-if='detailData.recipeType == 2'>中成药</span>
                <span v-else-if='detailData.recipeType == 3'>中草药 - 
                  <span v-if='detailData.recipeTypeCn == 0'>
                    中药
                  </span>
                  <span v-else-if='detailData.recipeTypeCn == 1'>
                    西药或中成药
                  </span>
                  <span v-else-if='detailData.recipeTypeCn == 2'>
                    膏方
                  </span>
                  <span v-else-if='detailData.recipeTypeCn == 3'>
                    丸剂
                  </span>
                  <span v-else-if='detailData.recipeTypeCn == 5'>
                    散剂
                  </span>
                  <span v-else-if='detailData.recipeTypeCn == 6'>
                    固定膏方
                  </span>
                </span>
              </van-col>
          </van-row>
          <van-row type="flex" >
              <van-col span="8">
                患者姓名：
              </van-col>
              <van-col span="16">
                <span>{{detailData.patientName}}</span>
              </van-col>
          </van-row>
          <van-row type="flex" >
              <van-col span="8">
                性别：
              </van-col>
              <van-col span="16">
                <span>{{detailData.patientSex==1 ? '男' : '女'}}</span>
              </van-col>
          </van-row>
          <van-row type="flex" v-if="(String(detailData.patientAge).split(','))[0] < 4">
              <van-col span="8">
                体重：
              </van-col>
              <van-col span="16">
                <span>{{detailData.patientWeight ? (detailData.patientWeight + 'kg') : ''}}</span>
              </van-col>
          </van-row>
          <van-row type="flex" >
              <van-col span="8">
                是否孕妇：
              </van-col>
              <van-col span="16">
                <span v-if='detailData.pregnantStatus == 0'>
                  否
                </span>
                <span v-else-if='detailData.pregnantStatus == 1'>
                  妊娠期
                </span>
                <span v-else-if='detailData.pregnantStatus == 2'>
                  哺乳期
                </span>
                <span v-else>
                  否
                </span>
              </van-col>
          </van-row>
          <van-row type="flex" >
              <van-col span="8">
                孕期：
              </van-col>
              <van-col span="16">
                <span v-if='detailData.patientSex!=1'>
                  {{detailData.pregnantDay || ''}}{{detailData.pregnantUnit || ''}}
                </span>
              </van-col>
          </van-row>
          <van-row type="flex" v-if="(String(detailData.patientAge).split(','))[0] < 4">
              <van-col span="8">
                身高：
              </van-col>
              <van-col span="16">
                <span>{{detailData.patientHeight || ''}}</span>
              </van-col>
          </van-row>
          <van-row type="flex" >
              <van-col span="8">
                肾功能不足：
              </van-col>
              <van-col span="16">
                <span>{{detailData.patientRenal == 0 ? '否' : '是'}}</span>
              </van-col>
          </van-row>
          <van-row type="flex" >
              <van-col span="8">
                肝功能不足：
              </van-col>
              <van-col span="16">
                <span>{{detailData.patientLiver == 0 ? '否' : '是'}}</span>
              </van-col>
          </van-row>
          <van-row type="flex" >
              <van-col span="8">
                过敏史：
              </van-col>
              <van-col span="16">
                <span>{{detailData.allergy || ''}}</span>
              </van-col>
          </van-row>
          <van-row type="flex" >
              <van-col span="8">
                临床诊断：
              </van-col>
              <van-col span="16">
                <span>{{getDescribeStr(detailData.recipeDiagnoseList)}}</span>
              </van-col>
          </van-row>
          <van-row type="flex" >
              <van-col span="8">
                中医证型：
              </van-col>
              <van-col span="16">
                <span>{{detailData.tcmSyndrome || ''}}</span>
              </van-col>
          </van-row>
          <van-row type="flex" >
              <van-col span="8">
                住址 / 电话：
              </van-col>
              <van-col span="16">
                <span>{{detailData.patientAddress || ''}}{{detailData.patientAddres ? '/' : ''}}{{detailData.patientPhone || ''}} </span>
              </van-col>
          </van-row>
        </div>
      </van-panel>
      <van-panel style='margin-top:5.3vw'>
        <div slot="header" class="recipe-detail-panel-header">
          <span class='header-title'>药品信息</span>
        </div>
        <div class="recipe-detail-panel-body">
        <!-- 中药用药指导 -->
          <van-row type="flex" v-for='(item, index) in detailData.recipeDrugList' v-if='index%2==0 && (detailData.recipeType != 1 && detailData.recipeType != 2 && detailData.recipeTypeCn != 1)' :gutter='20' style='color:#666'>
            <van-col span="12">
              <van-row type="flex" >
                  <van-col span="9">
                  {{item.drugName}}
                  </van-col>
                  <van-col span="9">
                  {{item.dosage}}{{item.unit || ''}}
                  </van-col>
                   <van-col span="6">
                   {{(detailData.recipeType == 1 || detailData.recipeType == 2) ? (item.usageName == '无' ? '' : item.usageName) : (item.decoct == '无' ? '' : item.decoct)}}
                  </van-col>
              </van-row>
            </van-col>
            <van-col span="12" v-if='detailData.recipeDrugList[index + 1] && detailData.recipeDrugList.length >= 2'>
              <van-row type="flex" style='color:#666'>
                  <van-col span="9">
                  {{detailData.recipeDrugList[index + 1].drugName}}
                  </van-col>
                  <van-col span="9">
                  {{detailData.recipeDrugList[index + 1].dosage}}{{detailData.recipeDrugList[index + 1].unit || ''}}
                  </van-col>
                   <van-col span="6">
                   {{(detailData.recipeType == 1 || detailData.recipeType == 2) ? (detailData.recipeDrugList[index + 1].usageName == '无' ? '' : detailData.recipeDrugList[index + 1].usageName) : (detailData.recipeDrugList[index + 1].decoct == '无' ? '' : detailData.recipeDrugList[index + 1].decoct)}}
                  </van-col>
              </van-row>
            </van-col>
          </van-row>
          <!-- 中药用药指导 -->
          <!-- 西药用药指导 -->
          <van-row type="flex" v-for='(item, index) in detailData.recipeDrugList' v-if='(detailData.recipeType == 1 || detailData.recipeType == 2) || detailData.recipeTypeCn == 1' :gutter='20' style='color:#666'>
              <van-col span="24">
                  <p>{{item.drugName}}</p>
                  <p>规格：<span>{{item.model}}</span>&nbsp&nbsp&nbsp<span>数量：{{item.qty}}{{item.qtyUnit || ''}}</span></p>
                  <p>用药指导：{{item.usageName}}，&nbsp&nbsp每次{{item.dosage}}{{item.unit || ''}}，&nbsp&nbsp{{item.frequencyName || ''}}</p>
              </van-col>
          </van-row>
          <!-- 西药用药指导 -->
          <div class='recipe-detail-panel-body-footer'>
            <hr  v-if='(detailData.recipeType == 3 && detailData.recipeTypeCn == 2) && detailData.ingredients'>
            <h4 style='font-size:4.3vw' v-if='(detailData.recipeType == 3 && detailData.recipeTypeCn == 2) && detailData.ingredients'>辅料</h4>
            <!-- 辅料 -->
            <van-row type="flex" v-for='(item, index) in detailData.ingredients' v-if='index%2==0 && detailData.ingredients && ((detailData.recipeType != 1) && (detailData.recipeType != 2) && (detailData.recipeTypeCn == 2))' :gutter='20' style='color:#999999'>
            <van-col span="12">
                <van-row type="flex" :gutter='20' style='color:#666'>
                    <van-col span="12">
                    {{item.name || ''}}
                    </van-col>
                    <van-col span="12">
                    {{item.count}}{{item.unit || ''}}
                    </van-col>
                </van-row>
                </van-col>
                <van-col span="12" v-if='detailData.ingredients[index + 1] && detailData.ingredients.length >= 2'>
                  <van-row type="flex" :gutter='20' style='color:#666'>
                      <van-col span="12">
                      {{detailData.ingredients[index + 1].name || ''}}
                      </van-col>
                      <van-col span="12">
                      {{detailData.ingredients[index + 1].count}}{{detailData.ingredients[index + 1].unit || ''}}
                      </van-col>
                  </van-row>
                </van-col>
            </van-row>
          <!-- 辅料 -->
          <hr>
            <van-row type="flex" :gutter='20' v-if='detailData.recipeType != 1 && detailData.recipeType != 2 && detailData.recipeTypeCn !=1'>
                <van-col span="12">
                  剂数：{{detailData.recipeDosage}}
                </van-col>
            </van-row>
            <van-row type="flex" :gutter='20' v-show='(detailData.recipeDrugList) && (detailData.recipeType == 3 && detailData.recipeTypeCn !=1)'>
                <van-col span="24">
                  用药指导：{{detailData.useMethod == 0 ? '内服' : '外服'}}，{{detailData.singleDose}}，{{detailData.recipeDrugList? detailData.recipeDrugList[0].frequencyName:''}}，{{detailData.recipeDrugList? detailData.recipeDrugList[0].usageName:''}}
                </van-col>
            </van-row>
            <van-row type="flex" :gutter='20'>
                <van-col span="12">
                  （以下空白）
                </van-col>
            </van-row>
          <hr>
           <van-row type="flex" :gutter='20'>
                <van-col span="12">
                  医师：{{detailData.billDoctor || ''}}
                </van-col>
                <van-col span="12">
                  审核药师：{{detailData.auditorRealName || ''}}
                </van-col>
            </van-row>
            <van-row type="flex" :gutter='20'>
                <van-col span="12">
                  调剂员：{{''}}
                </van-col>
                <van-col span="12">
                  发药核对药师：{{''}}
                </van-col>
            </van-row>
          </div>
        </div>
      </van-panel>
      <van-row type="flex" :gutter='20' style='padding:10vw 3vw'>
      </van-row>
      <van-row type="flex" :gutter='20' style='padding:4.3vw 3vw' v-if='$route.query.sourceType == "normal" ?(detailData.auditStatus == "1") : (detailData.auditStatus == "3" || detailData.auditStatus == "4")' class='auditContent'>
          <van-col span="12">
            <button class='audit-success' @click='orderFromAudit("success")'>审核通过</button>
          </van-col>
          <van-col span="12">
            <button class='audit-faild' @click='auditFaildCause = !auditFaildCause'>审核不通过</button>
          </van-col>
      </van-row>
      <van-dialog
        v-model="auditFaildCause"
        title="审核不通过"
        show-cancel-button
        @confirm='orderFromAudit("faild")'
        @cancel = '() => {auditFaildCauseContent = {
          problemType: "",
          problemItem: "",
          auditOpinion: ""
        },$refs.questionClassify["inpVal"] = "",$refs.questionType["inpVal"] = ""}'
      > 
        <van-row type="flex" :gutter='20' style='padding:4.3vw 3vw'>
          <van-col span="8" style='text-align:right'>
            <p>分类：</p>
          </van-col>
          <van-col span="16">
            <Public-From label="" :columns='questionClassify' @picker-confirm='(obj) => {
              auditFaildCauseContent.problemType = obj.uId;
              getQuestionType(obj)
            }' type="select" ref='questionClassify'/>
          </van-col>
        </van-row>
        <van-row type="flex" :gutter='20' style='padding:4.3vw 3vw'>
          <van-col span="8" style='text-align:right'>
            <p>问题类型：</p>
          </van-col>
          <van-col span="16">
            <Public-From label="" :columns='questionType' type="select" @picker-confirm="(obj) => {
              auditFaildCauseContent.problemItem = obj.uId;
            }" ref='questionType'/>
          </van-col>
        </van-row>
        <van-row type="flex" :gutter='20' style='padding:4.3vw 3vw'>
          <van-col span="8" style='text-align:right'>
            <p>原因：</p>
          </van-col>
          <van-col span="16">
             <van-field
                type='textarea'
                v-model="auditFaildCauseContent.auditOpinion"
                clearable
                placeholder="请输入原因"
              />
          </van-col>
        </van-row>
      </van-dialog>
  </div>
</template>
<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';
import PublicFrom from '@/components/PublicFrom.vue';
import util from '@/util'
import qs from 'qs'
@Component({
  components: {
    PublicFrom
  }
})
export default class RecipeDetail extends Vue {
  private apiStr:any = {
    'normal': { api: '/prescription/precision/recipes/recipe/audit'},
    'question': { api:'/prescription/precision/recipes/recipe/reAudit'}
  }
  private detailData: any = ''
  private progressData: any = ''
  private auditFaildCause: boolean = false
  private questionClassify: any = []
  private questionType: any = []
  private auditFaildCauseContent: any = {
      problemType: '',
      problemItem: '',
      auditOpinion: ''
  }
  getDescribeStr (obj:any) {
    let str = '';
    obj && obj.forEach((item:any, index:any):any => {
      str += obj.length > 1 ? item.describe + ',' : item.describe;
    })
    return str;
  } //获取临床诊断字样
  getDetatilData () {
    this.$get(`/prescription/precision/recipes/recipe/recipeDetail?uId=${this.$route.query.uId}&auditStatus=${this.$route.query.sourceStatus}`, {}, {
      "Content-Type" : 'application/x-www-form-urlencoded; charset=UTF-8',
    }).then((res: any):any => {
      this.detailData = res.data.data;
      this.detailData.ingredients && (this.detailData.ingredients = JSON.parse(this.detailData.ingredients)); 
    }) 
  } // 获取详情数据
  getPreStatus (name:string, status: boolean) {
    switch(name)
    {
      case '10':
        return '上传处方'
        break;
      case '11':
        return '处方录入'
        break;
      case '12':
        return '处方录入'
        break;
      case '40':
        return status ? '人工二审' : '人工审核'
        break;
      case '41':
        return '人工审核'
        break;
      case '60':
        return '回退处方'
        break;
      case '50':
        return '沟通确认'
        break;
      case '30':
        return '机审完成'
        break;
    }
  } // 判断上一步状态
  getCurrentStatus (name:string) {
    switch(name)
    {
      case '40':
        return '完成'
        break;
      case '41':
        return '沟通确认'
        break;
      case '50':
        return '人工复审'
        break;
      case '30':
        return '人工审核'
        break;
      case '60':
        return '药师回退、二审不通过'
        break;
    }
  } // 判断当前状态
  orderFromAudit (status:string) {
    if ((status == 'faild') && !(this.auditFaildCauseContent.problemType && this.auditFaildCauseContent.problemItem &&  this.auditFaildCauseContent.auditOpinion)) {
      this.$toast('请输入分类信息、问题类型及原因');
      return
    }
    this.$post((this as any).apiStr[(this as any).$route.query.sourceType].api, {
      uId: this.$route.query.uId,
      auditStatus: status == 'success' ? 2 : this.$route.query.sourceType == 'normal' ? '3' : '5',
      problemType: this.auditFaildCauseContent.problemType,
      problemItem: this.auditFaildCauseContent.problemItem,
      auditOpinion: this.auditFaildCauseContent.auditOpinion
    },{
      headers: {
        "Content-Type" : 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      transformRequest:  [function (data:any) {
        data = qs.stringify(data)
        return data;
      }],
    }).then((res:any):any => {
      res.data.code == 0 ? this.$toast.success(res.data.msg) : this.$toast.fail(res.data.msg)
      res.data.code == 0 && this.getDetatilData();
      this.$get(`/prescription/precision/recipes/recipe/showRecipeProgress/${this.$route.query.uId}`, {}, {
        "Content-Type" : 'application/x-www-form-urlencoded; charset=UTF-8',
      }).then((res: any):any => {
        this.progressData = res.data.data[res.data.data.length - 1];
      }) 
    })
  } // 审核
  getQuestionType (obj:any) {
    this.$get(`prescription/prescription/problemType/queryItems/${obj.uId}`, {}, {
      "Content-Type" : 'application/x-www-form-urlencoded; charset=UTF-8',
    }).then((res: any):any => {
      this.questionType = res.data.data.map((item:any) => {
        item.text = item.name;
        return item
      });
    }) 
  } // 获取问题类型

  mounted() {
    this.getDetatilData();
    this.$get(`/prescription/precision/recipes/recipe/showRecipeProgress/${this.$route.query.uId}`, {}, {
      "Content-Type" : 'application/x-www-form-urlencoded; charset=UTF-8',
    }).then((res: any):any => {
      this.progressData = res.data.data[res.data.data.length - 1];
    }) 
    this.$get(`prescription/prescription/problemType/queryAll`, {}, {
      "Content-Type" : 'application/x-www-form-urlencoded; charset=UTF-8',
    }).then((res: any):any => {
      this.questionClassify = res.data.data.map((item:any) => {
        item.text = item.name;
        return item
      });
    }) 
  }
}
</script>
<style lang="scss">
  .recipe-detatil-progress {
    font-size:3.7vw;
    .van-steps__items {
      >span {
        display: inline-block;
        margin-top: 1.5vh;
      }
      span:last-child {
        margin-bottom: 1.7vh;
      }
      .van-step__title {
        color: #808080 !important;
        font-size: 3.5vw
      }
    }
  }
  .auditContent {
    position:fixed;
    bottom:0rem;
    background:#f7f8fa;
  }
  .recipe-detail-panel-header {
    height: 11.7vw;
    > span {
      // display:inline-block;
    }
    .header-title {
      margin-left: 4vw;
      font-size: 4.3vw;
      line-height: 11.7vw;
      font-weight:600
    }
    .header-icon {
      margin-left:60.1vw;
    }
    
  }
  .recipe-detail-panel-body {
    border-top:	solid 0.3vw #e5e5e5;
    .van-row {
      // .van-col:last-child {
      //   color: #666 !important;
      // }
      padding:2vw 4vw;
      font-size: 3.5vw;
    }
    .van-row .van-col {
      >span {
        word-wrap:break-word;
        vertical-align:-webkit-baseline-middle;
        vertical-align:sub;
        color: #666;
      }
    }
    .recipe-detail-panel-body-footer {
      width: 92vw;
      margin-left:4vw;
      hr {
        border: solid 0.3vw #e5e5e5;
      }
    }
  }
  .audit-success {
    width: 44vw;
    height: 12vw;
    color: white;
    border:none;
    font-size: 4.3vw;
    background-color: #0bccd1;
    border-radius: 2vw;
  }
  .audit-faild {
    width: 44vw;
    height: 12vw;
    border-radius: 2vw;
    background: transparent;
    font-size: 4.3vw;
    border: solid 0.1vw #0bccd1;
    color: #0bccd1;
  }
</style>
