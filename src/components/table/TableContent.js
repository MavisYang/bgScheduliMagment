/* eslint-disable */
import React,{Component} from 'react'
import $ from 'jquery'
import {API_PATH} from '../../contants/OriginName'

export default class TableContent extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: [],
            daysData: null
        }
        this.pullData = this.pullData.bind(this)
        this.getDate = this.getDate.bind(this)
        this.nextMonth = this.nextMonth.bind(this)
        this.prevMonth = this.prevMonth.bind(this)
        this.editHandle = this.editHandle.bind(this)
    }
    componentWillMount(){
        this.getDate()
    }
    componentDidMount(){
        const {daysData} = this.state
        this.pullData(daysData)
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.refreshFlag){
            this.pullData(this.state.daysData)
            this.props.refreshHandle(false)
        }
    }
    pullData(daysData){
        const self = this
        const scheduleTemplate = daysData.dayCount.map((v,i)=>{
            return {
                scheduleDate : `${daysData.year}-${daysData.month<10?'0'+daysData.month:daysData.month}-${v<10?'0'+v:v}`,
                scheduleNum : 0,
                timeFlag: daysData.year>daysData.currentYear||(daysData.year==daysData.currentYear&&daysData.month>daysData.currentMonth)||(daysData.year==daysData.currentYear&&daysData.month==daysData.currentMonth&&v>=daysData.currentDay)
            }
        })
        $.ajax({
            method: 'POST',
            url : `${API_PATH}/launch-api/schedule/schedulelist`,
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json;charset=utf-8',
            data: `{ "scheduleDate": "${daysData.year}-${daysData.month<10?'0'+daysData.month:daysData.month}"}`,
            xhrFields: {withCredentials: true},
            success: function (res) {
                let resData = res.resultContent.map(((item,i)=>{
                    return {
                        ...item,
                        schedule: scheduleTemplate.map((v,i)=>{
                            let schedule = item.schedule.find((schedule,i)=>schedule.scheduleDate==v.scheduleDate)
                            return schedule?{
                                ...schedule,
                                timeFlag: v.timeFlag
                            }:v
                        })
                    }
                }))
                self.setState({
                    data: resData
                })
            }
        })
    }
    getDate(){
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()+1
        let day = date.getDate()
        let dayCount = new Date(year,month,0).getDate()
        let daysData = {
            year: year,
            month: month,
            dayCount: Array.from({length:dayCount}, (v,k) => k+1),
            currentYear: year,
            currentMonth: month,
            currentDay: day,
            nextYear: month+1>12?year+1:year,
            nextMonth: month+1>12?1:month+1,
            prevYear: month-1<1?year-1:year,
            prevMonth: month-1<1?12:month-1
        }
        this.setState({daysData})
    }
    nextMonth(){
        let {daysData} = this.state
        let year = daysData.month+1>12?daysData.year+1:daysData.year
        let month = daysData.month+1>12?1:daysData.month+1
        let dayCount = new Date(year,month,0).getDate()
        if(month==daysData.nextMonth||month==daysData.currentMonth){
            daysData = Object.assign(daysData,{
                year: year,
                month: month,
                dayCount: Array.from({length:dayCount}, (v,k) => k+1)
            })
            this.pullData(daysData)
            this.setState({daysData})
        }
    }
    prevMonth(){
        let {daysData} = this.state
        let year = daysData.month-1<1?daysData.year-1:daysData.year
        let month = daysData.month-1<1?12:daysData.month-1
        let dayCount = new Date(year,month,0).getDate()
        if(month==daysData.prevMonth||month==daysData.currentMonth){
            daysData = Object.assign(daysData,{
                year: year,
                month: month,
                dayCount: Array.from({length:dayCount}, (v,k) => k+1)
            })
            this.pullData(daysData)
            this.setState({daysData})
        }
    }
    editHandle(item,v){
        if(!v.timeFlag&&v.scheduleNum==0) return
        let data = {
            "scheduleDate": v.scheduleDate,
            "scheduleId": v.scheduleId,
            "categoryId": item.categoryId,
            "categoryName": item.categoryName,
            "groupCount":item.groupCount,
            "timeFlag": v.timeFlag
        }
        if(v.scheduleNum>0){
            // 修改
            this.props.showOccupiedModule(data,true,false)
        }else{
            // 编辑
            this.props.showOccupiedModule(data,true,true)
        }
    }
    render(){
        const {data,daysData} = this.state
        return (
            <div className="tableContent">
                <div className="inner">
                    <div className="left">
                        <table className="leftTable" cellSpacing="0" cellPadding="0">
                            <thead>
                                <tr>
                                    <th>类目</th>
                                    <th>群数量</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((item,index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.categoryName}</td>
                                                <td>{item.groupCount}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="right">
                        <div className="month">
                            <span className="prev" onClick={this.prevMonth}>上一月</span>
                            <span className="time">{daysData.year}年{daysData.month}月</span>
                            <span className="next" onClick={this.nextMonth}>下一月</span>
                        </div>
                        <div className="rightInner">
                            <table className="rightTable">
                                <thead>
                                    <tr>
                                        {
                                            daysData&&daysData.dayCount.map((v,i)=>{
                                                return <th key={i} className={v==daysData.currentDay&&daysData.month==daysData.currentMonth?'current':''}>{v}</th>
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((item,index)=>{
                                            return (
                                                <tr key={index}>
                                                    {
                                                        item.schedule.map((v,i)=>{
                                                            return (
                                                                <td className={v.materialFlag==1?'active':''} key={i} onClick={()=>{this.editHandle(item,v)}}>{v.scheduleNum}</td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                        )})
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}