import { useState, createContext, useEffect } from "react";
import axios from "axios";
import viteLogo from "/vite.svg";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import Sign_Up_Business from "./Components/Sign_Up_Business";
import Input_Field from "./Components/Input_Field";
import Sign_Up_Investor from "./Components/Sign_Up_Investor";
import HomePage from "./Components/HomePage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Login from "./Components/Login";
import Card from "./Components/Business_Card";

export const Login_context = createContext(false);
export const Data_context = createContext("");
export const All_Data = createContext("");
export const Access_token = createContext();

export const User_data = createContext();


function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [all_business, setAllBusiness] = useState({});
  const [all_investors, setAllInvestors] = useState({});
  const [user_data, setUserData] = useState({});
  const [business_data, setBusinessData] = useState({
    business_id: "",
    owner_username: "",
    owner_password: "",
    owner_name: "",
    owner_email: "",
    owner_location: "",
    owner_phone_no: "",
    owner_adhaar_no: "",
    business_name: "",
    business_category: "",
    business_location: "",
    business_revenue_6: "",
    business_revenue_5: "",
    business_revenue_4: "",
    business_revenue_3: "",
    business_revenue_2: "",
    business_revenue_1: "",
    business_desc: "",
    business_website: "",
    business_linkedIn: "",
    business_twitter: "",
    business_instagram: "",
  });



  console.log(isLoggedIn);
  const [investor_data, setInvestorData] = useState({
    investor_id: "",
    investor_username: "",
    investor_password: "",
    investor_name: "",
    investor_email: "",
    investor_location: "",
    investor_adhaar_no: "",
    investor_phone_no: "",
    investor_income: "",
    investor_website: "",
    investor_linkedIn: "",
    investor_twitter: "",
    investor_instagram: "",
  });

  // console.log(business_data);
  const [isLoginClicked, setIsLoginClicked] = useState(false);


  useEffect(()=>{
    if(localStorage.getItem('access_token')){
    const accessToken = localStorage.getItem('access_token')
    axios.get('http://127.0.0.1:5000/profile_data',{headers:{
      'Authorization' : `Bearer ${accessToken}` 
    }}).then(response=>setUserData(response.data.data)).catch(err=>console.log(err))
  }
  },[])

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    axios
      .get("http://127.0.0.1:5000/getbusiness")
      .then((response) =>setAllBusiness(response.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/getinvestor")
      .then((response) => setAllInvestors(response.data))
      .catch((err) => console.log(err));
  }, []);


  

  return (
    <>
      <div className="">
        <User_data.Provider value={{user_data,setUserData}}>

        <Access_token.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          <All_Data.Provider
            value={{
              all_business,
              setAllBusiness,
              all_investors,
              setAllInvestors,
            }}
          >
            <Data_context.Provider
              value={{
                business_data,
                setBusinessData,
                investor_data,
                setInvestorData,
              }}
            >
              <Login_context.Provider
                value={{ isLoginClicked, setIsLoginClicked }}
              >
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    {isLoggedIn && (
                      <Route path="/dashboard" element={<Dashboard />} />
                    )}
                    <Route
                      path="/sign-up-business"
                      element={<Sign_Up_Business />}
                    />
                    <Route
                      path="/sign-up-investor"
                      element={<Sign_Up_Investor />}
                    />
                    <Route path="/card" element={<Card />} />
                  </Routes>
                </BrowserRouter>
              </Login_context.Provider>
            </Data_context.Provider>
          </All_Data.Provider>
        </Access_token.Provider>
        </User_data.Provider>

      </div>
    </>
  );
}

export default App;
