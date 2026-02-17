import React from 'react'

export default function ProfileCard({resultCount, totalStar, fiveStarCount}) {
    const avg = (resultCount === 0) ? 0 : (totalStar/resultCount).toFixed(2);
    const name = localStorage.getItem("name") || "User";
    const surname = localStorage.getItem("surname") || "";
    const mail = localStorage.getItem("mail") || "user@example.com";
    
    return (
        <div className='profile'>
            <img 
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" 
              alt={`${name} ${surname} profile`}
              width={100}
              style={{marginBottom:"2rem", borderRadius: "50%", border: "3px solid #6366f1"}} 
            />
            <div className='name'><b>{name} {surname}</b></div>
            <div style={{marginBottom:"3rem"}}><i>{mail}</i>
                <hr />
            </div>
            <div className='statistic'>
                <div className='stat-item'>
                    <div className='stat-label'>Average
                        <hr />
                    </div>
                    <div className='stat-value'>
                        <center><span className="fa fa-star fa-spin fa-xl"></span><span className='stat-number'>{avg}</span></center>
                    </div>
                </div>
                <div className='stat-item'>
                    <div className='stat-label'>Completed Courses
                        <hr />
                    </div>
                    <div className='stat-value'>
                        <center><i className="fa-brands fa-stack-overflow"></i><span className='stat-number'>{resultCount}/5</span></center>
                    </div>
                </div>
                <div className='stat-item'>
                    <div className='stat-label'>5-Star Results
                        <hr />
                    </div>
                    <div className='stat-value'>
                        <center><span className='stat-number'>{fiveStarCount}</span></center>
                    </div>
                </div>
            </div>

        </div>
    )
}
