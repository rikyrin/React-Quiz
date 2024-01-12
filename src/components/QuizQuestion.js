import AnswerOptions from "./AnswerOptions";

function QuizQuestion({ question, dispatch, answer }) {
    console.log(question);
    
    return (
        <div>
            <h4>{question.question}</h4>
            <AnswerOptions question={question} dispatch={dispatch} answer={answer} />
        </div>
    );
}

export default QuizQuestion
