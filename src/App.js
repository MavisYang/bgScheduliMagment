import React, { Component } from 'react';
import './App.css';
import Navi from './components/navi/Navi'
import Table from './components/table/Table'
import {API_PATH} from './contants/OriginName'
import $ from 'jquery'

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      timeMap:[]
    }
  }
  componentDidMount(){
    this.getTimes()
  }
  getTimes(){
    const self = this
    $.ajax({
            method: 'GET',
            url : `${API_PATH}/launch-api/schedule/times`,
            xhrFields: {
              withCredentials: true
            },
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
              self.setState({
                timeMap: res.resultContent
              }) 
            }
    })
  }
  render() {
    const {timeMap} = this.state
    console.log(timeMap)
    return (
      <div className="App">
        <Navi />
        <Table timeMap={timeMap}/>
      </div>
    );
  }
}

export default App;
