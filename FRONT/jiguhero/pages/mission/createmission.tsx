import styled from "styled-components";
import { ButtonFull, ButtonBorder, ParentsDiv } from "styles/styled";
import Backcomponents from "components/back";
import Head from "next/head";
import React, { useEffect, useState, FocusEvent } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { ko } from 'date-fns/esm/locale';
import locale from "date-fns/locale/ko";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {
  dehydrate,
  Query,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import PostMission from "pages/api/mission/index";
import Image from "next/image";
import moment from "moment";
import PostMissionImg from "pages/api/postMissionImg";
import { useRouter } from "next/router";
import getSido from "pages/api/ecomarket/getSido";
import getGugun from "pages/api/ecomarket/getGugun";
import getDong from "pages/api/ecomarket/getDong";
import PostNewMission from "pages/api/mission/postNewMission";
import { useRecoilState } from "recoil";
import { UserId } from "states/user";
import userData from "pages/api/user/[id]";

const H2 = styled("h2")`
  @media only screen and (max-width: 650px) {
    display: none;
  }
`;

// const MissioWrapper = styled("div")`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   @media only screen and (min-width: 650px) {
//     display: none;
//   }
// `;
const MissioWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

const Block = styled("div")`
  margin: 0.4rem;
`;

const Content = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: 360px) {
    width: 400px;
  }
  @media screen and (min-width: 550px) {
    width: 500px;
  }
  @media screen and (min-width: 700px) {
    width: 620px;
  }
`;

const BtnContent = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  @media screen and (min-width: 360px) {
    width: 400px;
  }
  @media screen and (min-width: 550px) {
    width: 500px;
  }
  @media screen and (min-width: 700px) {
    width: 620px;
  }
`;

const Text = styled("a")`
  font-weight: bold;
`;

const BoxInput = styled("input")`
  border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  padding: 10px;
  width: 13rem;
  margin-left: 10px;
  font-size: 15px;
  margin: 10px;
`;
const DateInput = styled(DatePicker)`
  border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  width: 110px;
  box-sizing: border-box;
  padding: 10px;
  margin-right: 9px;
  margin-left: 9px;
`;
const DateWrapper = styled("div")`
  display: inline-flex;
  margin: 5px;
`;

const SelectSido = styled("select")`
  border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  padding: 10px;
  margin: 0.5rem;
  font-size: 13px;
  @media screen and (max-width: 450px) {
    font-size: 11px;
  }
  width: auto;
`;

const SelectGugun = styled(SelectSido)``;
const SelectDong = styled(SelectSido)``;

const CameraBox = styled("form")`
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
  margin-bottom: 10px;
  img {
    object-fit: cover;
    width: 250px;
    height: 180px;
    border-radius: 15px;
  }
`;
const CameraBtn = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PointInput = styled("input")`
  border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  padding: 10px;
  width: 13rem;
  font-size: 15px;
  margin: 5px 10px 5px 10px;
`;
const PeopleInput = styled(PointInput)``;

const MissionText = styled("textarea")`
  border: #65ace2 solid 1px;
  background-color: white;
  border-radius: 15px;
  width: 60%;
  @media screen and (max-width: 450px) {
    width: 90%;
  }
  height: 150px;
  margin: 10px;
  padding: 10px;
  font-size: 15px;
`;

const SubmitBtn = styled(ButtonFull)`
  width: 300px;
`;
const BottomDiv = styled("div")`
  margin-bottom: 80px;
`;

