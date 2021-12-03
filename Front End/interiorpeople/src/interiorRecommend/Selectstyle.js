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

  const [component1, setComponent1] = useState(false);
  const [component2, setComponent2] = useState(false);
  const [component3, setComponent3] = useState(false);
  const [component4, setComponent4] = useState(false);
  const [component5, setComponent5] = useState(false);
  const [component6, setComponent6] = useState(false);

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
            //setInteriorImageUrl(result.data.s3_pre_transfer_img_url);
            setInteriorImageUrl("syle_transfer_img/54g4tga4ty687e5u4.png");
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

  function onChangeComponent1(element) {
    setComponent1(!component1);
  }

  function onChangeComponent2(element) {
    setComponent2(!component2);
  }

  function onChangeComponent3(element) {
    setComponent3(!component3);
  }

  function onChangeComponent4(element) {
    setComponent4(!component4);
  }

  function onChangeComponent5(element) {
    setComponent5(!component5);
  }

  function onChangeComponent6(element) {
    setComponent6(!component6);
  }

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
    <div style={{ width: "90%", marginLeft: "5%", marginTop: "20px" }}>
      {/* 이미지 보여주기 */}
      {loadAll === false ? (
        <div>
          <img
            alt=""
            style={{ marginLeft: "5%", marginTop: "20px", width: "90%" }}
            src={`/uploads/${interiorImageUrl}`}
          />
        </div>
      ) : (
        <div
          style={{
            marginTop: "10px",
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
      )}
      {/* 체크박스 보여주기 */}
      <div>
        <div style={{ marginTop: "10px" }}>
          <h3 style={{ marginBottom: "5px" }}>인식된 가구 카테고리 선택</h3>
          <button
            onClick={onChangeComponent1}
            style={{
              color: component1 ? "white" : `black`,
              backgroundColor: component1 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: component1 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            침대
          </button>
          <button
            onClick={onChangeComponent2}
            style={{
              color: component2 ? "white" : `black`,
              backgroundColor: component2 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: component2 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            의자
          </button>
          <button
            onClick={onChangeComponent3}
            style={{
              color: component3 ? "white" : `black`,
              backgroundColor: component3 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: component3 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            화분
          </button>
          <button
            onClick={onChangeComponent4}
            style={{
              color: component4 ? "white" : `black`,
              backgroundColor: component4 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: component4 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            꽃병
          </button>
          <button
            onClick={onChangeComponent5}
            style={{
              color: component5 ? "white" : `black`,
              backgroundColor: component5 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: component5 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            소파
          </button>
          <button
            onClick={onChangeComponent6}
            style={{
              color: component6 ? "white" : `black`,
              backgroundColor: component6 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: component6 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            컵
          </button>
        </div>
        <div style={{ marginTop: "10px", width: "95%" }}>
          <h3 style={{ marginBottom: "5px" }}>스타일 선택</h3>
          <button
            onClick={onChangeStyle1}
            style={{
              color: style1 ? "white" : `black`,
              backgroundColor: style1 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: style1 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            고풍스러운
          </button>
          <button
            onClick={onChangeStyle2}
            style={{
              color: style2 ? "white" : `black`,
              backgroundColor: style2 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: style2 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            컬러풀
          </button>
          <button
            onClick={onChangeStyle3}
            style={{
              color: style3 ? "white" : `black`,
              backgroundColor: style3 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: style3 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            북유럽풍
          </button>
          <button
            onClick={onChangeStyle4}
            style={{
              color: style4 ? "white" : `black`,
              backgroundColor: style4 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: style4 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            심플
          </button>
          <button
            onClick={onChangeStyle5}
            style={{
              color: style5 ? "white" : `black`,
              backgroundColor: style5 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: style5 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            빈티지
          </button>
        </div>
        <div style={{ marginTop: "10px" }}>
          <h3 style={{ marginBottom: "5px" }}>컬러 선택</h3>
          <button
            onClick={onChangeColor1}
            style={{
              color: color1 ? "white" : `black`,
              backgroundColor: color1 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: color1 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            블랙
          </button>
          <button
            onClick={onChangeColor2}
            style={{
              color: color2 ? "white" : `black`,
              backgroundColor: color2 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: color2 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            블루
          </button>
          <button
            onClick={onChangeColor3}
            style={{
              color: color3 ? "white" : `black`,
              backgroundColor: color3 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: color3 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            브라운
          </button>
          <button
            onClick={onChangeColor4}
            style={{
              color: color4 ? "white" : `black`,
              backgroundColor: color4 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: color4 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            그레이
          </button>
          <button
            onClick={onChangeColor5}
            style={{
              color: color5 ? "white" : `black`,
              backgroundColor: color5 ? "black" : "white",
              fontSize: "14px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              borderColor: color5 ? "black" : "#e7e7e7",
              width: "70px",
              height: "35px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            레드
          </button>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        {/* 다음으로 버튼 */}
        <button
          type="submit"
          className="input-file-button"
          style={{
            background: "#203864",
            color: "white",
            marginTop: "20px",
            width: "100%",
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