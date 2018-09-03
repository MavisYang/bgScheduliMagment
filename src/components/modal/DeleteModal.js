import React, { Component } from 'react';
import './modal.css'
import $ from 'jquery'
import {API_PATH} from '../../contants/OriginName'

export default class DeleteModal extends Component {
    constructor(props) {
        super(props)
        this.refundBtn = this.refundBtn.bind(this)
        this.confirmBtn = this.confirmBtn.bind(this)
    }
    refundBtn() {
        //关闭
        this.props.hideDeleteModal();
    }
    confirmBtn() {
        const {selectScheduleId} = this.props
        const self = this
        $.ajax({
            method: 'DELETE',
            url : `${API_PATH}/launch-api/schedule/scheduleitem/${selectScheduleId}`,
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
                self.props.hideDeleteModal()
                self.props.hideOccupiedModule()
                self.props.showToast({
                    bgColor:true,
                    msg:'删除成功'
                })
                self.props.refreshHandle(true)
            }
        })
    }
    render() {
        return (
            <div className="delete-box">
                <div className="delete-content">
                    <img className="delete-content-img" src="https://wx.gemii.cc/gemii/cdn/delete.png" onClick={this.refundBtn} />
                    <div className="delete-content-des">确定删除么？</div>
                    <div className="delete-content-btn" onClick={this.confirmBtn}>确定</div>
                </div>
            </div>
        )
    }
}