import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./Upload.css";
import { useNavigate } from "react-router-dom";

const Selectstyle = () => {
  const [imageId, setImageId] = useState();
  const [category, setCategory] = useState([]);
  const [interiorImageUrl, setInteriorImageUrl] = useState();
  const [buttons, setButtons] = useState([]);
  // 사용자가 스타일과 컬러는 하나만 선택할 수 있도록 하고
  // 선택한 스타일과 컬러 하나씩만 저장
  const [styles, setStyles] = useState(undefined);
  const [color, setColor] = useState(undefined);
  const navigate = useNavigate();
  const [loadAll, setLoadAll] = useState(false);

  const [style1, setStyle1] = useState(false);
  const [style2, setStyle2] = useState(false);
  const [style3, setStyle3] = useState(false);
  const [style4, setStyle4] = useState(false);
  const [style5, setStyle5] = useState(false);

  const [color1, setColor1] = useState(false);
  const [color2, setColor2] = useState(false);
  const [color3, setColor3] = useState(false);
  const [color4, setColor4] = useState(false);
  const [color5, setColor5] = useState(false);

  useEffect(() => {
    // 이미지가 없으면 되돌아감
    const imageIdTemp = sessionStorage.getItem("imageId");
    setImageId(imageIdTemp);
    if (!imageIdTemp) {
      alert("이미지를 업로드해주세요.");
      window.location.replace("/interior/upload");
    } else {
      try {
        axios
          .post("/api/image/pre-image", { imageId: imageIdTemp })
          .then((result) => {
            setInteriorImageUrl(result.data.s3_pre_transfer_img_url);
            setCategory(result.data.category_in_img);
          });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // 이미지 위에 버튼 올리기
  const buttonsOnImage = category.map((element) => (
    <button
      style={{
        marginLeft: Number(element[0]),
        marginTop: Number(element[1]),
        width: Number(element[2]) - Number(element[0]),
        height: Number(element[3]) - Number(element[1]),
        backgroundColor: "transparent",
        position: "absolute",
        border: "5px solid skyblue",
      }}
    >
      {element[4].replace(/[0-9]/g, "")}
    </button>
  ));

  // formData라는 instance에 담아 보냄
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (category) {
      formData.append("category", category);
      formData.append("imageId", imageId);
      formData.append("color", color);
      try {
        await axios
          .post("/api/image/select-style", formData, {
            Headers: { "Content-Type": "multipart/result" },
          })
          .then((res) => {});
      } catch (err) {
        //alert(err);
      }
    }
    navigate("/interior/themeupload");
  };

  function onChangeStyle1(element) {
    setStyle1(true);
    setStyle2(false);
    setStyle3(false);
    setStyle4(false);
    setStyle5(false);
  }
  function onChangeStyle2(element) {
    setStyle1(false);
    setStyle2(true);
    setStyle3(false);
    setStyle4(false);
    setStyle5(false);
  }
  function onChangeStyle3(element) {
    setStyle1(false);
    setStyle2(false);
    setStyle3(true);
    setStyle4(false);
    setStyle5(false);
  }
  function onChangeStyle4(element) {
    setStyle1(false);
    setStyle2(false);
    setStyle3(false);
    setStyle4(true);
    setStyle5(false);
  }
  function onChangeStyle5(element) {
    setStyle1(false);
    setStyle2(false);
    setStyle3(false);
    setStyle4(false);
    setStyle5(true);
  }

  function onChangeColor1(element) {
    setColor1(true);
    setColor2(false);
    setColor3(false);
    setColor4(false);
    setColor5(false);
  }
  function onChangeColor2(element) {
    setColor1(false);
    setColor2(true);
    setColor3(false);
    setColor4(false);
    setColor5(false);
  }
  function onChangeColor3(element) {
    setColor1(false);
    setColor2(false);
    setColor3(true);
    setColor4(false);
    setColor5(false);
  }
  function onChangeColor4(element) {
    setColor1(false);
    setColor2(false);
    setColor3(false);
    setColor4(true);
    setColor5(false);
  }
  function onChangeColor5(element) {
    setColor1(false);
    setColor2(false);
    setColor3(false);
    setColor4(false);
    setColor5(true);
    console.log(element);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        {/* 이미지 보여주기 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            float: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              position: "relative",
            }}
          >
            <img
              alt=""
              style={{
                zIndex: -1,
              }}
              src={`/uploads/${interiorImageUrl}`}
            />

            {buttonsOnImage}
          </div>
        </div>
        {/* 체크박스 보여주기 */}
        <div>
          <div>
            <h2>인식된 가구 카테고리 선택하기</h2>
          </div>
          <div>
            <h2>스타일 선택</h2>
            <button
              onClick={onChangeStyle1}
              style={{ color: style1 ? `blue` : "black" }}
            >
              고풍스러움
            </button>
            <button
              onClick={onChangeStyle2}
              style={{ color: style2 ? `blue` : "black" }}
            >
              컬러풀
            </button>
            <button
              onClick={onChangeStyle3}
              style={{ color: style3 ? `blue` : "black" }}
            >
              북유럽풍
            </button>
            <button
              onClick={onChangeStyle4}
              style={{ color: style4 ? `blue` : "black" }}
            >
              심플
            </button>
            <button
              onClick={onChangeStyle5}
              style={{ color: style5 ? `blue` : "black" }}
            >
              빈티지
            </button>
          </div>
          <div>
            <h2>컬러 선택</h2>
            <button
              onClick={onChangeColor1}
              style={{ color: color1 ? `blue` : "black" }}
            >
              블랙
            </button>
            <button
              onClick={onChangeColor2}
              style={{ color: color2 ? `blue` : "black" }}
            >
              블루
            </button>
            <button
              onClick={onChangeColor3}
              style={{ color: color3 ? `blue` : "black" }}
            >
              브라운
            </button>
            <button
              onClick={onChangeColor4}
              style={{ color: color4 ? `blue` : "black" }}
            >
              그레이
            </button>
            <button
              onClick={onChangeColor5}
              value="fdasfd"
              style={{ color: color5 ? `blue` : "black" }}
            >
              레드
            </button>
          </div>
        </div>
        {/* 다음으로 버튼 */}
        <button
          type="submit"
          className="input-file-button"
          style={{
            background: "#203864",
            color: "white",
            marginLeft: "5%",
            marginTop: "20px",
            width: "90%",
            height: "45px",
            borderRadius: "10px",
          }}
        >
          다음으로
        </button>
      </form>
    </div>
  );
};

export default Selectstyle;
