import React from 'react'
import {unescapeHtml} from './helpers'

export default function Question(props){
   
    const answers = props.qa.a.map( (ans, i) => {
        
        const styles = { backgroundColor: props.done ? 
                   props.qa.ans_loc === i ? 
                         "#94D7A2" 
                         : (props.qa.selected === i ? "#F8BCBC" : "#F5F7FB")
            : ( props.qa.selected === i ? "#D6DBF5" : "#F5F7FB")}
        
        //const styles = { backgroundColor: props.qa.selected === i ? "#D6DBF5" : "white" }
        
        return <div key={i} className="answer" 
                     style={ styles  }
                     onClick={()=>props.select(props.qa.id, i)}>
           { unescapeHtml(ans) }
        </div> })
    
    return(
        <div className="question">
            <h3>{props.qa.q}</h3>
            <div className="answers">
                {answers}
            </div>
        </div>
    )
}