import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {sortByPriority} from './priorityCalculator';
import './App.css';

function App(){

  const [notifications,setNotifications]=useState([]);
  const [priorityNotifications,setPriorityNotifications]=useState([]);
  const [studentId,setStudentId]=useState('1042');
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    fetchNotifications();
  },[studentId]);

  const fetchNotifications=async()=>{

    setLoading(true);

    try{

      const response=await axios.get(
        `http://localhost:3000/api/notifications?student_id=${studentId}`
      );

      setNotifications(response.data.data);

      setPriorityNotifications(
        sortByPriority(response.data.data)
      );

    }catch(error){

      console.log('Fetch failed');

    }

    setLoading(false);
  };

  const markAsRead=async(id)=>{

    try{

      await axios.patch(
        `http://localhost:3000/api/notifications/${id}/read`
      );

      fetchNotifications();

    }catch(error){

      console.log('Update failed');

    }
  };

  return(
    <div className="App">

      <header>
        <h1>Campus Notifications</h1>

        <input
          type="number"
          value={studentId}
          onChange={(e)=>setStudentId(e.target.value)}
          placeholder="Student ID"
        />
      </header>

      <div className="container">

        <section className="priority-section">

          <h2>Priority Inbox</h2>

          {loading ? (

            <p>Loading...</p>

          ) : (

            <div className="notification-list">

              {priorityNotifications.map(notif=>(

                <div
                  key={notif.id}
                  className={`notification ${notif.type.toLowerCase()} ${notif.is_read ? 'read' : ''}`}
                >

                  <div className="notif-header">

                    <span className="type-badge">
                      {notif.type}
                    </span>

                    <span className="priority-score">
                      Priority: {notif.priority}
                    </span>

                  </div>

                  <p className="message">
                    {notif.message}
                  </p>

                  <div className="notif-footer">

                    <span className="timestamp">
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>

                    {!notif.is_read && (

                      <button onClick={()=>markAsRead(notif.id)}>
                        Mark as Read
                      </button>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        <section className="all-section">

          <h2>All Notifications</h2>

          <div className="notification-list">

            {notifications.map(notif=>(

              <div
                key={notif.id}
                className={`notification ${notif.type.toLowerCase()} ${notif.is_read ? 'read' : ''}`}
              >

                <div className="notif-header">

                  <span className="type-badge">
                    {notif.type}
                  </span>

                </div>

                <p className="message">
                  {notif.message}
                </p>

                <div className="notif-footer">

                  <span className="timestamp">
                    {new Date(notif.timestamp).toLocaleString()}
                  </span>

                  {!notif.is_read && (

                    <button onClick={()=>markAsRead(notif.id)}>
                      Mark as Read
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        </section>

      </div>

    </div>
  );
}

export default App;