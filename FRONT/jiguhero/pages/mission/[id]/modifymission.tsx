import styled from "styled-components";
import { ButtonFull, ButtonBorder } from 'styles/styled';
import Backcomponents from 'components/back';
import Head from 'next/head';
import React, { useState, useEffect  } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { ko } from 'date-fns/esm/locale';
import locale from 'date-fns/locale/ko'
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { dehydrate, Query, QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { getSession, SessionProvider, useSession } from "next-auth/react";
import PostMission from "pages/api/mission/index";
import moment from "moment";
import missionUserData from "pages/api/mission/[id]";
import { useRouter } from "next/router";
import getDetail from "pages/api/mission/getDetail";
import getImgList from 'pages/api/place/getImgList';
import postImg from 'pages/api/mission/postImg';
import getSido from "pages/api/ecomarket/getSido";
import getGugun from "pages/api/ecomarket/getGugun";
import getDong from "pages/api/ecomarket/getDong";
import putMission from 'pages/api/mission/editMission'
import { useRecoilState } from "recoil";
import { missionDetail } from "states/mission";


const MissioWrapper = styled('div')`
  display:flex;
  flex-direction: column;
  margin-top: 30px;
`


const Block = styled('div')`
  margin: 0.4rem;
`

const Content = styled('div')`
  display:flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
    @media screen and (min-width: 360px){
        width:400px;
    }
    @media screen and (min-width: 550px){
        width:500px;
    }
    @media screen and (min-width:700px){
        width:620px;
    }
`

const BtnContent = styled('div')`
  display:flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
    @media screen and (min-width: 360px){
        width:400px;
    }
    @media screen and (min-width: 550px){
        width:500px;
    }
    @media screen and (min-width:700px){
        width:620px;
    }
`

const Text = styled('a')`
  font-weight: bold;
`

const BoxInput = styled('input')`
  border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  padding: 10px;
  width: 13rem;
  margin-left: 10px;
  font-size:15px;
  margin:10px;
`
const DateInput = styled(DatePicker)`
  border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  width: 110px;
  box-sizing: border-box;
  padding: 10px;
  margin-right: 9px;
  margin-left: 9px;
`
const DateWrapper = styled('div')`
  display: inline-flex;

`

const SelectSido = styled('select')`
  border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  padding: 10px;
  margin: 0.5rem;
  font-size:13px;
  @media screen and (max-width: 450px) {
    font-size:11px;
  }
  width:auto;
`

const SelectGugun = styled(SelectSido)`
`

const SelectDong = styled(SelectSido)`

`
const CameraBox = styled('form')`
width: 300px;
  height: 250px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 0px 5px 0px #dadce0 inset;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (min-width: 360px) {
    width: 300px;
    height: 250px;
  }
  margin-bottom:10px;
  img {
    object-fit: cover;
    width: 250px;
    height: 180px;
    border-radius: 15px;
  }
`
const CameraBtn = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PointInput = styled('input')`
  border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  padding: 10px;
  width: 13rem;
  font-size:15px;
  margin: 5px 10px 5px 10px;
`
const PeopleInput = styled(PointInput)`
`

const MissionText = styled('textarea')`
 border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  width: 30%;
  @media screen and (max-width: 450px) {
    width: 90%;
  }
  height: 150px;
  margin:10px;
  padding:10px;
  font-size:15px;
`

const SubmitBtn = styled(ButtonFull)`
  width: 300px;
  
`
const BottomDiv = styled('div')`
  margin-bottom: 80px;
`
const H2 = styled('h2')`
  @media only screen and (max-width: 650px) {
    display:none;
  }
`


export default function Createmission() {
  const router = useRouter();
  const [point, setPoint] = useState<Number>(); // ?????????
  const [detailMission, setDetailMission] = useRecoilState(missionDetail);
  const [userId, setUserId] = useState("");
  const [missionId, setMissionId] = useState(detailMission.missionId);
  useEffect(()=>{
    if(router.query.id){
      setMissionId(router.query.id)
      const usersId = JSON.parse(localStorage.getItem('recoil-persist')).userId
      setUserId(usersId)
      if(userId){
        getDetail(router.query.id, userId).then((res)=>{
          setDetailMission(res)})
      }
    }}, [])

  const [missionImg, setMissionImg] = useState<File>();
  const [preview, setPreview] = useState<string>(); // ????????? ???????????? ??????
  const [title, setTitle] = useState(detailMission.title)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [pointNum, setPointNum] = useState(detailMission.entryPoint)
  const [people, setPeople] = useState(detailMission.maxPerson)
  const [text, setText] = useState(detailMission.content)
  const [astartDate, setAstartDate] = useState(["", ""]); // ????????? ?????? [??????, ???, ???, ???]
  const [aendDate, setAendDate] = useState(["", ""]); // ????????? ?????? [??????, ???, ???, ???]
  
  const onPeopleChange = (event) => {
    setPeople(event.target.value)
  }
  const onChange = (event) => {
    setTitle(event.target.value)
  }
  const changeHandler = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setMissionImg(file);
    } else {
        setMissionImg(null)
    }
  };
  useEffect(() => {
    if (missionImg) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(missionImg);
    } else {
      setPreview(null);
    }
  }, [missionImg]);

