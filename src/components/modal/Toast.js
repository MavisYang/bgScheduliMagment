import React, { Component } from 'react'
import './modal.css'

export default class Toast extends Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.hideToast()
        }, 3000);
    }
    render() {
        let { toastParam } = this.props;
        return (
            <div className="toastShow">
                <div className={toastParam.bgColor ? "toast-box bgGreen" : "toast-box bgBlue"} >{toastParam.msg}</div>
            </div>
        )
    }
}