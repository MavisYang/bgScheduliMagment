import React,{Component} from 'react'
import './navi.css'

export default class  extends Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    render(){
        return (
            <div className="naviBox">
                <div className="navi active">线上群</div>
                {/* <div className="navi">线下群</div> */}
            </div>
        )
    }
}