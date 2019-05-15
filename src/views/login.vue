<template>
  <div>
    <div class="login-chunk">
      <van-row type="flex" justify="center">
        <van-col span="18" class="qjf-logo">
        </van-col>
      </van-row>
      <van-row type="flex" justify="center" class="login-username">
        <van-col span="24" >
            <van-field
              v-model="username"
              clearable
              left-icon="user-circle-o"
              placeholder="请输入用户名"
            />
        </van-col>
      </van-row>
      <van-row type="flex" justify="center" class="login-password">
        <van-col span="24" >
            <van-field
              v-model="password"
              :type="pwdInpType"
              clearable
              left-icon="edit"
              right-icon="eye-o"
              placeholder="请输入密码"
              @click-right-icon="pwdInpType == 'password' ? pwdInpType='text' : pwdInpType='password'"
            />
        </van-col>
      </van-row>
      <van-row type="flex" justify="center" class="login-verifyNum" v-show="verifyShow">
        <van-col span="12">
          <van-field
              v-model="verifyVal"
              clearable
              placeholder="请输入验证码"
            />
        </van-col>
        <van-col span="12">
          <img :src="verifyPic" alt="" title="点击切换图片"  @click="getPic"/>
        </van-col>
      </van-row>
      <van-row type="flex" justify="center" class="login-verifyNum" v-show="errorShow">
        <van-col span="24" class="error-msg">
          {{errorMsg}}
        </van-col>
      </van-row>
      <van-row type="flex" justify="center" class="login-loginbtn">
        <van-col span="24">
          <van-button type="primary" class="km-btn" @click="loginSubmit">登录</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';
import util from '@/util';
@Component
export default class Login extends Vue {
    username:any = "";
    password:any = "";
    pwdInpType: string = 'password';
    verifyVal: any = '';
    verifyShow: boolean = false;
    verifyPic: string = '';
    verifyStatus: boolean = false;
    uuid: any = "km" + util.guid();
    errorShow: boolean = false;
    errorMsg: string = '';
    loginStatus: any = Boolean((window.localStorage.getItem('token') && window.localStorage.getItem('openId')));
    mounted() {
      // this.getPic();
      this.loginStatus && this.loginSubmit();
    }
    getPic () {
      this.uuid = "km" + util.guid();
      if (!this.verifyStatus) {
        this.verifyStatus = true;
        this.$get(`system/captcha/captchaImage?type=math&key=${this.uuid}`).then((res:any):any => {
          console.log(res)
          this.verifyPic = `data:image/gif;base64,${res.data.data.imgsrc}`;
          this.verifyStatus = false;
        })
      } else {
         this.$toast('请勿多次刷新验证码图片');
      }
    }  
    loginSubmit () {
      if ((this.username && this.password) || this.loginStatus) {
        // if (!this.loginStatus) {
        //   if (/(^\_)|(\__)|(\_+$)/.test(this.username)) {
        //     this.$toast("用户名首尾不能出现下划线'_'");
        //     return;
        //   } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$/.test(this.username)) {
        //     this.$toast("用户名不能有特殊字符");
        //     return;
        //   } else if (!/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,12}$/.test(this.password)) {
        //     this.$toast("密码必须含有数字、字母或符号，且长度在6到12个数之间");
        //     return;
        //   }
        // }
        //  公众号关闭校验
        let theRequest:any = util.getUrlParams(); // 获取浏览器参数    
        // window.localStorage.setItem('url1', window.location.href.split('#')[0] + '---' + window.location.href.split('#')[1]);
        let reuqestData = this.loginStatus ? {
            openId : util.decrypt(window.localStorage.getItem('openId'))
          } : this.verifyShow ? {
                  code: theRequest.code || '',
                  phoneNumber: util.encrypt(this.username),
                  password: util.encrypt(this.password),
                  validateCode: this.verifyVal,
                  validateCodeKey: this.uuid
            } : {
                  code: theRequest.code || '0619ZKxk1ppBan0iEMAk1NQOxk19ZKxy',
                  phoneNumber: util.encrypt(this.username),
                  password: util.encrypt(this.password),
                  validateCodeKey: this.uuid
            } // 根据状态决定 传递参数
        this.$post(`applet/wechatGzh/login`, reuqestData).then((res:any):any => {
          res.data.data && (res.data.data.isCheckValidateCode == '1') ? this.verifyShow = true : this.verifyShow = false;
          if (res.data.code == 0) {
            window.localStorage.setItem("token", res.data.data.token);
            window.localStorage.setItem("openId", util.encrypt(res.data.data.openId));
            this.$toast('登陆成功');
            this.errorShow = false;
            this.errorMsg = '';
            window.localStorage.getItem("token") && this.$router.push({path: theRequest.type})
            // window.localStorage.getItem("token") && this.$router.push({path: '/recipe/normal'}); // 跳转至来源url携带的type路由
          } else {
            if (res.data.data && (res.data.data.isCheckValidateCode == '1')) {
              this.verifyShow = true;
              this.getPic();
            }
            this.verifyVal = '';
            this.password = '';
            this.errorShow = true;
            this.errorMsg = res.data.msg;
          }
        })
      } else {
        this.$toast("请输入账号、密码");
      }
    }
}
</script>
<style lang="scss">
.login-chunk {
  width:80vw;
  height: 70vh;
  margin: auto 10vw;
  margin-top: 13vh;
  .qjf-logo {
    background: url('../assets/logo@2x.png') no-repeat;
    height:9.2vw;
    background-size: 100% 100%;
  }
  .login-username,.login-loginbtn{
    margin-top: 9.9vw;
  }
  .login-password,.login-verifyNum{
    margin-top: 4vw;
  }
  .login-verifyNum {
    img {
      width:33vw;
      height:12vw;
      margin-left: 7vw;
    }
  }
  input, input::-webkit-input-placeholder,.error-msg{
    color:#1fc4c0;
    font-family: PingFang-SC-Medium;
	  font-size: 4.3vw;
  }
  .error-msg {
    color:red;
    text-align:center;
  }
  .van-cell {
    color:#1fc4c0;
    border-bottom: 0.4vw solid #eeeeee;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    i {
      font-size:6.1vw;
    }
  }
}
</style>
