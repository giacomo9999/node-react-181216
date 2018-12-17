import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  //initialize state
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // fetch all data in DB - poll DB for changes
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // stop checking the DB for changes when the component unmounts
  // ** is this necessary? the component doesn't exist after it unmounts **
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.state({ intervalIsSet: null });
    }
  }

  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      idToBeAdded += 1;
    }
    axios.post("/api/putData", {
      id: idToBeAdded,
      message: message,
    });
  };

  render() {
    return <div>JIM IS STILL HERE</div>;
  }
}

export default App;
