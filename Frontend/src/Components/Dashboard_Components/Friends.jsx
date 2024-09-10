import * as React from "react";
import { useEffect } from "react";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/joy/AccordionDetails";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";
import Switch from "@mui/joy/Switch";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import ListItemContent from "@mui/joy/ListItemContent";
import GroupIcon from "@mui/icons-material/Group";
import AirplanemodeActiveRoundedIcon from "@mui/icons-material/AirplanemodeActiveRounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import PendingIcon from "@mui/icons-material/Pending";
import BluetoothRoundedIcon from "@mui/icons-material/BluetoothRounded";
import TapAndPlayRoundedIcon from "@mui/icons-material/TapAndPlayRounded";
import EditNotificationsRoundedIcon from "@mui/icons-material/EditNotificationsRounded";
import AdUnitsRoundedIcon from "@mui/icons-material/AdUnitsRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import Button from "@mui/joy/Button";
import SpatialTrackingRoundedIcon from "@mui/icons-material/SpatialTrackingRounded";
import SettingsVoiceRoundedIcon from "@mui/icons-material/SettingsVoiceRounded";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useContext } from "react";
import { All_Data } from "../../App";
import { useState } from "react";
import { Connect_Request_Data } from "../Dashboard";

const Friends = () => {
  const {pending_data,setPendingData,friend_request,setFriendRequest,friends,setFriends,declined_req,setDeclinedReq} = useContext(Connect_Request_Data)
  const [accepted_id, setAcceptedID] = useState("");
  const [declined_id, setDeclinedID] = useState("");

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    axios
      .get("http://127.0.0.1:5000/request-sent", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => setPendingData(response.data.data))
      .catch((err) => console.log(err));

    axios
      .get("http://127.0.0.1:5000/friend-request", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {setFriendRequest(response.data.data)
          localStorage.setItem('notification',response.data.data.length)
          console.log(response.data.data.length);
      })

      .catch((err) => console.log(err));

    axios
      .get("http://127.0.0.1:5000/friends", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        setFriends(response.data.data);
        console.log("data = ", response.data.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://127.0.0.1:5000/req-declined", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => setDeclinedReq(response.data.data))
      .catch((err) => console.log(err));
  }, [accepted_id, declined_id]);

 

  const handleStatusRej = (req_id, sender_id, receiver_id) => {
    const status_data = {
      req_id: req_id,
      req_status: "declined",
      sender_id: sender_id,
      receiver_id: receiver_id,
    };
    const access_token = localStorage.getItem("access_token");
    axios
      .post("http://127.0.0.1:5000/status-sent", status_data, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        console.log(response.data);
        setDeclinedID(req_id);
      })
      .catch((err) => console.log(err));
  };
  const handleStatusAcc = (req_id, sender_id, receiver_id) => {
    const status_data = {
      req_id: req_id,
      req_status: "accepted",
      sender_id: sender_id,
      receiver_id: receiver_id,
    };
    const access_token = localStorage.getItem("access_token");
    axios
      .post("http://127.0.0.1:5000/status-sent", status_data, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        console.log(response.data);
        setAcceptedID(req_id);
      })

      .catch((err) => console.log(err));
  };

  // console.log("accepted_id", accepted_id);

  // console.log("friend Request = ", friend_request);
  return (
    <>
      <AccordionGroup
        variant="plain"
        transition="0.2s"
        sx={{
          maxWidth: "100%",
          borderRadius: "md",
          [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]:
            {
              paddingBlock: "1rem",
            },
          [`& .${accordionSummaryClasses.button}`]: {
            paddingBlock: "1rem",
          },
        }}
      >
        <Accordion defaultExpanded>
          <AccordionSummary>
            <Avatar color="success">
              <EditNotificationsRoundedIcon />
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">Notifications</Typography>
              <Typography level="body-sm">
                Enable or disable your notifications
              </Typography>
            </ListItemContent>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1.5}>
              { friend_request.length > 0 && friend_request.map((data, index) => {
                return (
                  <FormControl
                    orientation="horizontal"
                    sx={{
                      gap: 1,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <AccountCircleIcon
                        fontSize="large"
                        color="action"
                        sx={{ mx: 1 }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <FormLabel sx={{ fontSize: "17px" }}>
                          {data.name}
                        </FormLabel>
                        <FormLabel
                          sx={{ fontSize: "12px", color: "rgba(0,0,0,0.6)" }}
                        >
                          {data.username}
                        </FormLabel>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <CloseIcon
                        fontSize="medium"
                        color="error"
                        onClick={() =>
                          handleStatusRej(
                            data.req_id,
                            data.sender_id,
                            data.receiver_id
                          )
                        }
                      />
                      <DoneIcon
                        fontSize="medium"
                        color="success"
                        onClick={() =>
                          handleStatusAcc(
                            data.req_id,
                            data.sender_id,
                            data.receiver_id
                          )
                        }
                      />
                    </div>
                  </FormControl>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>
            <Avatar color="success">
              <PendingIcon />
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">Pending Requests</Typography>
              <Typography level="body-sm">
                Click to see the Pending Requests
              </Typography>
            </ListItemContent>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1.5}>
              {pending_data.length > 0 &&  pending_data.map((data, index) => {
                return (
                  <FormControl
                    orientation="horizontal"
                    sx={{
                      gap: 1,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <AccountCircleIcon
                        fontSize="large"
                        color="action"
                        sx={{ mx: 1 }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <FormLabel sx={{ fontSize: "17px" }}>
                          {data.name}
                        </FormLabel>
                        <FormLabel
                          sx={{ fontSize: "12px", color: "rgba(0,0,0,0.6)" }}
                        >
                          {data.username}
                        </FormLabel>
                      </div>
                    </div>
                    <Button size="sm" color="neutral">
                      Pending
                    </Button>
                  </FormControl>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>
            <Avatar color="primary">
              <GroupIcon />
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">Connections</Typography>
              <Typography level="body-sm">
                Click to view the Connections
              </Typography>
            </ListItemContent>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1.5}>
              {friends.length > 0 && friends.map((data, index) => {
                return (
                  <FormControl
                    orientation="horizontal"
                    sx={{
                      gap: 1,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <AccountCircleIcon
                        fontSize="large"
                        color="action"
                        sx={{ mx: 1 }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <FormLabel sx={{ fontSize: "17px" }}>
                          {data.name}
                        </FormLabel>
                        <FormLabel
                          sx={{ fontSize: "12px", color: "rgba(0,0,0,0.6)" }}
                        >
                          {data.username}
                        </FormLabel>
                      </div>
                    </div>
                    <Button size="sm" color="success">
                      Accepted
                    </Button>
                  </FormControl>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary>
            <Avatar color="danger">
              <AccessibilityNewRoundedIcon />
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">Declined Request</Typography>
              <Typography level="body-sm">
                Click to View the Rejected Requests
              </Typography>
            </ListItemContent>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1.5}>
              {declined_req.length > 0 && declined_req.map((data, index) => {
                return (
                  <FormControl
                    orientation="horizontal"
                    sx={{
                      gap: 1,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <AccountCircleIcon
                        fontSize="large"
                        color="action"
                        sx={{ mx: 1 }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <FormLabel sx={{ fontSize: "17px" }}>
                          {data.name}
                        </FormLabel>
                        <FormLabel
                          sx={{ fontSize: "12px", color: "rgba(0,0,0,0.6)" }}
                        >
                          {data.username}
                        </FormLabel>
                      </div>
                    </div>
                    <Button size="sm" color="danger">
                      Declined
                    </Button>
                  </FormControl>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </AccordionGroup>
    </>
  );
};

export default Friends;
