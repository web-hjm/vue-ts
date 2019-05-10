import axios from 'axios'
import util from '@/util'
import { Toast } from 'vant';
import Vue from 'vue'
axios.defaults.baseURL = util.requestApi;
// axios.defaults.withCredentials = true;
axios.defaults.headers.token = window.localStorage.getItem('token') || ''
axios.defaults.headers.clientType = "3";
axios.defaults.withCredentials= false,
axios.defaults.timeout = 30000;
axios.interceptors.request.use((req:any):any => {
    req.headers.token = window.localStorage.getItem('token');
   return req
}, (error:any) => {
})
axios.interceptors.response.use((response:any):any => {
    // console.log(response);
    ((response.data.data && response.data.data.length <= 0) || (response.data.rows && response.data.rows.length <= 0)) && Toast('暂无对应数据'); // 数据为空全局提示
    if (response.data.code == 5000 || response.data.code == 5001 || response.data.code == 5002 || response.data.code == 5003 || response.data.code == 5004 || response.data.code == 5005) {
        post(`applet/wechatGzh/login`, {
            openId : util.decrypt(window.localStorage.getItem('openId'))
        }).then((res :any):any => {
            if (res.data.data.token) {
                window.localStorage.setItem("token", res.data.data.token);
                Toast('token已失效');
                setTimeout(() => {
                    location.reload()
                }, 200);
            } else {
                get(`applet/wechatGzh/authorize?type${util.getUrlParams().type}`),window.localStorage.setItem("test1", '被解绑了');
            }
        })
    } else if (response.data.code == 6001) {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('openId');
        get(`applet/wechatGzh/authorize?type=${util.getUrlParams().type}`)
        Toast('该用户已解绑，请刷新页面重新登陆')
    } else {
        return response
    }
},(error:any) => {
    Toast('请求失败');
    return error
// 对响应错误做点什么
})
const post = (url: any, params?: any, option ?: any) => {
    return new Promise((resolve, reject) => {
        // console.log(option, window.localStorage.getItem('token'))
        // option && (option.headers.token = window.localStorage.getItem('token'));
        axios.post(url, params, option).then((res: any) => {
            resolve(res);
        }).catch((err: any) => {
            reject(err);
         });
     });
};
Vue.prototype.$post = post;
// 将axios 的 get 方法，绑定到 vue 实例上面的 $get
const get =  (url: any, params?: any, option ?: any) => {
    return new Promise((resolve, reject) => {
        option && (option.token = window.localStorage.getItem('token'));
        axios.get(url, { params: params , headers : option}).then((res: any) => {
            resolve(res); // 返回请求成功的数据 data
        }).catch((err: any) => {
            reject(err);
        });
    });
};
Vue.prototype.$get = get;
// export const get = (url:any, params:object = {}) => {
//     return new Promise((resolve, reject) => {
//         axios.get(url, {
//             params
//         }).then(response => {
//             resolve(response);
//         }).catch(err => {
//             reject(err);
//         })
//     })
// }

// export const post = (url:any, data:object = {}) => {
//     return new Promise((resolve, reject) => {
//         axios.post(url, data).then(response => {
//             resolve(response);
//         }).catch(err => {
//             reject(err);
//         })
//     })
// }

// export const put = (url:any, data:object = {}) => {
//     return new Promise((resolve, reject) => {
//         axios.put(url, data).then(response => {
//             resolve(response);
//         }).catch(err => {
//             reject(err);
//         })
//     })
// }

// export const deleteFn = (url:any, data:object = {}) => {
//     return new Promise((resolve, reject) => {
//         axios.delete(url, {
//             data
//         }).then(response => {
//             resolve(response);
//         }).catch(err => {
//             reject(err)
//         })
//     })
// }

export const $post = post;
export const $get = get;
