import { $get, $post } from '@/reuqest'
import qs from 'qs'
const getDruByName = (name: object): any => { //药学知识查询
    return $get('/prescription/prescription/drug/getDruByName', name, {
        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
    })
}
const queryDrugLink = (name: object): any => { // 药学知识查询详情
    return $get('/gzth/queryDrugLink', name, {
        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
    })
}
const selectUserInfo = (): any => {
    return $get('/system/system/user/selectUserInfo', {}, {
        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
    })
}
const savePerson = (data: object): any => {
    return $post('/system/system/user/savePerson', data)
}
export {
    getDruByName,
    queryDrugLink,
    selectUserInfo, savePerson
}