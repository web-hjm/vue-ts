<template>
    <div>
        <van-row class="btn-group">
            <van-col span="24" v-show='label'>
                <span class="btn-group-label">{{label}}：</span>
            </van-col>
            <van-col span="20" v-if='type === "select"'>
                <van-cell-group class='km-border'>
                    <van-field
                    v-model="inpVal"
                    center
                    placeholder="请选择"
                    readonly
                    @click='selectSource'
                    >
                    </van-field>
                </van-cell-group>
            </van-col>
            <van-col span="24" v-if='type === "time"'>
                <van-row type="flex" gutter="10">
                    <van-col span="11">
                        <van-cell-group class='km-border'>
                            <van-field
                            v-model="startTime"
                            center
                            placeholder="请选择开始时间"
                            readonly
                            @click='selectSource("start")'
                            >
                            </van-field>
                        </van-cell-group>
                    </van-col>
                    <van-col span="11">
                        <van-cell-group class='km-border'>
                            <van-field
                            v-model="endTime"
                            center
                            placeholder="请选择结束时间"
                            @click='selectSource("end")'
                            readonly
                            >
                            </van-field>
                        </van-cell-group>
                    </van-col>
                </van-row>
            </van-col>
        </van-row>
        <van-popup v-model="publicPopup" position="bottom" :close-on-click-overlay='false' :get-container='mountedEl'>
            <van-picker :columns="columns || []" @cancel="publicPopup = false"
            @confirm="pickerSuccess"   show-toolbar :ref='pickerRef' v-if='type === "select"'/>
            <van-datetime-picker
            v-model="dateVal"
            :type="dateType" v-if='type === "time"' @cancel="publicPopup = false" @confirm="dateSuccess" />
        </van-popup>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit} from 'vue-property-decorator'
@Component
export default class PublicFrom extends Vue{
  @Prop() label?: string // label名称
  @Prop() type?: string //表单类型
  @Prop({default: 'date'}) dateType?: string // 时间选择器类型
  @Prop({default: ''}) pickerRef ?: string
  @Prop({default: () => {return []}}) columns ?: any[]
  @Emit() pickerConfirm (obj:any) {
        return obj
  } // select确认事件触发
  @Emit() putStartVal (val:any) {
        return val
  }
  @Emit() putEndVal (val:any) {
        return val
  }
  inpVal: any = '' // select值
  publicPopup: boolean = false // select 显示状态
  dateVal:any = new Date() // 时间存储器值
  startTime: any = ''// 开始时间
  endTime: any = '' // 结束时间
  dateStatus: string = ''
  selectSource (type:string) {
      this.publicPopup = true;
    //   !type && (this.columns.length <= 0 && this.$toast('暂无数据'))
      this.dateStatus = type;
    //   console.log(this.dateStatus, this.columns)
  }
  mountedEl () {
      return document.getElementById('app'); // 全局挂载
  }
  pickerSuccess (val:any) {
      this.publicPopup = false;
      this.inpVal = val.text;
      this.pickerConfirm(val);
  }  
  dateSuccess (val:any) {
      this.publicPopup = false;
      let _date = `${new Date(val.getTime()).getFullYear()}-${(new Date(val.getTime()).getMonth()) + 1}-${new Date(val.getTime()).getDate()}`
      this.dateStatus === 'start' ? (this.startTime = _date,this.putStartVal(this.startTime)) : (this.endTime = _date,this.putEndVal(this.endTime));
  }
  mounted() {
  }
}
</script>