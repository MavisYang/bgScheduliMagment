/* eslint-disable */
import React, { Component } from 'react'
import './modal.css'
import SelectBox from '../shareComponent/SelectBox'
import {API_PATH} from '../../contants/OriginName'
import $ from 'jquery'
import FuzzyOptions from '../shareComponent/FuzzyOptions'

const typeMap = {
    '0':'文字',
    '1':'卡片式链接',
    '2':'小程序',
    '3':'图片'
}

export default class OccupiedModule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            params: {
                userName: this.getCookie('username'),
                groupNum: '',
                times: ''
            },
            data: null,
            flag:'',
            timesCode:[],
            timesVal:[],
            verifyFlag:{},
            selectSchedule: {},
            leftNum: 0,
            fuzzyList: [],
            FuzzyDisplay: false,
            barrier: true,
            tempUserName: '',
            cookie_username:'',
            btnDisabled:false
        }
        this.setparamsHandle = this.setparamsHandle.bind(this)
        this.iptAccount = this.iptAccount.bind(this);
        this.iptGroupNum = this.iptGroupNum.bind(this);
        this.deleteBtn = this.deleteBtn.bind(this);
        this.editBtn = this.editBtn.bind(this);
        this.addNewBtn = this.addNewBtn.bind(this);
        this.refundBtn = this.refundBtn.bind(this);
        this.requestList = this.requestList.bind(this)
        this.addRequest = this.addRequest.bind(this)
        this.editRequest = this.editRequest.bind(this)
        this.editModifyRequest = this.editModifyRequest.bind(this)
        this.verifyHandle = this.verifyHandle.bind(this)
    }
    componentDidMount(){
        if(!this.props.status){
            this.requestList()
        }else{
            this.setState({
                leftNum: this.props.selectItem.groupCount
            })
        }
        let timesCode = this.props.timeMap.map(item => item.code)
        let timesVal = this.props.timeMap.map(item => item.times)
        this.setState({timesCode,timesVal})
        this.setState({
            cookie_username:this.getCookie('username') 
        })
    }
    requestList(){
        const self = this
        const {selectItem} = this.props
        $.ajax({
            method: 'GET',
            url : `${API_PATH}/launch-api/schedule/scheduledetail`,
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json;charset=utf-8',
            data: `_id=${selectItem.scheduleId}&_scheduleDate=${selectItem.scheduleDate}&_categoryId=${selectItem.categoryId}`,
            success: function (res) {
                let leftNum = selectItem.groupCount
                res.resultContent[0].items.forEach(v => {
                    leftNum -= v.groupNum
                });
                self.setState({
                    data: res.resultContent[0],
                    leftNum: leftNum
                }) 
            }
        })
    }
    setparamsHandle(name,value){
        let {params} = this.state
        params[name] = value
        this.setState({params})
    }
    iptAccount(e) {
        //填写账户
        console.log(e)
    }
    iptGroupNum(e){
        this.setparamsHandle('groupNum',e.target.value)
    }
    deleteBtn(item) {
        //删除
        this.props.showDeleteModal(item.id)
    }
    editBtn(item) {
        this.setState({
            flag: 'EDIT',
            params: {
                ...this.state.params,
                groupNum: item.groupNum,
                times: item.times,
                userName: item.userName
            },
            selectSchedule: item
        })
    }
    refundBtn() {
        //取消
        if(this.state.flag!=''){
            this.setState({
                flag: '',
                params: {
                    userName: this.getCookie('username'),
                    groupNum: '',
                    times: ''
                },
                verifyFlag:{}
            })
        }else{
            this.props.hideOccupiedModule()
        }
    }
    addNewBtn() {
        const {status} = this.props
        const {flag} = this.state
        if(status){
            //新增预占
            this.addRequest()
        }else if((!status&&flag!='')){
            // 编辑
            if(flag=='EDIT'){
                this.editModifyRequest()
            }else{
                this.editRequest()
            }
        }else{
            // 编辑新增
            this.setState({flag: 'ADD'})
        }
    }
    addRequest(){
        // 创建新增
        let self =this
        let verifyResult = this.verifyHandle()
        if(!verifyResult) return
        let {params} = this.state
        let {selectItem,refreshHandle,hideOccupiedModule,showToast,timeMap} = this.props
        let requestParams = {
            "items": [
                {
                    "scheduleDate":selectItem.scheduleDate,
                    "userName":params.userName,
                    "groupNum":params.groupNum,
                    "times": params.times
                }
            ],
            "scheduleDate": selectItem.scheduleDate,
            "categoryId": selectItem.categoryId,
            "categoryName": selectItem.categoryName
        }
        self.setState({
            btnDisabled:true
        },()=>{
            $.ajax({
                method: 'POST',
                url : `${API_PATH}/launch-api/schedule/scheduledetail`,
                xhrFields: {
                    withCredentials: true
                },
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(requestParams),
                success: function (res) {
                    self.setState({
                        btnDisabled:false
                    })
                    if(res.resultCode=='100'){
                        refreshHandle(true)
                        hideOccupiedModule()
                        showToast({
                            bgColor:false,
                            msg:'新增预占成功'
                        })
                    }
                }
            })
        })


    }
    editRequest(){
        // 编辑新增
        let self = this
        let verifyResult = this.verifyHandle()
        if(!verifyResult) return
        let {params,data} = this.state
        let {selectItem,refreshHandle,hideOccupiedModule,showToast} = this.props
        let requestParams = {
            "items": [
                {
                    "scheduleDate":selectItem.scheduleDate,
                    "userName":params.userName,
                    "groupNum":params.groupNum,
                    "times": params.times,
                }
            ],
            "scheduleDate": selectItem.scheduleDate,
            "categoryId": selectItem.categoryId,
            "categoryName": selectItem.categoryName
        }
        self.setState({
            btnDisabled:true
        },()=>{
            $.ajax({
                method: 'PUT',
                url : `${API_PATH}/launch-api/schedule/scheduledetail/${data.id}`,
                xhrFields: {
                    withCredentials: true
                },
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(requestParams),
                success: function (res) {
                    self.setState({
                        btnDisabled:false
                    })
                    if(res.resultCode=='100'){
                        refreshHandle(true)
                        hideOccupiedModule()
                        showToast({
                            bgColor:false,
                            msg:'新增预占成功'
                        })
                    }
                }
            })
        })
    }
    editModifyRequest(){
        // 编辑修改
        let verifyResult = this.verifyHandle()
        if(!verifyResult) return
        let {params,selectSchedule} = this.state
        let {selectItem,refreshHandle,hideOccupiedModule,showToast} = this.props
        let requestParams = {
            "userName": params.userName,
            "scheduleDate": selectItem.scheduleDate,
            "times": params.times,
            "groupNum": params.groupNum,
        }
        let self=this
        self.setState({
            btnDisabled:true
        },()=>{
            $.ajax({
                method: 'PUT',
                url : `${API_PATH}/launch-api/schedule/scheduleitem/${selectSchedule.id}`,
                xhrFields: {
                    withCredentials: true
                },
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(requestParams),
                success: function (res) {
                    self.setState({
                        btnDisabled:false
                    })
                    if(res.resultCode=='100'){
                        refreshHandle(true)
                        hideOccupiedModule()
                        showToast({
                            bgColor:false,
                            msg:'修改成功'
                        })
                    }
                }
            })
        })

    }
    verifyHandle(){
        let verifyResult = true
        let verifyFlag = {}
        let {params,leftNum,flag} = this.state
        for(let v in params){
            if(params[v]==''){
                verifyFlag[v]=false
                verifyResult = false
            }
        }
        // if(flag!='EDIT'&&params.groupNum>leftNum){
        //     verifyFlag.groupNum=false
        //     verifyResult = false
        // }
        if(flag=='EDIT'&&params.groupNum>this.props.selectItem.groupCount){
            verifyFlag.groupNum=false
            verifyResult = false
        }
        this.setState({verifyFlag})
        return verifyResult
    }
    barrierHandle() {
        this.setState({barrier: false})
    }

    unBarrierHandle() {
        this.setState({barrier: true})
    }
    getCookie(key) {
        var aCookie = document.cookie.split("; ");
        for (var i = 0; i < aCookie.length; i++) {
            var aCrumb = aCookie[i].split("=");
            if (key == aCrumb[0])
                return unescape(aCrumb[1]);
        }
        return null;
    }
    getFuzzyData(e) {
        let {params} = this.state
        params.userName = e.target.value
        this.setState({params})
        const userName = e.target.value
        const loginUser = this.getCookie('username');
        let self = this
        $.ajax({
            method: 'POST',
            url : `${API_PATH}/launch-api/schedule/usernames`,
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json;charset=utf-8',
            data: `{"userName":"${userName}","loginUser":"${loginUser}"}`,
            beforeSend: function(xhr) {
                xhr.withCredentials = true;
            },
            success: function (res) {
                self.setState({
                    fuzzyList: res.resultContent
                }) 
            }
        })
    }
    focusHandle() {
        this.setState({
            FuzzyDisplay: true,
            tempUserName: this.state.params.userName
        })
    }
    blurHandle() {
        if (this.state.barrier) {
            let {params,tempUserName} = this.state
            params.userName = tempUserName
            this.setState({
                FuzzyDisplay: false,
                params:params
            })
        }
    }
    selectedOption(value) {
        let {params} = this.state
        params.userName = value
        this.setState({
            params,
            FuzzyDisplay: false,
            tempUserName: value
        })
    }
    render() {
        const {params,flag,data,timesCode,timesVal,verifyFlag,leftNum,fuzzyList,FuzzyDisplay,cookie_username} = this.state
        let { selectItem,status,timeMap } = this.props
        return (
            <div className="occupied-box">
                <div className="occupied-content">
                    {
                        status
                        ?
                        <div className="occupied-content-title">预占额度</div>
                        :
                        <div className="occupied-content-title">已占额度</div>
                    }
                    <div className="occupied-content-des">
                        <div className="occupied-content-des-item">
                            <span>类目：</span>
                            <span>{selectItem.categoryName}</span>
                        </div>
                        <div className="occupied-content-des-item">
                            <span>时间：</span>
                            <span>{selectItem.scheduleDate.split('-')[1]+'月'+selectItem.scheduleDate.split('-')[2]+'日'}</span>
                        </div>
                        <div className="occupied-content-des-item">
                            <span>群数量：</span>
                            <span>{selectItem.groupCount}</span>
                        </div>
                    </div>
                    {
                        status||(!status&&flag!='')
                        ?
                        <div className="occupied-content-form">
                            <div className="occupied-content-form-item">
                                <span className="occupied-content-form-item-title">预占账号：</span>
                                <div className="occupied-content-form-item-ipt-box fuzzySearch" style={{border: verifyFlag.userName===false?'1px solid red':''}}
                                    onMouseEnter={this.barrierHandle.bind(this)}
                                    onMouseLeave={this.unBarrierHandle.bind(this)}>
                                    <input className="occupied-content-form-item-input" placeholder="请输入预占账号" 
                                        value={params.userName}
                                        onInput={this.getFuzzyData.bind(this)}
                                        onFocus={this.focusHandle.bind(this)}
                                        onBlur={this.blurHandle.bind(this)}
                                        style={{border: verifyFlag.userName===false?'1px solid red':''}}
                                    />
                                    {
                                        fuzzyList 
                                        ?<FuzzyOptions
                                            FuzzyDisplay={FuzzyDisplay}
                                            options={fuzzyList}
                                            selectedOption={this.selectedOption.bind(this)}
                                        /> : null
                                    }
                                </div>
                            </div>
                            <div className="occupied-content-form-item" style={{marginBottom:0}}>
                                <span className="occupied-content-form-item-title">预占群数量：</span>
                                <div className="occupied-content-form-item-ipt-box number-input" style={{border: verifyFlag.groupNum===false?'1px solid red':''}}>
                                    <input type="number" className="occupied-content-form-item-input" placeholder="请输入预占群数量" value={params.groupNum} onChange={this.iptGroupNum} />
                                </div>
                            </div>
                            <div className="tip" style={{fontSize:'12px',color:'#B5BDC6',lineHeight:'20px',paddingLeft:'92px',height:'20px'}}>剩余可分配群数{leftNum}</div>
                            <SelectBox
                                selectTitle={'请选择时间段'}
                                selectLabel={'预占时间段：'}
                                selectOption={timesVal}
                                paramName={'times'}
                                paramValue={timesCode}
                                setparamsHandle={this.setparamsHandle}
                                paramDefault={
                                    timesCode.findIndex(v=>v==params.times)=='-1'?undefined:
                                    {
                                    id:params.times==''?-1:timesCode.findIndex(v=>v==params.times),
                                    name: timesVal[params.times==''?-1:timesCode.findIndex(v=>v==params.times)]
                                    }
                                }
                                verify={verifyFlag.times!==false}
                            />
                        </div>
                        :
                        <div className="occupied-content-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>用户账号</th>
                                        <th>时间段</th>
                                        <th>预占群数</th>
                                        <th>素材</th>
                                        {
                                            selectItem.timeFlag?<th>操作</th>:''
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data&&data.items.map((item,index) => {
                                            return (
                                            <tr key={index}>
                                                <td>{item.userName?item.userName:'-'}</td>
                                                <td>{timeMap.find(v => v.code==item.times)?timeMap.find(v => v.code==item.times).times:'-'}</td>
                                                <td>{item.groupNum}</td>
                                                <td>{item.materialType?typeMap[item.materialType]:'-'}</td>
                                                {
                                                   selectItem.timeFlag?
                                                    !item.materialType? <td>
                                                        <span className="td-edit" onClick={()=>{this.editBtn(item)}}>编辑</span>
                                                        {cookie_username=='admin'?<span className="td-line"></span>:''}
                                                        {cookie_username=='admin'?<span className="td-delete" onClick={()=>{this.deleteBtn(item)}}>删除</span>:''}
                                                    </td>
                                                    :<td>-</td>
                                                    :''
                                                }
                                            </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    }
                    <div className="occupied-content-btn-box">
                        <div className="occupied-content-btn refund-btn" onClick={this.refundBtn}>取消</div>
                        {
                            selectItem.timeFlag?<button disabled={this.state.btnDisabled} className="occupied-content-btn new-btn" onClick={this.addNewBtn}>{flag=='EDIT'?'确认保存':'新增预占'}</button>:''
                        }
                    </div>
                </div>
            </div>
        )
    }
}