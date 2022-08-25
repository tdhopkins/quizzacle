import React, {useState, useEffect} from 'react'
import Question from './Question'
import {unescapeHtml} from './helpers'
// import data from './data'
import './style.css'

export default function App() {
    const [questions, setQuestions] = useState( [] )
    const [done, setDone] = useState(false)
    const [numCorrect, setNumCorrect] = useState(0)
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [numQuestions, setNumQuestions] = useState(5)
    
    const questionElements = questions.map( (d,i) => (
            <Question key={i} qa={d} select={selectAns} done={done} />) )
    
    function selectAns(qId, ansId) {
        // console.log("Question: ", qId, " Ans: ", ansId)
        setQuestions( prev => { 
            return prev.map( qaObj => {
                if( qaObj.id === qId ){
                    return {...qaObj, selected: ansId}
                } else {
                     return qaObj;
                }
            })
        })
    }
    
    
    function randomLoc() {
        return Math.floor( Math.random() * 4 )
    }

    
    function getQuestionsFromAPI() {
        fetch(`https://opentdb.com/api.php?amount=${+numQuestions}&difficulty=medium&type=multiple`)
            .then( res => res.json())
            .then( data => {
                console.log("returned: ",data.results.length)
                return data.results.map( (quiz, i) => {
                    const randLoc = randomLoc()
                    quiz.incorrect_answers.splice(randLoc,0,quiz.correct_answer)
                    return {
                        id: i,
                        q: unescapeHtml(quiz.question),
                        a: quiz.incorrect_answers,
                        ans: quiz.correct_answer,
                        ans_loc: randLoc, 
                        selected: null,
                    }
                })
            })
            .then( data => setQuestions( data ) )
    }
    
    function submitAnswers() {
        if( !done ){
            setDone( true )
            const numCorrect = questions.map( q => q.ans_loc === q.selected ? 1 : 0 ).reduce((a,b) => a + b, 0 )
            setNumCorrect( numCorrect )
        } else {
            getQuestionsFromAPI()
            setDone( false )
        }
    }

    function startGame() {
        setIsGameStarted( true )
    }

    useEffect(()=>{
        isGameStarted && getQuestionsFromAPI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ numQuestions, isGameStarted])

    // const optionEls = [5,10, 15,20].map( el => <option key={el} value={`${el}`}>{el}</option> )

    function handleNumQuestions(e) {
        e.preventDefault()
        const {value} = e.target

        setNumQuestions( value )
    }
    // console.log("Started: ", isGameStarted, " NumQs: ", questions.length)
    return(
        <main>
            { isGameStarted  ?    
                questions.length === +numQuestions ?
                    <div className="container">
                        {questionElements}
                        <div className="footer">
                            { questions.length && <><span>{ done && `You scored ${numCorrect}/${numQuestions} correct answers` }</span><button onClick={submitAnswers}>{done ?  "Play Again" : "Submit" }</button></>  }           
                        </div>
                    </div>
                :
                    null
            : 
                <div className="container">
                    <div className="game-text">
                        <h1>QUIZZACLE</h1>
                        <label>Num Questions</label>
                        <input type="range" min="5" max="25" step="5" value={numQuestions} onChange={handleNumQuestions} />
                        <h3>{numQuestions}</h3>
                        <button className="start-btn" onClick={startGame}>Start Quiz</button>
                    </div>
                </div>
            }
        </main>
    )
    
}