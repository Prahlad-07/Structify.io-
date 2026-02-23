import React, { useEffect, useMemo, useState } from 'react';

import { Course } from '../model/Course';
import { Result } from '../model/Result';

import CourseSourceFactory from './CourseSource';
import ResultService from '../service/ResultService';

import '../css/profileLayout.css';
import '../css/content.css';

import ProfileCard from './ProfileCard';
import Exam from './Exam';

import CONTENT_NAME from '../utils/CONTENT_NAME';

export function Content() {
  const [name] = useState(localStorage.getItem('name'));
  const [surname] = useState(localStorage.getItem('surname'));

  return (
    <div className="bg">
      <div className="middle">
        <h1>{`Welcome ${name || ''} ${surname || ''}`.trim()}</h1>
        <h2>Choose a data structure from the top menu and start learning.</h2>
        <hr />
        <p>Structured lessons, visual examples, and quick exams in one place.</p>
      </div>
    </div>
  );
}

export function Profile() {
  const [uid] = useState(localStorage.getItem('uid'));
  const [results, setResults] = useState([new Result(0, -1)]);
  const [confirm, setConfirm] = useState(false);
  const [totalStar, setTotalStar] = useState(0);
  const [fiveStarCount, setFiveStarCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await ResultService.getByUID(uid);
        const res = ResultService.getResponse();

        if (!res || res.length === 0) {
          setResults([]);
        } else {
          const processedResults = res.map((element) => {
            const parsed = new Result();
            parsed.id = element.id;
            parsed.result = element.result;
            const course = element.course;
            parsed.course = new Course(course.id, course.name);
            return parsed;
          });

          setResults(processedResults);
          const totalStars = processedResults.reduce((sum, item) => sum + item.result, 0);
          const fiveStarItems = processedResults.filter((item) => item.result === 5).length;
          setTotalStar(totalStars);
          setFiveStarCount(fiveStarItems);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
      setConfirm(true);
    };

    fetchData();
  }, [uid]);

  if (!confirm) {
    return <div>Loading...</div>;
  }

  if (results.length === 0) {
    return (
      <div className="resultContent container-fluid">
        <ul className="results">
          <h1 className="align-center">Results</h1>
          <li className="glow-on-hover">
            You have not taken any exams yet. Choose a course and complete its quiz.
          </li>
        </ul>
        <ProfileCard resultCount={0} totalStar={0} fiveStarCount={0} />
      </div>
    );
  }

  return (
    <div className="resultContent container-fluid">
      <ul className="results">
        <h1 className="align-center">Results</h1>
        {results.map((element) => (
          <li key={element.id} className="glow-on-hover">
            {element.course.name}
            {[...Array(element.result)].map((_, i) => (
              <span className="fa fa-star fa-spin fa-xl" key={i}></span>
            ))}
          </li>
        ))}
      </ul>
      <ProfileCard resultCount={results.length} totalStar={totalStar} fiveStarCount={fiveStarCount} />
    </div>
  );
}

export default function Render({ contentName }) {
  const [course, setCourse] = useState(new Course(0));
  const [sectionIndex, setSectionIndex] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isCourseFinished, setIsCourseFinished] = useState(false);

  const isCourseContent = useMemo(
    () => contentName !== CONTENT_NAME.PROFILE && contentName !== CONTENT_NAME.CONTENT,
    [contentName]
  );

  const currentSection =
    course.id !== 0 && Array.isArray(course.sections) && course.sections.length > 0
      ? course.sections[sectionIndex]
      : undefined;

  useEffect(() => {
    if (!isCourseContent) {
      setConfirm(true);
      return;
    }

    const fetchData = async () => {
      try {
        const source = await CourseSourceFactory(contentName);
        const parsedCourse = new Course();
        Object.assign(parsedCourse, source);
        setCourse(parsedCourse);
        setSectionIndex(0);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setConfirm(true);
      }
    };

    setConfirm(false);
    fetchData();
  }, [contentName, isCourseContent]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        await ResultService.getByUIDandCourseId(localStorage.getItem('uid'), course.id);
        const result = ResultService.getResponse();
        setIsCourseFinished(Boolean(result && result.result === 5));
      } catch (error) {
        console.error('Error fetching course result:', error);
        setIsCourseFinished(false);
      }
    };

    if (course.id !== 0) {
      fetchResults();
    }
  }, [course.id]);

  const nextSection = () => {
    if (!course.sections || sectionIndex >= course.sections.length - 1) {
      return;
    }
    setSectionIndex((prev) => prev + 1);
  };

  const previousSection = () => {
    if (sectionIndex <= 0) {
      return;
    }
    setSectionIndex((prev) => prev - 1);
  };

  const handleExamClose = () => {
    setIsExamOpen(false);
    setIsExamStarted(false);
  };

  if (contentName === CONTENT_NAME.PROFILE) {
    return <Profile />;
  }

  if (contentName === CONTENT_NAME.CONTENT) {
    return <Content />;
  }

  if (!confirm || !currentSection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sidebar">
      <ul className="sidelist">
        <h1 className="align-center">{course.name}</h1>
        {course.sections.map((element, index) => (
          <li
            className={`glow-on-hover ${index === sectionIndex ? 'section-active' : ''}`}
            key={index}
            onClick={() => setSectionIndex(index)}
          >
            {`${index + 1}. ${element.title}`}
          </li>
        ))}
        <hr />
        {isCourseFinished ? (
          <li key="exam" className="exam">
            <center>You have already completed this course exam.</center>
          </li>
        ) : (
          <li key="exam" className="exam glow-on-hover" onClick={() => setIsExamOpen(true)}>
            <img
              src="https://cdn-icons-png.flaticon.com/32/10803/10803837.png"
              alt="Exam"
              className="leftitem"
            />
            <center>Go To Exam</center>
          </li>
        )}
      </ul>

      <div className="content textcontent">
        <h2>{currentSection.title}</h2>
        <p>{currentSection.contentText}</p>

        <button onClick={previousSection} aria-label="Previous section">
          <i className="fa fa-play" style={{ fontSize: '1rem', transform: 'scaleX(-1)' }}></i>
        </button>
        <button onClick={nextSection} className="rightitem" aria-label="Next section">
          <i className="fa fa-play" style={{ fontSize: '1rem' }}></i>
        </button>
      </div>

      <ul className="images">
        {(currentSection.imagePaths || []).map((path) => (
          <li key={path}>
            <img src={path} width={300} height={300} alt="Course visual" />
          </li>
        ))}
      </ul>

      {isExamOpen ? (
        <div id="myModal" className="modal container-fluid">
          <div id="myModalContent">
            {!isExamStarted ? (
              <>
                <span className="close" onClick={handleExamClose}>
                  &times;
                </span>
                <center id="text-content">Are you sure you want to start the exam?</center>
                <center id="text-content">
                  <i style={{ color: 'red' }}>*Once started, leaving may lose progress.</i>
                </center>
                <div className="buttons">
                  <button className="btn-danger" onClick={handleExamClose}>
                    Cancel
                  </button>
                  <button className="btn-alert" onClick={() => setIsExamStarted(true)}>
                    Start Exam
                  </button>
                </div>
              </>
            ) : (
              <Exam course={course} setIsExamOpen={handleExamClose} />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
