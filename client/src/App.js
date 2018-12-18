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

  // use backend API to fetch data from database
  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // use backend API to create new query in database
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      idToBeAdded += 1;
    }
    axios.post("/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };

  // use backend API to remove existing database information
  deleteFromDB = idToDelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToDelete) {
        objIdToDelete = dat._id;
      }
    });
    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });
    axios.post("/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {/* display database entries */}
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
                <li style={{ padding: "10px" }} key={data.message}>
                  <span style={{ color: "gray" }}>id:</span>
                  {dat.id}
                  <br />
                  <span style={{ color: "gray" }}>data</span>
                  {dat.message}
                </li>
              ))}
        </ul>

        <div style={{padding:"10px"}}>
        {/* add entry */}
        <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="ID of item to add goes here"
          />
          <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
          </button>
        </div>
        

        <div style={{ padding: "10px" }}>
          {/* delete entry */}
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="ID of item to delete goes here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>

        <div style={{ padding: "10px" }}>
          {/* update entry */}
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToUpdate: e.target.value })}
            placeholder="ID of item to update goes here"
          />
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of item here"
          />
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>
      </div>
    );
  }
}

export default App;