export default function Createmission() {
  // ?????????

  const [userId, setUserId] = useRecoilState(UserId);
  // ?????????

  const [createImg, setCreateimg] = useState<File>(null); // ????????? ??????
  const [preview, setPreview] = useState<string>(); // ????????? ???????????? ??????

  const [title, setTitle] = useState(""); // ?????????
  const [startDate, setStartDate] = useState(new Date()); // ?????????
  const [endDate, setEndDate] = useState(new Date()); // ?????????
  const [astartDate, setAstartDate] = useState(["", ""]); // ????????? ?????? [??????, ???, ???, ???]
  const [aendDate, setAendDate] = useState(["", ""]); // ????????? ?????? [??????, ???, ???, ???]
  const [point, setPoint] = useState<Number>(500); // ?????????
  const [people, setPeople] = useState<Number>();
  const [content, setContent] = useState(""); //??????
  const router = useRouter();
  const { data: sido } = useQuery(["sido"], getSido);
  const [ChoiceSido, setChoiceSido] = useState(["00", ""]);
  const [titleName, setTitleName] = useState("");
  const [peopleNum, setPeopleNum] = useState("10");
  const [userPoint, setUserPoint] = useState(0);
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

  useEffect(() => {
    if (userId) {
      userData(userId).then((res) => {
        setUserPoint(res.point);
      });
    }
  }, []);

  // ?????? ?????? ??????
  function MissionPicture() {
    const changeHandler = (e) => {
      const file = e.target.files[0];
      if (file && file.type.substr(0, 5) === "image") {
        setCreateimg(e.target.files[0]);
      } else {
        setCreateimg(null);
      }
    };
    useEffect(() => {
      if (createImg) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(createImg);
      } else {
        setPreview(null);
      }
    }, [createImg]);
    return (
      <CameraBtn>
        <IconButton aria-label="upload picture" component="label">
          <input
            hidden
            accept="image/*"
            type="file"
            name="file"
            onChange={changeHandler}
          />

          {createImg ? (
            <CameraBox>
              <img src={preview} />
            </CameraBox>
          ) : (
            <CameraBox>
              <PhotoCamera fontSize="large" />
            </CameraBox>
          )}
        </IconButton>
      </CameraBtn>
    );
  }

  // ?????????
  function MissionName() {
    const [titleName, setTitleName] = useState("");
    return (
      <div>
        <Text>?????????</Text>
        <BoxInput
          onChange={(e) => {
            setTitleName(e.target.value);
          }}
          onBlur={(e) => {
            setTitle(titleName);
          }}
        />
      </div>
    );
  }

  //????????????
  // function DatePick() {
  //   return (
  //     <>

  //     </>
  //   );
  // }
  //??????

  //?????? ?????? ---
  function MissionLocation() {
    return (
      <>
        <div>
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
            <option value="">
              {ChoiceDong[1] ? ChoiceDong[1] : "???/???/???"}
            </option>
            {dong?.map((item) => (
              <option
                key={item["dongCode"]}
                value={[item["dongCode"], item["dongName"].split(" ")[2]]}
              >
                {item["dongName"].split(" ")[2]}
              </option>
            ))}
          </SelectDong>
        </div>
      </>
    );
  }

  return (
    <ParentsDiv>
      {/* ?????? */}
      <Head>
        <title>?????? ???????????? | ??????-?????????</title>
      </Head>

      {/* ????????? ????????? ???????????? ??????! */}
      <Backcomponents name="?????? ????????????"></Backcomponents>

      <MissioWrapper>
        <H2>???????? ???????????? ?????? ????????????</H2>

        {/* ?????????????????? */}
        <Block>
          <Content>
            <MissionPicture />
          </Content>
        </Block>

        {/* ????????? */}
        <Block>
          <Content>
            {/* <Text>?????????</Text> */}
            <div>
              <Text>?????????</Text>
              <BoxInput
                placeholder="????????? ????????? ??????????????????!"
                onChange={(e) => {
                  setTitleName(e.target.value);
                }}
                onBlur={(e) => {
                  e.preventDefault();
                  setTitle(titleName);
                }}
              />
            </div>
            {/* <BoxInput onChange={(e) => {
            e.preventDefault()
            setTitle(e.target.value)}}  /> */}
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
                  setStartDate(date);
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
                  setEndDate(date);
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
            <MissionLocation />
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
              defaultValue={Number(point)}
              onChange={(e) => {
                e.preventDefault();

                setPoint(Number(e.target.value));
              }}
              onBlur={(e) => {
                e.preventDefault();
                const tmp = Number(point);
                if (tmp < 500) {
                  setPoint(500);
                } else if (tmp > 5000) {
                  setPoint(5000);
                } else if (tmp % 10) {
                  setPoint(Number(tmp) - (Number(tmp) % 10));
                }
                setPoint(Number(point));
              }}
            />
          </Content>
        </Block>

        {/* ?????? */}
        <Block>
          <Content>
            <Text>??????</Text>
            <PeopleInput
              type="number"
              step={10}
              defaultValue={peopleNum}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                e.preventDefault();
                const num = Number(e.target.value);
                if (num < 10) {
                  setPeopleNum("10");
                  setPeople(10);
                } else if (num > 5000) {
                  setPeopleNum("5000");
                  setPeople(5000);
                } else if (num % 10) {
                  setPeopleNum(`${num - (num % 10)}`);
                  setPeople(Number(`${num - (num % 10)}`));
                } else {
                  setPeople(Number(num));
                }
              }}
            />
          </Content>
        </Block>

        {/* ???????????? */}
        <MissionText
          placeholder="?????? ????????? ??????????????????????"
          onChange={(e) => {
            setContent(e.target.value);
          }}
          value={content}
        />

        {/* ???????????? */}
        <Block>
          <BtnContent>
            <SubmitBtn
              hColor={"#98C064"}
              dColor={"#65ACE2"}
              // variant="contained"
              type="submit"
              onClick={async () => {
                if(point> userPoint){
                  alert('???????????? ???????????????!')
                  router.push('/mission')
                }else{
                  const postdata = {
                    title,
                    startDate: astartDate[0],
                    endDate: aendDate[0],
                    point,
                    people,
                    sido: ChoiceSido[0],
                    gugun: ChoiceGugun[0],
                    dong: ChoiceDong[0],
                    userId,
                    content,
                  };
                  console.log(postdata);
                  const missionId = await PostNewMission(postdata);
                  await PostMissionImg(createImg, userId, missionId);
                  router.push("/mission");
                }
        
                
              }}
            >
              ??????
            </SubmitBtn>
          </BtnContent>
        </Block>
      </MissioWrapper>
      <BottomDiv></BottomDiv>
    </ParentsDiv>
  );
}

export async function getServerSideProps() {
  const createmission = new QueryClient();

  await createmission.prefetchQuery(["mission"], () => {});

  return {
    props: {
      data: {
        dehydratedState: dehydrate(createmission),
      },
    },
  };
}
