import React, { Component } from 'react';
import { withRouter, BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TodoListTemplate from './components/TodoListTemplate';
import TodoItemList from './components/TodoItemList';
import Popup from './components/Popup'
import Form from './components/Form';

import Alert from 'react-s-alert';
class Selectstyle extends Component {

  // _id = 3;
  priority = 0;
  state = {
    title: '',
    content: '',
    todos: [
    ],
    popup: {
      flag: false,
      state: '',
      updateID: -1
    }
  }

  handleOpen = (_id) =>{
    const nextPopup = {...this.state.popup}
    if (typeof(_id) === "object") {
      nextPopup.flag = true
      nextPopup.state = 'create'
      this.setState({
        popup: nextPopup
      })
    }
    else {
      const todo = this.state.todos.find(item => item._id === _id)
      nextPopup.flag = true
      nextPopup.state = 'update'
      nextPopup.updateID = _id
      this.setState({
        title: todo.title,
        content: todo.content,
        deadline: todo.deadline,
        popup: nextPopup
      })
    }
  }
  handleClose = () => {
    const { popup } = this.state
    const nextPopup = {...popup}
    nextPopup.flag = false
    nextPopup.state = ''
    nextPopup.updateID = -1
    this.setState({
      title: '',
      content: '',
      deadline: '',
      popup: nextPopup
    })
  }
  render() {
    const { title, content, todos, popup } = this.state;
    const {
      handleChange,
      handleCreate,
      handleKeyPress,
      handleToggle,
      handleRemove,
      handlePriority,
      handleUpdate,
      handleOpen,
    } = this;

    return (
      <div>
        <TodoListTemplate form={
        <Form
          onOpen={handleOpen}
        />}>
          <TodoItemList
            todos={todos}
            onToggle={handleToggle}
            onRemove={handleRemove}
            onOpen={handleOpen}
            onPriority={handlePriority}
          />
        </TodoListTemplate>
        <Alert stack={true} timeout={3000} />
        {
          popup.flag &&
          <Popup
            popup={popup}
            title={title}
            content={content}
            onKeyPress={handleKeyPress}
            onChange={handleChange}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
          />
        }
        <button style={{ background: "#203864", color: "white", marginLeft:"5%", marginTop:"20px", width:"90%", height: "45px", borderRadius: "10px"}}><Link to="/interior/themeupload">다음으로</Link></button>
      </div>
    );
  }
}

export default Selectstyle;