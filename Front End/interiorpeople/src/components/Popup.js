import React, { Component, useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';

class Popup extends Component {
  createPopup = () => {
    const { popup, onChange, onCreate, onUpdate } = this.props
    confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='custom-ui'>
            <h1>{popup.type}</h1>
              <div>
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
              <button onClick={() => {
                  onClose()
                }}
              >close</button>
              <button onClick={() => {
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