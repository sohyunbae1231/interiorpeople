import React, { useRef, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/** 컴포넌트 임포트 */

import "./PostList.css";

const PostList = () => {
  // const [user] = useContext(AuthContext);
  const [postlist, setPostlist] = useState([]);
  const [postUrl, setPostUrl] = useState("/server/community/post-list");
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState(false);
  const pastPostUrlRef = useRef();
  const elementRef = useRef(null); // 무한 스크롤 적용에 필요

  useEffect(() => {
    if (pastPostUrlRef.current === postUrl) {
      return;
    }
    setPostLoading(true);
    axios
      .get(postUrl)
      .then((result) => {
        setPostlist(
          (prevData) => [...prevData, ...result.data]
          // Array.from(new Set([...prevData, ...result.data]))
        );
      })
      .catch((err) => {
        console.error(err);
        setPostError(err);
      })
      .finally(() => {
        setPostLoading(false);
        pastPostUrlRef.current = postUrl;
      });
  }, [postUrl]);

  // ? 리렌더링 될 때마다 함수가 새로 만들어짐 -> useCallback 사용
  const loaderMoreImages = useCallback(() => {
    if (postLoading || postlist.length === 0) {
      return;
    }
    const lastPostId = postlist[postlist.length - 1]._id;
    setPostUrl(`/server/community/post-list?lastPostId=${lastPostId}`);
  }, [postlist, postLoading, setPostUrl]);

  //무한 스크롤 해당 엘리먼트 추적
  useEffect(() => {
    if (!elementRef.current) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loaderMoreImages();
      }
    });
    observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
    };
  }, [loaderMoreImages]);

  /** 받아온 키를 이용하여 사진 호출 */
  const imgList = postlist.map((post, index) => (
    <Link
      key={post.s3_photo_img_url[0]}
      to={`/community/post/${post._id}`}
      ref={index + 1 === postlist.length ? elementRef : undefined} // 무한 스크롤의 기준
    >
      <img alt="" src={`/uploads/${post.s3_photo_img_url[0]}`} />
    </Link>
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        모든 포스트 리스트
      </h3>
      <div className="image-list-container">{imgList}</div>
      {postError && <div>Error...</div>}
      {postLoading && <div>loading...</div>}
    </div>
  );
};

export default PostList;
