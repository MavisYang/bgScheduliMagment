import React, {Component, PropTypes} from 'react'

export default class FuzzyOptions extends Component {
    constructor(props){
        super(props)
    }
    handleOption(id,name){
        if(this.props.selectedOption){
            this.props.selectedOption(id,name)
        }
    }
    render(){
        const {options,FuzzyDisplay} = this.props
        return(
            <div className="optionUl"
                 style={{display:FuzzyDisplay?'block':'none'}}
            >
                <ul>
                    {options.map((item,i)=>{
                        return  <li
                            key={i}
                            id={item}
                            onClick={this.handleOption.bind(this,item,item)}
                        >{item} </li>
                    })}
                </ul>
            </div>
        )
    }
}