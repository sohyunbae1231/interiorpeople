import React, { Component, useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';

import "./StyleEdit.css";

class Popup extends Component {
  createPopup = () => {
    const { popup, onChange, onCreate, onUpdate } = this.props
    confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='popup-ui'>
            <button class="close close1" onClick={() => {
                    onClose()
                  }}
                ></button>
              <div class="popup-text">
                <h3>가구 카테고리</h3>
                <input
                  type="checkbox"
                  onChange={onChange}
                />
                <h3>스타일</h3>
                <input
                  type="checkbox"
                  onChange={onChange}
                />
                <h3>색상</h3>
                <input
                  type="checkbox"
                  onChange={onChange}
                />
              </div>
              <button style={{ background: "#203864", color: "white", marginLeft:"70%", marginTop:"25px", width:"22%", borderRadius: "5px"}} onClick={() => {
                if (popup.state === 'update') onUpdate()
                else onCreate()
                onClose()
              }}>save</button>
            </div>
          )
        }
      })
  }
  render() {
    return (
      <div className="popup">
          {this.createPopup()}
      </div>
    );
  }
}

export default Popup;