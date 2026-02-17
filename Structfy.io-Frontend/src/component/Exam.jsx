import React, { useEffect, useMemo, useState } from 'react';
import '../css/exam.css';
import ResultService from '../service/ResultService';
import { CreateResultRequest } from '../model/Result';

function filterQuestionsByLevel(questions, level) {
  return (questions || []).filter((q) => q.level === level);
}

function selectRandomQuestions(questions, count) {
  const pool = [...questions];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

export default function Exam({ course, setIsExamOpen }) {
  const [questionLevel, setQuestionLevel] = useState(0);
  const [readyQuestions, setReadyQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResultSaved, setIsResultSaved] = useState(false);
  const [isLevelStepOpen, setIsLevelStepOpen] = useState(true);
  const [levelError, setLevelError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const currentQuestion = useMemo(
    () => readyQuestions[questionIndex] || null,
    [readyQuestions, questionIndex]
  );

  useEffect(() => {
    if (!questionLevel) return;

    const byLevel = filterQuestionsByLevel(course?.questions, questionLevel);
    const selected = selectRandomQuestions(byLevel, 5);

    setReadyQuestions(selected);
    setQuestionIndex(0);
    setAnswer(null);

    if (selected.length === 0) {
      setLevelError('No questions found for this difficulty. Please choose another level.');
    } else {
      setLevelError('');
    }
  }, [course?.questions, questionLevel]);

  const handleOptionChange = (e) => {
    if (!currentQuestion) return;
    const selected = currentQuestion.choices?.[Number(e.target.value)];
    if (selected) setAnswer(selected);
  };

  const submitAndNext = () => {
    if (!currentQuestion) return;

    if (answer?.isAnswer) {
      setCorrectCount((prev) => prev + 1);
    }

    setAnswer(null);
    const form = document.getElementById('options');
    if (form) form.reset();

    setQuestionIndex((prev) => prev + 1);
  };

  const finishExam = async () => {
    if (!course?.id) return;

    const finalScore = correctCount + (answer?.isAnswer ? 1 : 0);
    const payload = new CreateResultRequest(
      finalScore,
      localStorage.getItem('uid'),
      course.id
    );

    try {
      setStatusMessage('Saving results...');
      await ResultService.add(payload);
      setStatusMessage(
        'Results have been saved successfully. You can review them in your profile tab.'
      );
      setIsResultSaved(true);
    } catch (error) {
      setStatusMessage('Failed to save results. Please try again.');
    }
  };

  const startExam = () => {
    if (!questionLevel) {
      setLevelError('Please select exam difficulty.');
      return;
    }
    if (readyQuestions.length === 0) {
      setLevelError('No questions found for this difficulty. Please choose another level.');
      return;
    }
    setIsLevelStepOpen(false);
  };

  const isLastQuestion = readyQuestions.length > 0 && questionIndex === readyQuestions.length - 1;

  return (
    <div className="container-fluid">
      <div className="exam-root">
        <div className="quiz-header">
          <h2>
            <center>{course?.name} Exam</center>
          </h2>
          <hr />
          <img src="https://cdn-icons-png.flaticon.com/64/671/671829.png" alt="Exam" />
        </div>

        <div className="quiz-body">
          {isConfirmOpen ? (
            <>
              <center id="description">
                <b>Are you sure you want to finish the exam?</b>
              </center>
              <div className="container-fluid confirm-buttons">
                <button className="btn-danger col-2" onClick={() => setIsConfirmOpen(false)}>
                  Cancel
                </button>
                <button
                  className="btn-info col-2 rightitem"
                  onClick={finishExam}
                  disabled={isResultSaved}
                >
                  Finish Exam
                </button>
              </div>
              {statusMessage ? <center id="description">{statusMessage}</center> : null}
              {isResultSaved ? (
                <center>
                  <button className="btn-danger col-2" onClick={() => setIsExamOpen(false)}>
                    Close
                  </button>
                </center>
              ) : null}
            </>
          ) : isLevelStepOpen ? (
            <>
              <span>Please select exam difficulty</span>
              <form
                className="leveloptions"
                id="options"
                onChange={(e) => setQuestionLevel(Number(e.target.value))}
              >
                <div className="option">
                  <input type="radio" name="option" value={1} />
                  <label>Easy</label>
                </div>
                <div className="option">
                  <input type="radio" name="option" value={2} />
                  <label>Medium</label>
                </div>
                <div className="option">
                  <input type="radio" name="option" value={3} />
                  <label>Hard</label>
                </div>
              </form>
              {levelError ? <span style={{ color: 'red' }}>{levelError}</span> : null}
              <button className="btn-answer-submit col-3 rightitem" onClick={startExam}>
                Start Exam&nbsp;
              </button>
            </>
          ) : currentQuestion ? (
            <>
              <span>
                <b>{`${questionIndex + 1}. ${currentQuestion.description} ?`}</b>
              </span>
              <form className="options" id="options">
                {(currentQuestion.choices || []).map((choice, index) => {
                  const id = `option-${index}`;
                  return (
                    <div className="option" key={id}>
                      <input
                        type="radio"
                        name="option"
                        id={id}
                        value={index}
                        onClick={handleOptionChange}
                      />
                      <label htmlFor={id}>{choice.description}</label>
                    </div>
                  );
                })}
              </form>
              <div>
                {isLastQuestion ? (
                  <button className="btn-answer-submit col-3" onClick={() => setIsConfirmOpen(true)}>
                    Submit and Finish Exam&nbsp;
                    <img src="https://cdn-icons-png.flaticon.com/32/65/65578.png" alt="Finish" />
                  </button>
                ) : (
                  <button className="btn-answer col-3" onClick={submitAndNext}>
                    Submit and Continue&nbsp;
                    <img src="https://cdn-icons-png.flaticon.com/32/1055/1055441.png" alt="Next" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <center>No questions available. Please close and try another level.</center>
          )}
        </div>
      </div>
    </div>
  );
}
