import { useEffect, useReducer } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import QuizQuestion from './components/QuizQuestion';
import NextButton from './components/NextButton';

const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch(action.type){
    case 'dataReceived': 
      return { ...state, 
               questions: action.payload, 
               status: 'ready',
              };
    case 'dataFailed':
      return { ...state, 
               status: 'error', 
              };
    case 'startQuiz':
      return { ...state, 
               status: 'active', 
              };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return { ...state, 
               answer: action.payload, 
               points: action.payload === question.correctOption 
                ? state.points + question.points
                : state.points , 
              };
    case 'nextQuestion':
      return{ ...state, 
              index: state.index + 1,
              answer: null,
            };
    default:
      throw new Error("Error action unknown");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const numQuestions = state.questions.length;

  useEffect(function() {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json() )
      .then((data) => dispatch({type: 'dataReceived', payload: data }) )
      .catch((err) => dispatch( { type: 'dataFailed' } ) );
  }, [] )

  return (
    <div className='app'>
      <Header />
      <Main>
        {state.status === 'loading' &&   <Loader /> }
        {state.status === 'error'   &&   <Error /> }
        {state.status === 'ready'   && ( <StartScreen numQuestions={numQuestions} dispatch={dispatch} /> )}
        {state.status === 'active'  && ( <>
                                          <QuizQuestion question={state.questions[state.index]} dispatch={dispatch} answer={state.answer} /> 
                                          <NextButton dispatch={dispatch} answer={state.answer} />
                                         </>
        )}
        
      </Main>
    </div>
  );
}

export default App;