const { data: sido } = useQuery(["sido"], getSido);
const [ChoiceSido, setChoiceSido] = useState(["00", ""]);
const { data: gugun } = useQuery(
  ["gugun", ChoiceSido],
  () => getGugun(ChoiceSido[0]),
  {
    enabled: !!ChoiceSido,
  }
);
const [ChoiceGugun, setChoiceGugun] = useState(["00", ""]);
const { data: dong } = useQuery(
  ["dong", ChoiceGugun],
  () => getDong(ChoiceGugun[0]),
  {
    enabled: !!ChoiceGugun,
  }
);
const [ChoiceDong, setChoiceDong] = useState(["00", ""]);

  return (
    <>
      {/* ?????? */}
      <Head>
        <title>?????? ?????? | ??????-?????????</title>
      </Head>


      {/* ????????? ????????? ???????????? ??????! */}
      <Backcomponents name='?????? ??????'></Backcomponents>


      <MissioWrapper>
        <H2>???????? ???????????? ?????? ??????</H2>
        {/* ?????????????????? */}
        <Block style={{display:'flex', flexDirection:'column',justifyContent:'center'}}>
          <Content>
          <CameraBtn>
            <IconButton aria-label="upload picture" component="label">
            <input
                          hidden
                          accept="image/*"
                          type="file"
                          name="file"
                          onChange={changeHandler}
                      />
              {missionImg ? (
                    <CameraBox>
                    <img src={preview} style={{width:'inherit', height:'inherit', objectFit:'cover'}} />
                    </CameraBox>
                ) : (
                    <CameraBox>
                    <PhotoCamera fontSize="large" style={{color:'#98c064'}}/>
                    </CameraBox>
                )}
            </IconButton>
          </CameraBtn>
          </Content>
          {userId ? 
                    <ButtonFull hColor={'#98C064'}
                    dColor={'#65ACE2'} style={{margin:'10px'}} onClick={()=>{postImg(missionImg, userId, missionId, 1)}}>?????? ?????? ??????</ButtonFull>
                : <></>}
        </Block>

        {/* ????????? */}
        <Block>
          <Content>
          <div>
        <Text>
          ?????????
        </Text>
        <BoxInput
          type="text"
          onChange={onChange}
          placeholder={title} />
      </div>
          </Content>
        </Block>

        {/* ???????????? */}
        <Block>
          <Content>
          <Text>????????????</Text>
      <DateWrapper>

        <DateInput
          selected={startDate}
          onChange={(date) => {
            console.log(date)
            setStartDate(date)
            setAstartDate(date.toISOString().split("T"));
          }}
          selectsStart
          locale={locale}
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
        />
        <a> ~</a>
        <DateInput
          selected={endDate}
          onChange={(date) => {
            console.log(date)
            setEndDate(date)
            setAendDate(date.toISOString().split("T"));
          }}
          selectsEnd
          locale={locale}
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
        />

      </DateWrapper>
          </Content>
        </Block>

        {/* ?????? */}
        <Block>
          <Content>
          <Text>??????</Text>
            {/* ?????? ?????? */}
            <SelectSido
          onChange={(e) => {
            setChoiceSido(e.target.value.split(","));
          }}
        >
          <option value="">{ChoiceSido[1] ? ChoiceSido[1] : "???/???"}</option>
          {sido?.map((item) => (
            <option
              key={item["sidoCode"]}
              value={[item["sidoCode"], item["sidoName"]]}
            >
              {item["sidoName"]}
            </option>
          ))}
        </SelectSido>

        {/* ?????? ?????? */}
        <SelectGugun
          onChange={(e) => {
            setChoiceGugun(e.target.value.split(","));
          }}
        >
          <option value="">
            {ChoiceGugun[1] ? ChoiceGugun[1] : "???/???/???"}
          </option>
          {gugun?.map((item) => (
            <option
              key={item["gugunCode"]}
              value={[item["gugunCode"], item["gugunName"].split(" ")[1]]}
            >
              {item["gugunName"].split(" ")[1]}
            </option>
          ))}
        </SelectGugun>

        {/* ??? ?????? */}
        <SelectDong
          onChange={(e) => {
            setChoiceDong(e.target.value.split(","));
          }}
        >
          <option value="">{ChoiceDong[1] ? ChoiceDong[1] : "???/???/???"}</option>
          {dong?.map((item) => (
            <option
              key={item["dongCode"]}
              value={[item["dongCode"], item["dongName"].split(" ")[2]]}
            >
              {item["dongName"].split(" ")[2]}
            </option>
          ))}
        </SelectDong>
          </Content>
        </Block>

        {/* ????????? */}
        <Block>
          <Content>
          <Text>?????????</Text>
      <PointInput
        type="number"
        min={500}
        max={5000}
        step={500}
        defaultValue={Number(pointNum)}
        onChange={(e)=>{
          e.preventDefault()
          setPointNum(e.target.value)
        }}

        onBlur={(e) => {
          e.preventDefault();
          const tmp = Number(pointNum);
          if (tmp < 500) {
            setPointNum('500')
          } else if (tmp > 5000) {
            setPointNum('5000')
          } else if (tmp % 10) {
            setPointNum(`${tmp-(tmp%10)}`)
          }
          setPoint(Number(pointNum));
          
        }} />
          </Content>
        </Block>

        {/* ?????? */}
        <Block>
          <Content>
          <Text>??????</Text>
      <PeopleInput
        onChange={onPeopleChange}
        value={people}
        type='number' min="1" />
          </Content>
        </Block>


        {/* ???????????? */}
        <MissionText
        placeholder={text}
        onChange={(event) => {
          setText(event.target.value)
          console.log(event.target.value)
        }}
        style={{padding:'10px'}}
      />

        {/* ???????????? */}
        <Block>
          <BtnContent>
            <SubmitBtn
              hColor={'#98C064'}
              dColor={'#65ACE2'}
            onClick={()=>{
              const postdata = {
                title,
                missionId,
                startDate: astartDate[0],
                endDate: aendDate[0],
                point,
                people,
                sido: ChoiceSido[0],
                gugun: ChoiceGugun[0],
                dong: ChoiceDong[0],
                userId,
                text
              };
              console.log(postdata)
              putMission(postdata).then((res)=>{
                console.log(res)
                router.push(`/mission/${missionId}`)})}}
            >??????</SubmitBtn>
          </BtnContent>
        </Block>
      </MissioWrapper>

      <BottomDiv></BottomDiv>

    </>
  )
}

// export async function getServerSideProps(context) {
//   const createmission = new QueryClient()
//   await createmission.prefetchQuery(['mission'], () => { PostMission() })

//   return {
//     props: {
//       data: {

//         dehydratedState: dehydrate(createmission)
//       },
//     },
//   };

// }
