import React,{Component} from 'react'
import './table.css'
import TableContent from './TableContent'
import OccupiedModule from '../modal/OccupiedModule'
import DeleteModal from '../modal/DeleteModal'
import Toast from '../modal/Toast'

export default class Table extends Component {
    constructor(props){
        super(props)
        this.state={
            selectItem:{
                "scheduleDate": "",
                "categoryId": 0,
                "categoryName": "",
                "scheduleId":"",
                "groupCount":0
            },
            editFlag: false,
            editStatus: true,
            refreshFlag: false,
            deleteFlag: false,
            selectScheduleId: '',
            toastStatus: false,
            toastParam: {
                bgColor:true,
                msg:'新增成功'
            }
        }
        this.showOccupiedModule = this.showOccupiedModule.bind(this)
        this.hideOccupiedModule = this.hideOccupiedModule.bind(this)
        this.refreshHandle = this.refreshHandle.bind(this)
        this.showDeleteModal = this.showDeleteModal.bind(this)
        this.hideDeleteModal = this.hideDeleteModal.bind(this)
        this.showToast = this.showToast.bind(this)
        this.hideToast = this.hideToast.bind(this)
    }
    showOccupiedModule(selectItem,editFlag,editStatus){
        // editStatus : true 新增，false 修改
        this.setState({
          selectItem,
          editFlag,
          editStatus
        })
    }
    hideOccupiedModule(){
        this.setState({
            editFlag: false
        })
    }
    refreshHandle(flag){
        this.setState({
            refreshFlag: flag
        })
    }
    showDeleteModal(id){
        this.setState({
            deleteFlag: true,
            selectScheduleId: id
        })
    }
    hideDeleteModal(){
        this.setState({deleteFlag: false})
    }
    showToast(toastParam){
        this.setState({
            toastStatus: true,
            toastParam: toastParam
        })
    }
    hideToast(){
        this.setState({
            toastStatus: false
        })
    }
    render(){
        const {selectItem,editFlag,editStatus,refreshFlag,deleteFlag,selectScheduleId,toastStatus,toastParam} = this.state
        const {timeMap} = this.props
        return (
            <div className="tableBox">
                <div className="tableTitleBox">
                    <div className="signs">
                        <div className="item">已占任务的排期</div>
                        <div className="item">未占任务的排期</div>
                    </div>
                    {/* <div className="downloadBtn">下载排期表</div> */}
                </div>
                <TableContent 
                    showOccupiedModule={this.showOccupiedModule}
                    refreshFlag={refreshFlag}
                    refreshHandle={this.refreshHandle}
                />
                {
                    editFlag
                    ?<OccupiedModule 
                        selectItem={selectItem}
                        status={editStatus}
                        hideOccupiedModule={this.hideOccupiedModule}
                        timeMap={timeMap}
                        refreshHandle={this.refreshHandle}
                        showDeleteModal={this.showDeleteModal}
                        showToast={this.showToast}
                    />:''
                }
                {
                    deleteFlag?
                    <DeleteModal 
                        hideOccupiedModule={this.hideOccupiedModule}
                        hideDeleteModal={this.hideDeleteModal}
                        selectScheduleId={selectScheduleId}
                        showToast={this.showToast}
                        refreshHandle={this.refreshHandle}
                    />
                    :''
                }
                {
                    toastStatus
                    ?<Toast 
                        toastStatus={toastStatus} 
                        toastParam={toastParam}
                        hideToast={this.hideToast}
                    />:''
                }
            </div>
        )
    }
}