import styled from "styled-components";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import groundUserData from "pages/api/ground/[id]";
import missionUserData from "pages/api/mission/[id]";
import userData from "pages/api/user/[id]";
import { FieldErrors, useForm } from "react-hook-form";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ButtonFull } from "styles/styled";
import { Button } from "@mui/material";
import { display } from "@mui/system";
import Image from "next/image";
import imgUpload from "pages/api/user/signinImg";
import sameNickname from "pages/api/user/sameNickname";
import updateNickname from "pages/api/user/updateNickname";
import deleteNickname from "pages/api/user/deleteAccount";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { ParentsDiv } from "styles/styled";
import Backcomponents from "components/back";
import Head from "next/head";
import UpdateUserImg from "pages/api/user/UpdateUserImg";
import { useRouter } from "next/router";

const CameraBtn = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2rem;
`;

const DontLeave = styled('div')`
  p, span{
    font-family: 'PyeongChangPeace-Bold';
    font-size: 30px;
    color:#333333;
    @media screen and (max-width: 400px){
      font-size:25px;
    }
    margin:5px;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const PleaseStay = styled('div')`
  display:flex;
  flex-direction: column;
  margin:30px;
  p{
    font-size:15px;
    @media screen and (max-width: 400px){
      font-size:13px;
    }
    margin:10px;
  }
`

const CameraBox = styled("div")`
  width: 150px;
  height: 150px;
  background-color: #ffffff;
  border-radius: 100px;
  box-shadow: 0px 0px 5px 0px #dadce0 inset;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
  }
  img {
    object-fit: cover;
    width: 150px;
    height: 150px;
    border-radius: 100px;
  }
`;
const PfDiv = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const NicknameB = styled(ButtonFull)`
  font-size: 15px;
  border-radius: 10px;
  padding: 10px 10px;
  margin-left: 10px;
`;
const ResignB = styled(NicknameB)`
  @media only screen and (max-width: 650px) {
    margin-top: 10px;
    margin-left: 0px;
  }
`;

const H2 = styled("h2")`
  @media only screen and (max-width: 650px) {
    display: none;
  }
`;
const NewsTop = styled("div")`
  margin-left: 35px;
  @media only screen and (max-width: 650px) {
    margin-top: 20px;
  }
`;

const NickNmaeInput = styled("input")`
  width: 30%;
  border-radius: 10px;
  border: 1px solid #65ace2;
  padding: 10px;
  font-size:15px;
`;

const ErrorMessage = styled("a")`
  font-size: x-small;
  font-weight: bold;
  color: coral;
  @media only screen and (min-width: 650px) {
    font-size: small;
  }
`;

const SuccessMessage = styled("a")`
  font-size: x-small;
  font-weight: bold;
  color: green;
  @media only screen and (min-width: 650px) {
    font-size: small;
  }
`;

const Div = styled("div")`
  display: flex;
  justify-content: center;
  margin-right: 25%;
  @media only screen and (min-width: 650px) {
    margin-right: 10%;
  }
`;

const ResignMessage = styled("p")`
  margin: 50px 0px 0px 0px;
  @media only screen and (max-width: 650px) {
    font-size: small;
  }
`;

const ResignDiv = styled("div")`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

interface Update {
  username: string;
}

export default function Profile({ data }) {
  const [userImg, setUserImg] = useState<File>(); // ????????? ??????
  const [preview, setPreview] = useState<string>(); // ????????? ???????????? ??????
  const [nickInput, setNickInput] = useState('');
  const [errormsg, setErrormsg] = useState<string>();
  const [successmsg, setSuccessmsg] = useState<string>();
  const [userId, setUserId] = useState();
  const [errorImg, setErrorImg] = useState<string>();
  const [successImg, setSuccessImg] = useState<string>();
  const router = useRouter()

  useEffect(() => {
    const usersId = JSON.parse(localStorage.getItem("recoil-persist")).userId;
    
    setUserId(usersId);
  }, []);

  const changeHandler = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setUserImg(e.target.files[0])
    } else {
      setUserImg(null);
    }
  };

  useEffect(() => {
    if (userImg) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(userImg);
    } else {
      setPreview(null);
    }
  }, [userImg]);
  return (
    <ParentsDiv>
      {/* ?????? */}
      <Head>
        <title>??? ?????? ?????? | ??????-?????????</title>
      </Head>
      {/* ????????? ?????? back?????? */}
      <Backcomponents name="??? ?????? ??????"></Backcomponents>

      <NewsTop>
        <H2>???????? ??? ?????? ??????</H2>
      </NewsTop>

      {/*  ??????  */}
      <CameraBtn>
        <IconButton aria-label="upload picture" component="label">
          <input
            hidden
            accept="image/*"
            type="file"
            name="file"
            onChange={changeHandler}
          />
          {userImg ? (
            <CameraBox>
              <img src={preview} />
            </CameraBox>
          ) : (
            <CameraBox>
              <PhotoCamera fontSize="large" />
            </CameraBox>
          )}
        </IconButton>
          {userId ? 
                    <ButtonFull hColor={'#98C064'}
                    dColor={'#65ACE2'} style={{margin:'10px'}} onClick={()=>{UpdateUserImg(userImg, userId).then((res)=>{alert("????????? ?????? ?????? ??????")})}}>????????? ?????? ??????</ButtonFull>
                : <></>}
          {/* {errorImg ? <ErrorMessage>{errorImg}</ErrorMessage>: null }
          {successImg ? <SuccessMessage>{successImg}</SuccessMessage>: null} */}
      </CameraBtn>

      {/* ????????? ?????? ?????? */}
      <PfDiv>
        <NickNmaeInput
          type="text"
          value={nickInput}
          onChange={(e) => {
            e.preventDefault();
            setNickInput(e.target.value);
          }}
        />
        {/* ????????? ?????? ?????? */}
        <NicknameB
          dColor={"#98C064"}
          hColor={"#65ACE2"}
          type="button"
          onClick={(e) => {
            setSuccessmsg("");
            setErrormsg("");
            if (nickInput.length > 15) {
              setErrormsg("???????????? 15?????? ?????? ??? ????????????");
            } else if (nickInput === "") {
              setErrormsg("???????????? ??????????????????");
            } else {
              updateNickname(nickInput,userId)
              setSuccessmsg("??????????????? ?????????????????????");
            }
          }}
          >
          ????????? ??????
        </NicknameB>
      </PfDiv>
      <Div>
          {errormsg ? <ErrorMessage>{errormsg}</ErrorMessage> : null}
          {successmsg ? <SuccessMessage>{successmsg}</SuccessMessage> : null}
      </Div>
      {/* ????????? ????????? ?????? ?????? ??? ????????? */}
      {/* ????????? ????????? */}
      {/* <h4>{data.session.user.name}???, ????????? ?????? ????????? ???????????????! </h4> */}
      <ResignDiv>
        <ResignMessage>
          <DontLeave>
            <p>?????????,</p>
            <p>????????? ??????</p>
            <div><span style={{color:'#98C064'}}>??????</span><span>??? ???????????????!</span></div>
          </DontLeave>
          <PleaseStay>
          <p>?????????, ?????? ???????????? ????????? ????????????????</p>
          <p>?????? ???????????? ????????????</p>
          <p>????????? ????????? ?????? ??? ????????? ????????? ?????????!</p>
          <p>????????? ?????? ???????????? ?????????...????</p>
          </PleaseStay>
          </ResignMessage>
          {/* ???????????? ?????? */}
          <ResignB
            dColor={"#FF4F4F"}
            hColor={"#FF4F4F"}
            style={{marginBottom:'20px'}}
            onClick={(event) => {
              event.preventDefault();
              if(confirm("?????? ?????????????????????????") === true){
                deleteNickname(userId);
                localStorage.removeItem('recoil-persist')
                localStorage.removeItem('access-token')
                router.push('/')
              }
            }}
          >
            ????????? ????????????
          </ResignB>
      </ResignDiv>
    </ParentsDiv>
  );
}

// export async function getServerSideProps(context) {
//   const session2 = new QueryClient();
//   const userInfo2 = new QueryClient();
//   const missionInfo2 = new QueryClient();
//   const groundInfo2 = new QueryClient();

//   await userInfo2.prefetchQuery(["userInfo"], () => {
//     userData();
//   });
//   await missionInfo2.prefetchQuery(["missionUserInfo"], () => {
//     missionUserData();
//   });
//   await groundInfo2.prefetchQuery(["groundUserInfo"], () => {
//     groundUserData(context);
//   });

//   return {
//     props: {
//       data: {
//         dehydratedState: dehydrate(userInfo2),
//       },
//     },
//   };
// }
