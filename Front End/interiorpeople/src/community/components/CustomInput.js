import React from "react";

// 회원가입 페이지에서 인풋용 컴포넌트
const CustomInput = ({ label, value, setValue, type = "text" }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        style={{ width: "100%" }}
        value={value}
        type={type}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
};

export default CustomInput;
