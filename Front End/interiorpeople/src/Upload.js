import React, { useState, useEffect } from 'react';
import axios,{ post } from 'axios';
import {useNavigate} from "react-router-dom"
function Upload() {
    const navigate = useNavigate();
    const [imgBase64, setImgBase64] = useState([]); // 파일 base64
    const [imgFile, setImgFile] = useState(null);	//파일	
    const [tag, setTag] = useState([]);
    const [comment,setComment] = useState();
    var images = []
 
    const handleChangeFile = (event) => {
        console.log(event.target.files)
        setImgFile(event.target.files);
        //fd.append("file", event.target.files)
        setImgBase64([]);
        for(var i=0;i<event.target.files.length;i++){
        if (event.target.files[i]) {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]); // 1. 파일을 읽어 버퍼에 저장합니다.
        // 파일 상태 업데이트
        reader.onloadend = () => {
            // 2. 읽기가 완료되면 아래코드가 실행됩니다.
            const base64 = reader.result;
            if (base64) {
            //  images.push(base64.toString())
            var base64Sub = base64.toString()
            
            setImgBase64(imgBase64 => [...imgBase64, base64Sub]);
            //  setImgBase64(newObj);
            // 파일 base64 상태 업데이트
            //  console.log(images)
        }
      }
    }
  }

  }
  const resetTag  = () => {
    document.getElementById('innerinput').value = '';
  }
  useEffect(resetTag, [tag])

  const setTags = (e) => {
    if(e.key == ' ' || e.key == 'Enter'){
      if(document.getElementById('innerinput').value != ''){
        setTag(tag => [...tag, e.target.value]);
      }else{
        alert("태그를 입력해주세요")
        return false;
      }
     
     
    }
  }
  const deleteTag = (index) => {
    var array = [...tag];
    array.splice(index, 1);
    setTag(array)
  }

  const setComments = (e) => {
    setComment(e.target.value)
  }

  const WriteBoard = async()=> {
    if(imgFile == null){
      alert("이미지를 등록 해주세요");
      return false;
    }
    const fd = new FormData();
    Object.values(imgFile).forEach((file) => fd.append("file", file));
  
    fd.append(
      "tag",
    tag
    );
    fd.append(
      "comment",
      comment
    );

   
    // axios(
    //   {
    //     url: '/board/WriteBoard.do',
    //     method: 'post',
    //     headers: {
    //       "Content-Type": `multipart/form-data`,
    //     },
    //     data: fd , 
    //     baseURL: 'http://localhost:8080'
    //     //withCredentials: true,
    //   }
    // ).then(function (response) {
    //  console.log(response)
    // });
    const fd2 = new FormData();
    await axios.post('http://localhost:8080/board/WriteBoard.do', fd, {
  headers: {
    "Content-Type": `multipart/form-data; `,
  }
})
.then((response) => {
   if(response.data){
    navigate.push("/MainBoard");
  }
})
.catch((error) => {
  // 예외 처리
})
  } 
    return (
      <div class="FlexRow_c">
        <div class="FlexCol_c">
        <input type="file" id="file" style={{display:'none'}} onChange={handleChangeFile} multiple="multiple" />
        <div class="outer-input FlexRow_ac">
            <input class="innerinput" id="innerinput" style={{border:'0px',height:'30px',width:'120px',paddingLeft:'12px'}} ></input>
        </div>
      </div>
      <div class="borderBox" style={{width:'700px', height:"560px", marginLeft:'60px',border:'2px solid black'}}>
        {imgBase64.map((item) => {
        return(
            <img className="d-block w-100" src={item} alt="First slide" style={{width:"100%",height:"550px"}} />
        )
        }) }
      </div>
        <label for="file" class="FlexCol_c">사진 업로드</label>
      </div>
    );
  }
  

  export default Upload;  