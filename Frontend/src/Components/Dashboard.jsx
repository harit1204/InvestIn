import React, { useContext, useEffect, useState, createContext } from "react";
import "../Elements/Dashboard.css";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import {
  BiAbacus,
  BiAlarm,
  BiArchive,
  BiArea,
  BiBadge,
  BiCircle,
  BiHandicap,
  BiHomeCircle,
  BiMessage,
  BiMessageAltDots,
  BiSearch,
  BiSolidBusiness,
  BiSolidCircle,
  BiSolidHand,
  BiSolidHomeCircle,
  BiSolidUserAccount,
} from "react-icons/bi";
import Card from "./Business_Card";
import axios from "axios";
import { Switch } from "@mui/base";
import Home from "./Dashboard_Components/Home";
import Business from "./Dashboard_Components/Business";
import Investor from "./Dashboard_Components/Investor";
import Message from "./Dashboard_Components/Message";
import Friends from "./Dashboard_Components/Friends";
import Profile from "./Dashboard_Components/Profile";
import { Access_token, Login_context } from "../App";
import Business_Graphs from "./Business_Graphs";
import Loader from "./Loader";
// import { User_data } from "../App";

export const User_data = createContext();
export const Connect_Request_Data = createContext();

export const Business_ClickedId = createContext("");
export const Business_clicked = createContext("");
export const Score_Data = createContext("");


