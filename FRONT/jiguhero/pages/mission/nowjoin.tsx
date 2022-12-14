import styled from "styled-components";
import Head from "next/head";
import { ButtonFull, ButtonBorder } from "styles/styled";
import Backcomponents from "components/back";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import React, { useEffect, useState } from "react";
import MissionList from "components/MissionList";
import Pagination from 'components/pagination';
import JoinMission from "pages/api/mission/joinMission";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {nowJoinList} from 'states/mission'
import { ParentsDiv } from 'styles/styled'
import NMissionList from "components/nowjoinMissionList";


const H2 = styled('h2')`
  @media only screen and (max-width: 650px) {
    display:none;
  }
`

const MissionTop = styled('div')`
margin-left:35px;
@media only screen and (max-width: 650px) {
    margin-top:20px;
  }
`
const Block = styled("div")`
`;
const Content = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ListContent = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
    margin-bottom:10px;
`;

const MissionBlock = styled("div")`

`;
const ButtonContent = styled("div")`
  display:flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

`;

const BoxSelect = styled("select")`
  border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  padding: 10px;
  font-size:15px;
  margin: 0.5rem;
`;
const BoxInput = styled("input")`
  border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  padding: 10px;
  font-size: 15px;
  width: 12rem;
`;

const SearchButton = styled(SearchRoundedIcon)`
  color: #65ace2;
  margin: 0.5rem;
    :hover {
    cursor: pointer;
  }
`;
const ButtonGroup = styled("div")`
  button {
    margin: 5px;
  }
`;


export default function NowJoin() {
  const [JoinMissionData, setJoinMissionData] = useState([]);
  const [userId, setUserId] = useState();
  const [tmp, setTmp] = useState<string>();
  const [page, setPage] = useState(1);
  const date = new Date();
  const today = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getDate()}`
  const router = useRouter()
  const OPTIONS = [
    { value: "time", name: "???????????????" },
    { value: "likes", name: "????????????" },
    { value: "person", name: "????????????" },
  ];
  const count: number = JoinMissionData?.length
  
  useEffect(()=>{
    if(!localStorage.getItem('access-token')){
      alert("?????????????????????")
      router.push('/login')
    }else{
      const usersId = JSON.parse(localStorage.getItem('recoil-persist')).userId
      setUserId(usersId)
      JoinMission(JSON.parse(localStorage.getItem('recoil-persist')).userId).then((res)=>{
        setJoinMissionData(res)
  })
  }
  }, [])

function ButtonBox() {
  const router = useRouter();
  return (
    <>
      <ButtonGroup>
        <ButtonFull
          hColor={"#98C064"}
          dColor={"#65ACE2"}
          onClick={() => router.push("/mission")}
          style={{fontSize:'15px'}}
        >
          ?????? ?????? ??????
        </ButtonFull>
        <ButtonFull
          dColor={"#98C064"}
          hColor={"#65ACE2"}
          onClick={() => router.push("/mission/createmission")}
          style={{fontSize:'15px'}}
        >
          ????????????
        </ButtonFull>
      </ButtonGroup>
    </>
  );
}
  const handlePageChange = (page) => {
    setPage(page)
  }
  function Filter(key){
    if(JoinMissionData){
      if(key === 'time'){
        let res = [...JoinMissionData];
              res.sort((a, b)=>{
                  return b.missionId - a.missionId
              })
              setJoinMissionData(res)
      }else if(key === 'likes'){
        let res = [...JoinMissionData];
              res.sort((a, b)=>{
                return b.likes - a.likes
              })
              setJoinMissionData(res)
      }else if(key === 'person'){
        let res = [...JoinMissionData];
              res.sort((a, b)=>{
                  return b.nowPerson - a.nowPerson
              })
              setJoinMissionData(res)
      }
    }
  }
  function Search(keyword){
    if(keyword !== ''){
        const result = JoinMissionData.filter((ground) => {
            if(ground['title'].includes(keyword)){
                return ground
            }})
            setJoinMissionData(result)
        setTmp("")
    }
}
  return (
    <ParentsDiv>
     
      {/* ?????? */}
      <Head>
      <title>?????? ?????? ?????? | ??????-?????????</title>
      </Head>


      {/* ????????? ????????? ???????????? ??????! */}
      <Backcomponents name="???????????? ??????"></Backcomponents>
      <MissionTop>
      <H2>???????? ?????? ?????? ?????? ????????????</H2>
      </MissionTop>



      {/* contents! */}
      {/* ?????? ?????? ?????? */}
      <Block style={{ marginBottom: '10px', marginTop: '20px' }}>
        <ButtonContent>
          <ButtonBox />
        </ButtonContent>
      </Block>

      {/* search Bar */}
      <Block style={{ marginBottom: '10px' }}>
        <Content>
        <BoxSelect
        onChange={(e) => {
          e.preventDefault()
          Filter(e.target.value);
        }}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </BoxSelect>
      <div>
          <BoxInput
            type="text"
            id="search"
            placeholder="???????????? ??????????????????."
            onChange={(e) => {
              e.preventDefault();
              setTmp(e.target.value);
            }}
            value={tmp}
          />
        </div>
        <SearchButton
          onClick={()=>{Search(tmp)}}
        />
        </Content>
      </Block>

      {/* ?????? ????????? */}

      <MissionBlock>
        <ListContent>
          {count !== undefined ? 
      <>
        {JoinMissionData?.slice((page - 1) * 5, page * 5).map((item, index) => (
          <NMissionList key={index} today={today} {...item} />))}
        <Pagination page={page} totalcount={count} setPage={handlePageChange} />
      </> 
        :
        <></>}
        </ListContent>
      </MissionBlock>

    </ParentsDiv>
  );
}