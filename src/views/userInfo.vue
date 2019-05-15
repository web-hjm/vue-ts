<template>
    <div class="userInfo">
        <van-cell-group >
            <van-field v-model="username" label="姓名" @blur="savePersonFn()"/>
        </van-cell-group>
        <van-cell-group >
            <div class="van-cell van-field">
                <div class="van-cell__title van-field__label">
                    <span>角色</span>
                </div>
                <div class="van-cell__value">
                    <span v-for="item in userInfo.roles" class="roleName">{{item.roleName}}</span>
                </div>
            </div>
        </van-cell-group>
        <van-cell-group >
            <div class="van-cell van-field">
                <div class="van-cell__title van-field__label">
                    <span>电话</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">{{userInfo.phonenumber}}</div>
                </div>
            </div>
        </van-cell-group>
    </div>
</template>
<script lang='ts'>
import { selectUserInfo, savePerson } from "@/api";
import { Vue, Component } from "vue-property-decorator";
let _userName: string = "";
@Component
export default class UserInfo extends Vue {
    private userInfo: any = "";
    private username: string = "";
    private loadingShow: boolean = false;
    created() {
        this.getUserInfo();
    }
    async getUserInfo() {
        try {
            let data = await selectUserInfo();
            this.userInfo = data.data.data;
            this.username = this.userInfo.loginName;
            _userName = this.userInfo.loginName;
            console.log(this.userInfo);
        } catch (error) {}
    }
    async savePersonFn() {
        if (_userName === this.username.trim()) {
            return;
        }
        if (this.username.trim().length > 10) {
            this.$toast("名字长度不能超过10位字符");
            return;
        }
        this.$dialog.confirm({
            title: "提示",
            message: "是否修改姓名"
        })
            .then(async () => {
                this.loadingShow = true;
                try {
                    let data = await savePerson({
                        avatar: this.userInfo.avatar,
                        email: this.userInfo.email,
                        loginName: this.username,
                        userName: this.username,
                        password: "",
                        province: this.userInfo.province,
                        city: this.userInfo.city,
                        county: this.userInfo.county,
                        userId: this.userInfo.userId
                    });
                    this.loadingShow = false;
                    this.$toast("修改成功");
                    _userName = this.username;
                } catch (error) {
                    this.loadingShow = false;
                }
            })
            .catch(
                (): any => {
                    // on cancel
                }
            );
    }
}
</script>
<style lang="scss">
.userInfo {
    .van-field__label {
        flex: 1;
        max-width: inherit;
    }
    input {
        color: #969799;
    }
    .roleName {
        display: inline-block;
        min-width: 60px;
    }
    .van-cell__value {
        text-align: left;
    }
}
</style>