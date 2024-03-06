// 도메인 https://catchme-smoky.vercel.app/

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import InfoBox from "../boxComponent/InfoBox";
import ChatBox from "../boxComponent/ChatBox";
import UserBox from "../boxComponent/UserBox";
import ReadyBox from "../boxComponent/ReadyBox";
import UserCardBox from "../boxComponent/UserCardBox";
import ReadyStateBox from "../boxComponent/ReadyStateBox";
import ReadyConfirmModal from "../modalComponet/ReadyConfirmModal";
import MaleChooseModal from "../modalComponet/MaleChooseModal";
import FemaleChooseModal from "../modalComponet/FemaleChooseModal";
import SecondModal from "../modalComponet/SecondModal";
import FinalModal from "../modalComponet/FinalModal";

const RootBodyContainer = styled.div`
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template-rows: 0.17fr 0.1fr 0.1fr 0.1fr 0.1fr 0.08fr 0.16fr 0.19fr 0.04fr;
  position: relative;
`;

const RectangleTable = styled.div`
  position: absolute;
  width: 90%;
  height: 10%;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 42px;
  border: 2px solid #000; /* 테두리 설정 */
  background: #deaf69;
  box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.15);
  z-index: -1;
`;

const RoomBody = ({roomId}) => {

  //이렇게 kid 가져와짐
  const kid = localStorage.getItem("kid");
  console.log(kid)

  const [user, setUser] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [meetingnum, setMeetingnum] = useState("");
  const [maleusers, setMaleusers] = useState([]);
  const [femaleusers, setFemaleusers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [isMale, setIsMale] = useState(true);
  const dataSocket = useRef(null);

  const fetchData = async () => {
    try {
      const [roomResponse, userResponse] = await Promise.all([
        fetch(`https://api.catchmenow.co.kr/room/api/room_info/${roomId}/`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }).catch(error => {
          console.error("Error fetching room info:", error);
          throw error; 
        }),
        fetch(
          `https://api.catchmenow.co.kr/main/api/user_info/${1001}`, { //여기에 유저 kid 넣기
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
          }).catch(error => {
            console.error("Error fetching user info:", error);
            throw error;
          }),
        ]);

      const roomdata = await roomResponse.json();
      const userdata = await userResponse.json();
      setRoomName(roomdata.rname);
      setLocation(roomdata.location);
      setTime(roomdata.created_at);
      setMeetingnum(roomdata.meetingnum);
      setMaleusers(roomdata.menInfos);
      setFemaleusers(roomdata.womenInfos);
      setIsMale(userdata.ismale);
      setIsReady(userdata.extra_info[0].ready);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
};

useEffect(() => {
  fetchData(); // 초기 로딩 시에도 데이터를 불러오도록 함
}, [roomId]);

const [idealPercentages, setIdealPercentages] = useState([]);

const fetchIdealPercentages = async () => {
  try {
    const idealPercentagesResponse = await fetch(
      `https://api.catchmenow.co.kr/room/api/room_info/room/percentage/`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    if (!idealPercentagesResponse.ok) {
      throw new Error("Failed to fetch ideal percentages");
    }

    const idealPercentagesData = await idealPercentagesResponse.json();
    setIdealPercentages(idealPercentagesData);
  } catch (error) {
    console.error("Error fetching ideal percentages:", error);
  }
};

useEffect(() => {
  fetchIdealPercentages();
}, [roomId]);

useEffect(() => {
  // 각 사용자에게 해당하는 이상형 퍼센트를 사용자 정보에 추가
  const updatedMaleUsers = maleusers.map((user) => {
    const matchingInfo = idealPercentages.find((info) => info.id === user.user);
    return { ...user, matching_count: matchingInfo?.matching_count, total_conditions: matchingInfo?.total_conditions };
  });

  const updatedFemaleUsers = femaleusers.map((user) => {
    const matchingInfo = idealPercentages.find((info) => info.id === user.user);
    return { ...user, matching_count: matchingInfo?.matching_count, total_conditions: matchingInfo?.total_conditions };
  });

  setMaleusers(updatedMaleUsers);
  setFemaleusers(updatedFemaleUsers);

}, [idealPercentages]);

const [totalCondition, setTotalCondition] = useState(null);

  const handleReadyButtonClick = () => {
    // 사용자 정보 상태에 저장
    if (!user) {
      setUser({
        kid: 1001 // kid 값을 임의로 1001로 지정
      });
    }
    setIsReady(!isReady);
  };

  useEffect(() => {
    if (user && isReady && !dataSocket.current) {
      // 레디 상태일 때 웹소켓 연결
      dataSocket.current = new WebSocket(`ws://ec2-54-180-82-92.ap-northeast-2.compute.amazonaws.com:8040/ws/room/${roomId}/`);

      dataSocket.current.onopen = () => {
        console.log('웹 소켓 연결 성공!');
        // 웹소켓 연결이 성공하면 서버로 'ready' 메시지
        dataSocket.current.send(JSON.stringify({ type: 'ready', kid: 1001 }));
        fetchData();
      };

      dataSocket.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('서버로부터 메시지 수신:', data);
        if (data.message === 'api 리랜더링') {
          // 웹 소켓으로부터 'api 리랜더링' 메시지를 받으면 API 다시 호출
          fetchData();
        }
      };

    } else if ((!user || !isReady) && dataSocket.current) {
      // 레디 상태가 아니면서 웹소켓이 연결되어 있을 때, 레디 상태를 해제하는 메시지를 보낸 뒤 웹소켓 연결을 종료
      console.log('웹 소켓 연결 끊음!');
      fetchData();
      dataSocket.current.send(JSON.stringify({ type: 'not_ready', kid: 1001 }));
      dataSocket.current.close();
      dataSocket.current = null;
    } else if (!user && isReady && !dataSocket.current) {
      // 레디 상태일 때 웹소켓 연결
      dataSocket.current = new WebSocket(`ws://ec2-54-180-82-92.ap-northeast-2.compute.amazonaws.com:8040/ws/room/${roomId}/`);

      dataSocket.current.onopen = () => {
        console.log('웹 소켓 연결 성공!');
        // 웹소켓 연결이 성공하면 서버로 'ready' 메시지
        dataSocket.current.send(JSON.stringify({ type: 'ready', kid: 1001 }));
        fetchData();
      };

      dataSocket.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('서버로부터 메시지 수신:', data);
        if (data.message === 'api 리랜더링') {
          // 웹 소켓으로부터 'api 리랜더링' 메시지를 받으면 API 다시 호출
          fetchData();
        }
      };

    }
  }, [user, isReady]);

  useEffect(() => {
    return () => {
      if (dataSocket.current) {
        // 컴포넌트가 언마운트 될 때 레디 상태를 해제하는 메시지를 보낸 뒤 웹소켓 연결을 종료
        dataSocket.current.send(JSON.stringify({ type: 'not_ready', kid: 1001 }));
        dataSocket.current.close();
      }
    };
  }, []);


  const [showReadyConfirmModal, setShowReadyConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [showSecondModal, setShowSecondModal] = useState(false);
  const [secondRecommendation, setSecondRecommendation] = useState([]);

  const [showFinalModal, setShowFinalModal] = useState(false);
  const [myAnimal, setMyAnimal] = useState();
  const [yourAnimal, setYourAnimal] = useState();

  // 선택 모달창 여는 알고리즘
  useEffect(() => {
    const anyNotReady = [...maleusers, ...femaleusers].some(
      (user) => !user.ready
    );
    const isMaleFemaleEqual = maleusers.length === femaleusers.length;
    const isMaleFemaleOver2 = maleusers.length > 1 && femaleusers.length > 1;

    const checkAllUsersReady = async () => {
      if (!anyNotReady && isMaleFemaleEqual && isMaleFemaleOver2) {
        if(/*day1*/ false)
          setShowReadyConfirmModal(true);
        if(/*day2*/ true) {
          try {
            const response = await fetch(
              `https://api.catchmenow.co.kr/main/api/user_info/${1001}`,
              {
                method: "GET",
                mode: "cors",
              }
            );
    
            if (!response.ok) {
              throw new Error("Failed to fetch room information");
            }
    
            const mydata = await response.json();
            const isMale = mydata.ismale === true;
            const crushKid = isMale ? mydata.extra_info[0].w_crush_kid : mydata.extra_info[0].m_match_kid;

            if (isMale==false && !crushKid) {
              setShowReadyConfirmModal(false); // 여성이 선택하지 않았을 경우 모달 제작
              return;
            }

            const crushResponse = await fetch(
              `https://api.catchmenow.co.kr/main/api/user_info/${crushKid}`,
              {
                method: "GET",
                mode: "cors",
              }
            );

            if (!crushResponse.ok) {
              throw new Error("Failed to fetch crush information");
            }

            const crushData = await crushResponse.json();
            const mutualCrushKid = isMale ? crushData.extra_info[0].m_match_kid : crushData.extra_info[0].w_crush_kid;

            const isMutualSelected = mutualCrushKid === 1001;

            if (!isMutualSelected) {
              const secondRecommendationResponse = await fetch(
                `https://api.catchmenow.co.kr/room/api/room_info/second`,
                {
                  method: "GET",
                  mode: "cors",
                }
              );
    
              if (!secondRecommendationResponse.ok) {
                throw new Error("Failed to fetch second recommendation information");
              }
    
              const secondRecommendationData = await secondRecommendationResponse.json();
    
              setSecondRecommendation(secondRecommendationData.id);
              setShowSecondModal(true);
              setTotalCondition(secondRecommendationData.total_conditions);
            } else {
              setMyAnimal(mydata.extra_info[0].animal)
              setYourAnimal(crushData.extra_info[0].animal)
              setShowFinalModal(true);
            }
          } catch (error) {
            console.error("Error fetching room information:", error);
          }
        } else {
          setShowSecondModal(false);
        }
      } else {
        setShowReadyConfirmModal(false);
      }
    };
    checkAllUsersReady();
  }, [maleusers, femaleusers]);

  const filteredMaleUsers = maleusers.filter((user) => user.ready);
  const filteredFemaleUsers = femaleusers.filter((user) => user.ready);

  const handleGenderChange = (newIsMale) => {
    setIsMale(newIsMale);
  };

  return (
    // 기본 방 구조
    <RootBodyContainer>
      <InfoBox roomName={roomName} location={location} time={time} meetingnum={meetingnum} />
      <ChatBox users={isMale ? filteredFemaleUsers : filteredMaleUsers} />
      <UserBox
        users={
          isMale
          ? filteredFemaleUsers.map((user) => ({ ...user, gender: "Female", roomId: "roomId" }))
          : filteredMaleUsers.map((user) => ({ ...user, gender: "Male", roomId: "roomId" }))
        }
        dataSocket={dataSocket}
      />
      <RectangleTable />
      <ChatBox users={isMale ? filteredMaleUsers : filteredFemaleUsers} />
      <UserBox
        users={
          isMale
          ? filteredMaleUsers.map((user) => ({ ...user, gender: "Male" }))
          : filteredFemaleUsers.map((user) => ({ ...user, gender: "Female" }))
        }
        dataSocket={dataSocket}
      />
      <div></div>
      <ReadyBox 
        onGenderChange={handleGenderChange} 
        isMale={isMale} 
        onReadyButtonClick={handleReadyButtonClick} 
        roomId={roomId}
        isReady={isReady}
        setIsReady={setIsReady}
      />
      <UserCardBox
        users={
          isMale
            ? filteredFemaleUsers.map((user) => ({ ...user, gender: "Female" }))
            : filteredMaleUsers.map((user) => ({ ...user, gender: "Male" }))
        }
      />
      <ReadyStateBox users={isMale ? filteredFemaleUsers : filteredMaleUsers} />

      {/* 선택창 모달 구조 */}
      {showReadyConfirmModal && (
        <ReadyConfirmModal
          isOpen={showReadyConfirmModal}
          onClose={() => setShowReadyConfirmModal(false)}
          onConfirm={() => setShowModal(true)}
        />
      )}
      {showModal &&
        (isMale ? (
          <FemaleChooseModal
            isOpen={true}
            onClose={() => setShowModal(false)}
            femaleusers={femaleusers}
          />
        ) : (
          <MaleChooseModal
            isOpen={true}
            onClose={() => setShowModal(false)}
            maleusers={maleusers}
          />
        ))}
      {showSecondModal && (
        <SecondModal
          isOpen={showSecondModal}
          onClose={() => setShowSecondModal(false)}
          recommendation={secondRecommendation}
          gender={isMale ? "Male" : "Female"}
          totalConditions={totalCondition}
        />
      )}
      {showFinalModal && (
        <FinalModal
          isOpen={showFinalModal}
          onClose={() => setShowFinalModal(false)}
          me={myAnimal} // 여기 클라이언트랑
          you={yourAnimal} // 클라이언트가 선택한 유저로 출력해야함
        />
      )}
    </RootBodyContainer>
  );
};


export default RoomBody;
