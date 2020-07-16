import React, {useState, Component} from 'react';
import './styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import { faBars, faCaretDown, faCaretLeft, faFire, faSearch, faEye, faUserEdit, faTrash,faCheck,faSort, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-scroll'
import { useHistory } from "react-router-dom";

const fire = require('../images/fire.png');
const logo = require('../images/propit.png');



function Dashboard() {
  var regexMail = /\S+@\S+\.\S+/;
  const history = useHistory();
  const [taskArray, setTestArray] = React.useState([{
    TaskID: 0,
    DescriptionOfTask: '',
    Email: '',
    Phone: '',
    Username: '',
    Completed: 0,
    Date: '',
  }]);
  
  

  const [stateOfNewMission, setStateOfNewMission] = useState(false);
  const [errorRequest, setErrorRequest] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [canSendRequest, setCanSend] = useState(false);
  const [newMissionDetails, setNewMissionDetails] = useState({
    description: '',
    email: '',
    phone: ''
  });

  var indexToUpdate = 0;
  const [editMissionDetails, setEditMissionDetails] = useState({
    description: '',
    email: '',
    phone: '',
    completed : 0,
    id: 0
  });

  const [viewMissionDetails, setViewMissionDetails] = useState({
    description: '',
    email: '',
    phone: '',
    completed : 0,
  });

   const [commercial, setCommercial] = useState(true);
   React.useEffect(() => {
    fetch('http://proptestheroku.herokuapp.com/tasks', {
      method: 'get',
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('tokenP')
      })
    })
      .then(results => results.json())
      .then(data => {

        if(data.error && data.error === 401){
          localStorage.removeItem('tokenP')
          history.push("/login");
        }
        setTestArray(prevArray => [])
        data.map((item, k) => (
          item.Date = handleDate(item.Date.split('T')[0]),
          setTestArray(prevArray => [...prevArray, item]),
          console.log(item)
        ))
       
      }).catch((err) => {
       
      });
  }, []); 
    
  const handleDate = (str) =>{
    
    const date = str.split("-");
    return date[2]+"."+date[1]+"."+date[0];
  }
  const handleEditTaks = (k)=> {
    setEditMissionDetails(prevState => ({
      ...prevState,
     ["description"]: taskArray[k].DescriptionOfTask,
     ["email"]: taskArray[k].Email,
     ["phone"]: taskArray[k].Phone,
     ["completed"]: taskArray[k].Completed,
     ["id"]: taskArray[k].TaskID
  }));
  setCurrentIndex(k)
  setEditMode(true)
  
  }

  const handleViewTaks = (k)=> {
    console.log(taskArray[k])
    setViewMissionDetails(prevState => ({
      ...prevState,
     ["description"]: taskArray[k].DescriptionOfTask,
     ["email"]: taskArray[k].Email,
     ["phone"]: taskArray[k].Phone,
     ["completed"]: taskArray[k].Completed,
  }));
  setViewMode(true)
  
  }


  const handleChangeTextNewMission = e => {
    
    const { name, value } = e.target;
    setNewMissionDetails(prevState => ({
        ...prevState,
        [name]: value
    }));
    
    };



    const handleChangeTextEditMission = e => {
    
      
      const { name, value } = e.target;
  
        if(name === 'completed'){
          const checked = e.target.checked;
          setEditMissionDetails(prevState => ({
            ...prevState,
            [name]: checked === true ? 1 : 0
        }));
        }
      else{
        setEditMissionDetails(prevState => ({
          ...prevState,
          [name]: value
      }));
    }
      
      
      };
  const addNewTesk = async () => {
    
    fetch('http://proptestheroku.herokuapp.com/tasks/', {
      method: 'post',
      headers: new Headers({
        'Authorization': 'Bearer ' +localStorage.getItem('tokenP'),
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(newMissionDetails)
    })
      .then(results =>  results.json())
      .then(data => {
        data.Date = handleDate(data.Date.split('T')[0])
        setTestArray(prevArray => [...prevArray, data])
        setStateOfNewMission(false)
        setErrorRequest(false)

        setNewMissionDetails(prevState => ({
          ...prevState,
         ["description"]: '',
         ["email"]: '',
         ["phone"]: '',
      }));
      }).catch(err => setErrorRequest(true));
  }
  
  const sortByUsername = (() => {
    let newArr = [...taskArray];
    newArr.sort((a,b) => (a.Username > b.Username) ? 1 : ((b.Username > a.Username) ? -1 : 0)); 
    setTestArray(newArr)
    console.log(newArr)
  })

  const sortByDate = (() => {
    let newArr = [...taskArray];    
    newArr.sort((o1,o2) => {
      let date1 = new Date(o1.Date.replace(/\./g, '/'))
      let date2 = new Date(o2.Date.replace(/\./g, '/'))
      return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
    });
    setTestArray(newArr)

  })

  const signOut = () => {
          localStorage.removeItem('tokenP')
          history.push("/login");
  }
  const updateTesk = async () => {
    
    fetch('http://proptestheroku.herokuapp.com/tasks/', {
      method: 'put',
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('tokenP'),
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(editMissionDetails)
    })
      .then(results =>  {
        setEditMode(false)
        setErrorRequest(false)
        console.log(currentIndex)
        let newArr = [...taskArray];
        newArr[currentIndex].Completed = editMissionDetails.completed;
        newArr[currentIndex].DescriptionOfTask = editMissionDetails.description;
        newArr[currentIndex].Email = editMissionDetails.email;
        newArr[currentIndex].Phone = editMissionDetails.phone;
        setTestArray(newArr)
        setEditMissionDetails(prevState => ({
          ...prevState,
         ["description"]: '',
         ["email"]: '',
         ["phone"]: '',
         ["completed"]: 0,
         ["id"]: 0
      }));
      })
      .catch(err => console.log(err));
  }
  const removeTask = async (id) => {
    fetch('http://proptestheroku.herokuapp.com/tasks/'+id, {
      method: 'delete',
      headers: new Headers({
        'Authorization': 'Bearer ' +localStorage.getItem('tokenP') 
      })
    })
      .then(results => console.log(results))
      .then(data => {
        setTestArray(taskArray.filter(item => item.TaskID !== id)); 
      });
  }
      
      return (<div>
        
        <div className="navBar" >
          <div className="site-nav">
              <ul className="rightUl rightLi group">
                <li  className="dropdown small"><a><i><FontAwesomeIcon icon={faBars} /></i></a>
                  <div className="dropdown-content">
                    <a>מועדפים</a>
                    <a>מחשבון שטחים</a>
                    <a>הוספת נכס</a>
                    <a>תגמול שותפים</a>
                    <a>מועדפים</a>
                    <a >קבל הצעות אישיות</a>
                    <a> <i><FontAwesomeIcon icon={faCaretLeft} /></i> לידים חמים <i style={{color: 'orange'}}><FontAwesomeIcon icon={faFire} /></i> </a>
                    <a>צור קשר</a>
                  </div>
                </li>
                <li className="dropdown  biga">{commercial ? <div><a onClick={() => setCommercial(!commercial)}>מגורים</a><a  style={{background: '#00b074', color: 'white'}}>מסחרי</a></div> :  <div><a style={{background: '#00b074', color: 'white'}}>מגורים</a><a onClick={() => setCommercial(!commercial)}>מסחרי</a></div> }</li>
                <li className="dropdown  bigR"><a >מועדפים</a></li>
                <li className="dropdown  bigR"> <a > מחשבון שטחים </a></li>
                <li className="dropdown  bigR"><a > הוספת נכס</a></li>
                <li className="dropdown  bigR"><a >תגמול שותפים</a></li>
                <li className="dropdown  bigR"><a >קבל הצעות אישיות</a></li>
                <li className="dropdown  bigR"><a ><i><FontAwesomeIcon icon={faCaretDown} /></i> לידים חמים <i style={{color: 'orange'}}><FontAwesomeIcon icon={faFire} /></i></a></li>
              </ul>


              <ul className="leftUl leftLi group">
              
                <li className="dropdown  biga"><div style={{border:'none'}}><img src={logo} style={{width:'100%', height:'100%'}}/></div></li>
                <li className="dropdown  icon"><a onClick={signOut}><i><FontAwesomeIcon icon={faSignOutAlt} /></i></a></li>
                <li className="dropdown  icon"><a><i><FontAwesomeIcon icon={faEnvelopeOpen} /></i></a></li>
                <li className="dropdown  phone"><a>053-2796105</a></li>
                
              </ul>
          </div>
          <div className="clr"></div>
          <div className="logo">
            
          </div>
        </div>
        <div className="flexPage">
            <div><h1 style={{color:'#00b074'}}>ניהול משימות</h1></div>
            <div className="search">
              <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}><input type="text" placeholder={"חיפוש משימה..."}></input> <a><i><FontAwesomeIcon style={{cursor:'pointer '}} icon={faSearch} /></i></a></div>
            </div>
            <div className="space-between">
            <div ><a style={{fontWeight:'bold'}}>{taskArray.length > 0 ? <a>רשימה ({taskArray.length})</a> : ""}</a></div>
             {!stateOfNewMission ? <div onClick={() => setStateOfNewMission(true)} className="buttonTask"><a >משימה חדשה</a></div> : ""}
            </div>
            <div id="newTaskDiv"></div>
           {stateOfNewMission ? <div className="mission">
              <div style={{width:'100%', marginBottom: '10px'}}>
                  <a style={{fontWeight:'bold', color:'green'}}>משימה חדשה</a> 
              </div>
              <div style={{width:'100%', marginBottom: '10px'}}>
                  <a>תיאור</a> <input value={newMissionDetails.description} type="text" name="description" onChange={handleChangeTextNewMission}/>
              </div>
              <div style={{width:'100%', marginBottom: '10px'}}>
                <a>אימייל</a> <input type="text" value={newMissionDetails.email} name="email" onChange={handleChangeTextNewMission}/>
              </div>
              <div style={{width:'100%'}}>
              <a>טלפון</a> <input type="text" value={newMissionDetails.phone}  name="phone" onChange={handleChangeTextNewMission}/>
              </div>
              {errorRequest ? <div style={{width:'100%'}}>
              <a>שגיאה, נסה שנית</a> 
              </div> 
              : ""}
              <div className="mainDivButtonsAddEdit">
                  <button onClick={addNewTesk}  className="btnForNewEdit btnSave">צור משימה</button>
                  <button onClick={() => {setStateOfNewMission(false)
                  setErrorRequest(false)} }  className="btnForNewEdit btnCancel">ביטול</button>
              </div>
              <div>
                
              </div>

            </div> : ""}

            <div id="editDiv"></div>
            {editMode ? <div className="mission">
              <div style={{width:'100%', marginBottom: '10px'}}>
                  <a style={{fontWeight:'bold', color:'green'}}>ערוך משימה</a> 
              </div>
              <div style={{width:'100%', marginBottom: '10px'}}>
                  <a>תיאור</a> <input value={editMissionDetails.description} type="text" name="description" onChange={handleChangeTextEditMission}/>
              </div>
              <div style={{width:'100%', marginBottom: '10px'}}>
                <a>אימייל</a> <input type="text" value={editMissionDetails.email} name="email" onChange={handleChangeTextEditMission}/>
              </div>
              <div style={{width:'100%', marginBottom: '10px'}}>
              <a>טלפון</a> <input type="text" value={editMissionDetails.phone}  name="phone" onChange={handleChangeTextEditMission}/>
              </div>
              <div style={{width:'100%'}}>
              <a>הושלם?</a> <input type="checkbox" checked={editMissionDetails.completed == 1 ? true : false}  name="completed" onChange={handleChangeTextEditMission}/>
              </div>
              {errorRequest ? <div style={{width:'100%'}}>
              <a>שגיאה, נסה שנית</a> 
              </div> 
              : ""}

              
              <div className="mainDivButtonsAddEdit">
                  <button onClick={updateTesk}  className="btnForNewEdit btnSave">אישור</button>
                  <button onClick={() => {setEditMode(false)
                  setErrorRequest(false)} }  className="btnForNewEdit btnCancel">ביטול</button>
              </div>
              <div>
                
              </div>

            </div> : ""}

            <div id="viewDiv"></div>
            {viewMode ? <div className="mission">
              <div style={{width:'100%', marginBottom: '10px'}}>
                  <a style={{fontWeight:'bold', color:'green'}}>צפייה במשימה</a> 
              </div>
              <div style={{width:'100%', marginBottom: '10px'}}>
                  <a>תיאור</a> <input disabled={true} value={viewMissionDetails.description} type="text" name="description" onChange={handleChangeTextEditMission}/>
              </div>
              <div style={{width:'100%', marginBottom: '10px'}}>
                <a>אימייל</a> <input type="text" disabled={true} value={viewMissionDetails.email} name="email" onChange={handleChangeTextEditMission}/>
              </div>
              <div style={{width:'100%', marginBottom: '10px'}}>
              <a>טלפון</a> <input type="text" disabled={true} value={viewMissionDetails.phone}  name="phone" onChange={handleChangeTextEditMission}/>
              </div>
              <div style={{width:'100%'}}>
              <a>הושלם?</a> <input type="checkbox" disabled={true} checked={viewMissionDetails.completed == 1 ? true : false}  name="completed" onChange={handleChangeTextEditMission}/>
              </div>
              
              <div className="mainDivButtonsAddEdit">
                  <button onClick={() =>setViewMode(false)}  className="btnForNewEdit btnSave">אישור</button>
              </div>
              <div>
                
              </div>

            </div> : ""}


             <div className="divTable">
               <table>
                 <tr style={{backgroundColor:'#efefef'}}> 
                   <th ><div style={{display: "flex", alignItems:"center", justifyContent:"flex-start"}}><input type='checkbox'/>שם משתמש <a onClick={() => sortByUsername()}><i ><FontAwesomeIcon icon={faSort} /></i></a></div></th>
                   <th><div style={{display: "flex", alignItems:"center", justifyContent:"flex-start"}}>טלפון</div></th>
                   <th><div style={{display: "flex", alignItems:"center", justifyContent:"flex-start"}}>מייל</div></th>
                   <th><div style={{display: "flex", alignItems:"center", justifyContent:"flex-start"}}>תאריך יצירת המשימה<a onClick={() => sortByDate()}><i><FontAwesomeIcon icon={faSort} /></i></a></div></th>
                   <th><div style={{display: "flex", alignItems:"center", justifyContent:"flex-start"}}>פעולות</div></th>
                </tr>

                {taskArray.length > 0 && taskArray.map((item, key) => {
        return (
            <tr className="trHover" key={key}>
                <td><input type='checkbox'/>{item.Username}</td>
                <td>{item.Phone}</td>
                <td>{item.Email}</td>
        <td>{item.Completed == 1 ? <a ><i style={{ color: 'green'}}><FontAwesomeIcon icon={faCheck} /></i><a style={{ marginRight: '5px'}}>{item.Date}</a></a> : <a style={{ marginRight: '30px'}}>{item.Date}</a>  }</td>
                <td className="operationDiv">
                 <Link to="viewDiv"> <div onClick={() => handleViewTaks(key)} className="operationsDiv" style={{marginLeft:'8px'}}>
                    <div><a><i><FontAwesomeIcon icon={faEye} /></i></a></div>
                    <div style={{fontSize:'10px'}}>צפייה</div>
                  </div>
                </Link>
                  <Link to="editDiv"><div onClick={() => handleEditTaks(key)} className="operationsDiv" style={{marginLeft:'8px'}}>
                    <div><a><i><FontAwesomeIcon icon={faUserEdit} /></i></a></div>
                    <div style={{fontSize:'10px'}}>עריכה</div>
                  </div>
                  </Link>
                  <div onClick={() => removeTask(item.TaskID)} className="operationsDiv" style={{marginLeft:'8px'}}>
                    <div><a><i><FontAwesomeIcon icon={faTrash} /></i></a></div>
                    <div style={{fontSize:'10px'}}>מחיקה</div>
                  </div>
                  </td>

            </tr>
        )
    })}
               
               </table>
               
            </div> 
        </div>
    </div>);
    
    


}

export default Dashboard;