const Dashboard = () => {
  const [count,setCount ] = useState(0)
  const [isProfileClicked, setIsProfileClicked] = useState(false)
  const [Score,setScore] = useState(0);
  const [business_clickedId, setBusinessClickedId] = useState("")
  const [accepted_id, setAcceptedID] = useState("");
  const [declined_id, setDeclinedID] = useState("");
  const [pending_data, setPendingData] = useState([]);
  const [friend_request, setFriendRequest] = useState([]);
  const [friends, setFriends] = useState([]);
  const [declined_req, setDeclinedReq] = useState([]);

  // const {user_data} = useContext(User_data)
  const [notification, setNotification] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(Access_token);
  const [user_data, setUserData] = useState({});
  const timer = setInterval(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      // alert('You need to login first')
    }
  });
  const [clickedItem, setClickedItem] = useState("Investor");


  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    axios
      .get("http://127.0.0.1:5000/profile_data", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => setUserData(response.data.data))
      .catch((err) => console.log(err));
  }, []);

  // useEffect(() => {
  //   const access_token = localStorage.getItem("access_token");
  //   axios
  //     .get("http://127.0.0.1:5000/get-profile-score", {
  //       headers: { Authorization: `Bearer ${access_token}` },
  //     })
  //     .then((response) => {
  //       setScore(response.data.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    axios
      .get("http://127.0.0.1:5000/request-sent", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {setPendingData(response.data.data)
      })
      .catch((err) => console.log(err));

    axios
      .get("http://127.0.0.1:5000/friend-request", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        setFriendRequest(response.data.data);
        
        localStorage.setItem("notification", response.data.data.length);
        // console.log(response.data.data.length);
      })

      .catch((err) => console.log(err));

    axios
      .get("http://127.0.0.1:5000/friends", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        setFriends(response.data.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://127.0.0.1:5000/req-declined", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => setDeclinedReq(response.data.data))
      .catch((err) => console.log(err));
  }, [accepted_id, declined_id]);

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: "12px",
    paddingLeft: "20px",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      fontFamily: "Gilroy-light",
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    axios
      .get("http://127.0.0.1:5000/friend-request", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        localStorage.setItem("notification", response.data.data.length);
        // console.log(response.data.data.length);
      })

      .catch((err) => console.log(err));
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const notification = localStorage.getItem("notification");
      setNotification(notification);
    }, 50);
  }, []);

  useEffect(()=>{
    if(localStorage.getItem('count') !== null){
      const score = localStorage.getItem('count')
      setScore(score)
    }

    if(count == 0 && localStorage.getItem('count') === null){
      const access_token = localStorage.getItem("access_token");
      axios
        .get("http://127.0.0.1:5000/get-profile-score", {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((response) => {
          setScore(response.data.data);
          localStorage.setItem('count',response.data.data)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },[])


  const handleClickMenu = (e) => {
    if(e.target.id === "Profile" && isProfileClicked === false){
       
      setIsProfileClicked(true)
    }
    setClickedItem(e.target.id);
  };

  const handleLogOut = () => {
    const access_token = localStorage.getItem('access_token')
    axios.post('http://127.0.0.1:5000/logout',{"user_id" : "backend"},{headers:{Authorization:`Bearer ${access_token}`}})
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    window.location.href = "/";
    localStorage.removeItem('count')
  };

  const handleClick_Invest = () => {
    window.location.href = "/";
  };


  return (
    <>
      <div className="dashboard-wrapper">
        <div className="dashboard-left">
          <div className="logo">
            {/* <img src="" alt="" /> */}
            <span onClick={handleClick_Invest}>Invest_In</span>
          </div>
          <div className="left-menu">
            <div className="Home" id="Home" onClick={handleClickMenu}>
              <BiSolidHomeCircle /> Home
            </div>
            <div className="Investors" id="Investor" onClick={handleClickMenu}>
              <BiArea /> Investors
            </div>
            <div className="Business" id="Business" onClick={handleClickMenu}>
              <BiSolidBusiness /> Business
            </div>
            <div className="Home" id="Message" onClick={handleClickMenu}>
              <BiMessageAltDots /> Messages
            </div>
            <div className="friends" id="Friends" onClick={handleClickMenu}>
              <div
                className={
                  notification > 0 ? "notification" : "notification off"
                }
              >
                {notification}
              </div>
              <BiHandicap />
              Friends
            </div>
            <div className="Investors" id="Profile" onClick={handleClickMenu}>
              <BiSolidUserAccount /> Profile
            </div>
            <div className="Business" onClick={handleLogOut}>
              <BiAlarm /> Logout
            </div>
          </div>
          <div className="account">
            <div className="circle">
              <BiSolidCircle size={55} />
            </div>
            <div className="name">
              {Object.keys(user_data).length === 17 ? (
                <>
                  <span className="user-name">{user_data.owner_name}</span>
                  <span className="user-id">{user_data.owner_email}</span>
                </>
              ) : (
                <>
                  <span className="user-name">{user_data.investor_name}</span>
                  <span className="user-id">{user_data.investor_email}</span>
                </>
              )}
              {/* <span className="user-name">{user_data.username}</span> */}
              {/* <span className="user-id">{user_data.email}</span> */}
            </div>
          </div>
        </div>

        <div className="dashboard-right">
          <div className="menu-details">
            <div className="menu-title">
              {clickedItem === "" ? "Home" : clickedItem}
            </div>
            <Box
              sx={{ flexGrow: 0, fontFamily: "Gilroy-light" }}
              className="search-bar-1"
            >
              <Toolbar>
                {/* <Search
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <BiSearch size={25} color="gray" />
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search> */}
              </Toolbar>
            </Box>
          </div>
          <Score_Data.Provider value={{Score,setScore,isProfileClicked,setIsProfileClicked}}>
          <Business_ClickedId.Provider value={{business_clickedId,setBusinessClickedId}}>
          <Business_clicked.Provider value={{ clickedItem, setClickedItem }}>
            <Connect_Request_Data.Provider
              value={{
                pending_data,
                setPendingData,
                friend_request,
                setFriendRequest,
                declined_req,
                setDeclinedReq,
                friends,
                setFriends,
              }}
            >
              <User_data.Provider value={{ user_data, setUserData }}>
                {(() => {
                  switch (clickedItem) {
                    case "Home":
                      return <Home />;
                    case "Business":
                      return <Business />;
                    case "Investor":
                      return <Investor />;
                    case "Message":
                      return <Message />;
                    case "Friends":
                      return <Friends />;
                    case "Profile":
                      return (Score === 0 ? <Loader/> : <Profile />);
                    default:
                      return <Business_Graphs />;
                  }
                })()}
              </User_data.Provider>
            </Connect_Request_Data.Provider>
          </Business_clicked.Provider>
          </Business_ClickedId.Provider>
          </Score_Data.Provider>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
