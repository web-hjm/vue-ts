<template>
    <div class='progress-audit'>
        <van-steps direction="vertical"  :active='progressData.length - 1'>
            <van-step v-for='(item, index) in progressData'>
                <div @click='previewPicture(item.handleStatus, item.machineStatus, item.machineResult)'>
                    <van-row type="flex" style='padding:3.2vw 0vw'>
                        <van-col span="8" class='progress-audit-status'>
                        {{getCurrentStatus(item.handleStatus, item.isAuditAgain)}}
                        </van-col>
                        <van-col span="12" style='margin-left:10vw' class='progress-audit-time'>
                            {{item.handleTime}}
                        </van-col>
                    </van-row>
                    <van-row type="flex" :gutter='20' style='padding:3.2vw 0vw'>
                        <van-col span="24" class='progress-audit-man'>
                        {{item.handlerRealName || item.billDoctor || ""}}
                        
                        <p v-if='item.handleStatus == 30 && (item.machineStatus == 1 || item.machineStatus == 2 || item.machineStatus == 3)'>审核状态：{{item.machineStatus ? (item.machineStatus + '级') : ''}}</p>
                        <p v-else-if='item.handleStatus == 41 || item.handleStatus ==60'>审核状态：审核不通过</p>


                        <p v-if='(item.handleStatus == 30 && (item.machineStatus == 1 || item.machineStatus == 2 || item.machineStatus == 3))|| item.handleStatus == 41 || item.handleStatus == 60 || item.handleStatus == 110'>原因：<span class='audit-cause'>{{ item.handleStatus != '30' ?  item.auditOpinion : (item.machineStatus == 1 ||item.machineStatus == 2 || item.machineStatus == 3) ? JSON.parse(item.machineResult)[0].machineTitle : ''}}</span></p>
                        
                        <p v-else-if='(item.handleStatus == 30 && (item.machineStatus == 0 || item.machineStatus == 9)) || item.handleStatus == 40'>审核通过</p>
                        </van-col>
                    </van-row>
                </div>
            </van-step>
        </van-steps>
        <button class='progress-goBack' @click='$router.go(-1)'>返回</button>
        <van-dialog
            v-model="machineTrialShow"
            class='machineT-trail-dialog'
            >
            <van-panel v-for='(item, index) in machineTrialData.option' class='machineT-trail-content'>
                <div slot="header" class='machineT-trail-header'>
                    <van-row type="flex">
                        <van-col span="8" >
                            <span class='machineT-trail-title'>风 险 等 级：</span>
                        </van-col>
                        <van-col span="16">
                            <van-rate
                                v-model="machineTrialData.val"
                                :size="25"
                                color="#ffffff"
                                readonly
                                void-icon="star"
                                void-color="gray"
                            />
                        </van-col>
                    </van-row>
                </div>
                <div>
                    <van-row type="flex">
                        <van-col span="1" ></van-col>
                        <van-col span="23" >
                            <p>用药风险：<span class='progress-audit-man'>{{item.machineTitle}}</span></p>
                        </van-col>
                    </van-row>
                    <hr>
                    <van-row type="flex"  >
                        <van-col span="1" ></van-col>
                        <van-col span="23" >
                            <p>用药风险：<span class='progress-audit-man'>{{item.machineDtail}}</span></p>
                        </van-col>
                    </van-row>
                </div>
            </van-panel>
        </van-dialog>
    </div>
</template>
<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';
import util from '@/util'
@Component
export default class ProgressAudit extends Vue {
    private progressData: any = ''
    private machineTrialShow:boolean = false
    private machineTrialData:any = {
        val: 0,
        option: []
    }
    getCurrentStatus (val:any, status: boolean) {
        switch (val) {
            case('10'):
                return '上传处方'
                break;
            case('11'):
                return '处方录入'
                break; 
            case('12'):
                return '处方录入'
                break;
            case('30'):
                return '智能审核'
                break; 
            case('40'):
                return status ? '人工二审' : '人工审核'
                break; 
            case('41'):
                return '人工审核'
                break;
            case('50'):
                return '沟通确认'
                break;
            case('60'):
                return '回退处方'
                break;
        }
    } // 获取当前状态
    previewPicture (val:any, rank:any, obj:any) {
        if ((val == 30) && (rank == 1 || rank == 2 || rank == 3)) {
            this.machineTrialData.val = parseInt(rank);
            this.machineTrialData.option = JSON.parse(obj);
            console.log(this.machineTrialData.option)
            this.machineTrialShow = !this.machineTrialShow;
        }
    } // 机审提醒
    mounted() {
        this.$get(`/prescription/precision/recipes/recipe/showRecipeProgress/${this.$route.query.uId}`, {}, {
        "Content-Type" : 'application/x-www-form-urlencoded; charset=UTF-8',
        }).then((res: any):any => {
            this.progressData = res.data.data;
            let onedatacf:any = {};
            let _index:any = '';
            let prescriptionType:any = this.$route.query.prescriptionType;
            let billDoctor:any = this.$route.query.billDoctor
            this.progressData.forEach(function(val:any, index:any) {
                if(val.handleStatus == 10) {
                    onedatacf = val
                    onedatacf.prescriptionType = prescriptionType
                    onedatacf.billDoctor = billDoctor
                }  else if(prescriptionType == 1 && (val.handleStatus == 11||val.handleStatus == 12)) {
                    _index = index
                }  else if(prescriptionType == 0 && val.handleStatus == 30) {
                    _index = index
                }
            })
                this.progressData = this.progressData.slice(_index, this.progressData.length)
                this.progressData.splice(0, 0, onedatacf);
        });
    }
}
</script>
<style lang='scss'>
 .machineT-trail-dialog {
     height:80%;
     overflow: auto
 }
 .progress-audit {
     .van-step--finish .van-step__circle, .van-step--finish .van-step__line {
        background:#0bccd1;
        border-radius: 0.3vw;
        //  width: 0.5vw;
        //     height: 18.7vw;
    }
    // .van-step--vertical.van-step--process .van-icon {
    //     top:5vw;
    //     font-size:10vw;
    //     left: -9vw;
    // }
    .progress-audit-status {
        font-size: 4vw;
        font-weight: 600;
        color: #003333;
    }
    .progress-audit-time,.progress-audit-man {
        font-size: 3.2vw;
        color: #999999;
    }
    .audit-cause {
        font-size: 3.2vw;
        font-weight: 600;
	    color: #f47979;
    }
    .progress-goBack {
        width: 66.7vw;
        height: 12vw;
        background-color: #0bccd1;
        border-radius: 2vw;
        color:white;
        border: none;
        margin: 10vw 16vw;
    }
    .machineT-trail-content {
        .machineT-trail-header {
            background-color: #1fc4c0;
        } 
        .machineT-trail-title {
            display:inline-block;
            font-size: 4vw;
            color: #ffffff;
            margin:2.5vw 2vw;
        }
        .van-rate {
            margin:3.5vw 0vw;
            border:none;
            .van-icon {
                font-size: 4.5vw !important;
            }
        }
        hr {
            border: 0.1vw solid #999999;
            width:92%;
            margin-left:4%;
        }
    }
 }
</style>