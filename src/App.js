import { React, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomHeader from "./page/RoomHeader";
import MeetingRoomMain from "./page/MeetingRoomListPage/MeetingRoomMain";
import Room from "./page/Room";
import PayComplete from "./page/PayCompletePage";
import Loading from "./page/LoginPage/LoadingPage";
import Loading2 from "./page/LoginPage/Loading";
import NotLogin from "./page/LoginPage/NotLoginPage";
import YesLogin from "./page/LoginPage/YesLoginPage";
import MyPage from "./page/PersonalPage/MyPage";
import Help from "./page/PersonalPage/HelpPage";
import WithFriends from "./page/PersonalPage/WithFriendsPage";
import Alarm from "./page/PersonalPage/AlarmPage";
import MatchHistory from "./page/PersonalPage/MatchHistoryPage";
import Information from "./page/WelcomePage/InformationPage";
import Welcome02 from "./page/WelcomePage/Welcome02";
import Welcome03 from "./page/WelcomePage/Welcome03";
import { GenderProvider } from "./page/WelcomePage/GenderContext";
import Welcome04 from "./page/WelcomePage/Welcome04";
import Welcome05 from "./page/WelcomePage/Welcome05";
import Welcome06 from "./page/WelcomePage/Welcome06";
import Welcome07 from "./page/WelcomePage/Welcome07";
import Welcome08 from "./page/WelcomePage/Welcome08";
import Welcome09 from "./page/WelcomePage/Welcome09";
import Welcome10 from "./page/WelcomePage/Welcome10";
import Welcome11 from "./page/WelcomePage/Welcome11";
import Welcome12 from "./page/WelcomePage/Welcome12";
import Welcome13 from "./page/WelcomePage/Welcome13";
import Welcome13W from "./page/WelcomePage/Welcome13W";
import Welcome14 from "./page/WelcomePage/Welcome14";
import Welcome15 from "./page/WelcomePage/Welcome15";
import { UserProvider } from "./component/UserContext";
import styled from "styled-components";
import MyProfile from "./page/PersonalPage/MyProfile";
import MyProfile2 from "./page/PersonalPage/MyProfile2";
const AppContainer = styled.div`
  overflow: hidden; /* 스크롤을 숨기고 */
`;

const ContentContainer = styled.div`
  overflow-y: auto; /* 스크롤을 허용하는 영역 */
  height: calc(
    100vh - 56px
  ); /* 100vh에서 헤더의 높이를 뺀 값만큼 설정 (핸드폰에서만 적용) */
`;

const FixedHeader = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
`;

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  const handleLogin = (loggedIn) => {
    setIsUserLoggedIn(loggedIn);
  };

  return (
    <BrowserRouter>
      <AppContainer>
        <UserProvider>
          <FixedHeader>
            <RoomHeader isUserLoggedIn={isUserLoggedIn} />
          </FixedHeader>
          <GenderProvider>
            <ContentContainer>
              <Routes>
                {/* <Route path="/" element={<Loading />} />
                <Route path="/r" element={<Loading2 />} /> */}
                <Route path="/" element={<NotLogin onLogin={handleLogin} />} />
                <Route path="/login" element={<YesLogin />} />
                <Route path="/login/information" element={<Information />} />
                <Route
                  path="/login/information/Welcome02"
                  element={<Welcome02 />}
                />
                <Route
                  path="/login/information/Welcome03"
                  element={<Welcome03 />}
                />
                <Route
                  path="/login/information/Welcome04"
                  element={<Welcome04 />}
                />
                <Route
                  path="/login/information/Welcome05"
                  element={<Welcome05 />}
                />
                <Route
                  path="/login/information/Welcome06"
                  element={<Welcome06 />}
                />
                <Route
                  path="/login/information/Welcome07"
                  element={<Welcome07 />}
                />
                <Route
                  path="/login/information/Welcome08"
                  element={<Welcome08 />}
                />
                <Route
                  path="/login/information/Welcome09"
                  element={<Welcome09 />}
                />
                <Route
                  path="/login/information/Welcome10"
                  element={<Welcome10 />}
                />
                <Route
                  path="/login/information/Welcome11"
                  element={<Welcome11 />}
                />
                <Route
                  path="/login/information/Welcome12"
                  element={<Welcome12 />}
                />
                <Route
                  path="/login/information/Welcome13"
                  element={<Welcome13 />}
                />
                <Route
                  path="/login/information/Welcome13W"
                  element={<Welcome13W />}
                />
                <Route
                  path="/login/information/Welcome14"
                  element={<Welcome14 />}
                />
                <Route
                  path="/login/information/Welcome15"
                  element={<Welcome15 />}
                />
                <Route path="/login/mypage" element={<MyPage />} />
                <Route path="/login/help" element={<Help />} />
                <Route path="/login/alarm" element={<Alarm />} />
                <Route path="/login/withfriends" element={<WithFriends />} />
                <Route path="/login/matchhistory" element={<MatchHistory />} />
                <Route path="/meetingroommain" element={<MeetingRoomMain />} />
                <Route path="/room/:roomId" element={<Room />} />
                <Route path="/PayComplete" element={<PayComplete />} />
                <Route path="/login/mypage/myprofile" element={<MyProfile />} />
                <Route
                  path="/login/mypage/myprofile2"
                  element={<MyProfile2 />}
                />
              </Routes>
            </ContentContainer>
          </GenderProvider>
        </UserProvider>
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;
