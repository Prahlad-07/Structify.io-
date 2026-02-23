import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthCheckBuilder } from './AuthCheck';
import Render from './Content';
import '../css/layout.css';
import '../css/mymodal.css';
import CONTENT_NAME from '../utils/CONTENT_NAME';

export default function CourseMain() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = location.state === true || Boolean(localStorage.getItem('token'));
  const [name] = useState(localStorage.getItem('name'));
  const [surname] = useState(localStorage.getItem('surname'));
  const [currentContent, setCurrentContent] = useState(CONTENT_NAME.CONTENT);
  const [isOpen, setIsOpen] = useState(false);

  const courseTabs = useMemo(
    () => [
      {
        key: CONTENT_NAME.STACK,
        label: 'Stack',
        icon: 'https://cdn-icons-png.flaticon.com/32/2111/2111690.png'
      },
      {
        key: CONTENT_NAME.QUEUE,
        label: 'Queue',
        icon: 'https://cdn-icons-png.flaticon.com/32/8201/8201691.png'
      },
      {
        key: CONTENT_NAME.LINKEDLIST,
        label: 'Linked List',
        icon: 'https://cdn-icons-png.flaticon.com/32/3462/3462381.png'
      },
      {
        key: CONTENT_NAME.TREE,
        label: 'Tree',
        icon: 'https://cdn-icons-png.flaticon.com/32/4160/4160135.png'
      },
      {
        key: CONTENT_NAME.GRAPH,
        label: 'Graph',
        icon: 'https://cdn-icons-png.flaticon.com/32/4858/4858761.png'
      }
    ],
    []
  );

  const confirmLogout = () => {
    localStorage.clear();
    setIsOpen(false);
    navigate('/');
  };

  if (isAuth !== true) {
    return AuthCheckBuilder('/courseMain');
  }

  return (
    <div className="courseMainBody">
      <nav className="container-fluid">
        <div className="leftitem">
          <ul>
            <li className="menu-item-accent" onClick={() => navigate('/freespace')}>
              <img src="https://cdn-icons-png.flaticon.com/32/10061/10061724.png" alt="Free Space" />
              Open Free Space
            </li>
          </ul>
        </div>

        <div className="centeritem">
          <ul>
            {courseTabs.map((tab) => (
              <li
                key={tab.key}
                className={currentContent === tab.key ? 'menu-item-active' : ''}
                onClick={() => setCurrentContent(tab.key)}
              >
                <img src={tab.icon} alt={tab.label} />
                {tab.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rightitem">
          <ul>
            <li
              className={currentContent === CONTENT_NAME.PROFILE ? 'menu-item-user menu-item-active' : 'menu-item-user'}
              onClick={() => setCurrentContent(CONTENT_NAME.PROFILE)}
            >
              <i className="fa fa-user fa-xl"></i>
              {` ${name || ''} ${surname || ''}`.trim() || 'My Profile'}
            </li>
            <li className="menu-item-logout" onClick={() => setIsOpen(true)}>
              Log Out
            </li>
          </ul>
        </div>
      </nav>

      <Render contentName={currentContent} />

      {isOpen ? (
        <div id="myModal" className="modal container-fluid">
          <div className="modal-content">
            <span className="close" onClick={() => setIsOpen(false)}>
              &times;
            </span>
            <center id="text-content">Are you sure you want to log out?</center>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button className="btn-alert" onClick={confirmLogout}>
                Log Out
              </button>
              <button className="btn-alert" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
