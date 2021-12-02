import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./Upload.css";

const Selectstyle = () => {
  const [imageId, setImageId] = useState();
  const [category, setCategory] = useState([]);
  const [interiorImageUrl, setInteriorImageUrl] = useState();
  const [buttons, setButtons] = useState();

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
        left: Number(element[0]),
        top: Number(element[1]),
        width: Number(element[2]) - Number(element[0]),
        height: Number(element[3]) - Number(element[1]),
        position: "absolute",
      }}
    >
      {element[4].replace(/[0-9]/g, "")}
    </button>
  ));

  return (
    <div>
      {/* 이미지 보여주기 */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <img
          alt=""
          style={{
            zIndex: -132,
          }}
          src={`/uploads/${interiorImageUrl}`}
        />
        <button
          style={{
            left: 123,
            top: 0,
            width: 52,
            height: 123,
            position: "absolute",
          }}
        >
          fdsfasdf
        </button>
        <button
          style={{
            top: 23,
            width: 52,
            height: 123,
            position: "absolute",
          }}
        >
          fdsfasdf
        </button>
        {buttonsOnImage}
      </div>
      {/* 체크박스 보여주기 */}
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
    </div>
  );
};

export default Selectstyle;

// const formData = [
//   { id: 1, name: "딸기" },
//   { id: 2, name: "바나나" },
//   { id: 3, name: "피자" },
//   { id: 4, name: "불고기" },
//   { id: 5, name: "김치" },
//   { id: 6, name: "볶음밥" },
//   { id: 7, name: "쌀국수" },
//   { id: 8, name: "육개장" },
//   { id: 9, name: "커피" },
// ];

// const [isChecked, setIsChecked] = useState(false); //체크 여부
// const [checkedItems, setCheckedItems] = useState(new Set()); //체크된 요소들

// const checkHandler = ({ target }) => {
//   setIsChecked(!isChecked);
//   checkedItemHandler(target.parentNode, target.value, target.checked);
// };

// const checkedItemHandler = (box, id, isChecked) => {
//   if (isChecked) {
//     //체크 되었을때
//     checkedItems.add(id); //체크시 삽입
//     setCheckedItems(checkedItems); //체크 요소 넣어주기
//     box.style.backgroundColor = "#F6CB44"; //스타일 변경
//   } else if (!isChecked && checkedItems.has(id)) {
//     //체크가 안되었고, id가 있을때(클릭 2번시)
//     checkedItems.delete(id); //체크 두번시 삭제
//     setCheckedItems(checkedItems);
//     box.style.backgroundColor = "#fff";
//   }
//   return checkedItems;
// };

// return (
//   <div className="contStyle">
//     {formData.map((item) => (
//       <label key={item.id} className="innerBox">
//         <input
//           type="checkbox"
//           value={item.name}
//           onChange={(e) => checkHandler(e)}
//         />
//         <div>{item.name}</div>
//       </label>
//     ))}
//   </div>
// );
