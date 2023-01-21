import axios from "axios";
import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import init from "../helpers/windowToken";

export default class Pokemon extends Component {
  state = {
    email: "",
    password: "",
    pokemon_list: [],
    page: 1,
    pageSize: 10,
    nextpage: false,
    prevpage: false,
    message: "",
    login_status: false,
    inputType: "password",
    notification: false,
    name: "",
  };
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    if (init() === "success") {
      this.setState({ login_status: true });
      axios
        .get("http://localhost:2000/api/pokemon", {
          headers: {
            Authorization: localStorage.getItem["Authorization"],
          },
        })
        .then((resp) => {
          if (resp.data.status === "success") {
            this.setState(
              {
                pokemon_list: resp.data.data.docs,
                nextpage: resp.data.data.hasNextPage,
                page: resp.data.data.page,
              },
              () => {
                console.log(this.state.pokemon_list);
              }
            );
          } else {
            this.setState({
              message: resp.data.message,
            });
          }
        });
    }
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  login = () => {
    let payload = {
      email: this.state.email,
      password: this.state.password,
    };
    axios
      .post("http://localhost:2000/api/users/login", payload)
      .then((resp) => {
        // console.log(resp);
        if (resp.data.status === "success") {
          localStorage.setItem("accessToken", resp.data.token);
          this.setState({
            name: resp.data.name,
            login_status: true,
            notification: true,
            message: resp.data.message,
          });
          setTimeout(() => {
            this.setState({
              notification: false,
            });
          }, 3000);
          window.location.reload();
        } else {
          this.setState({
            notification: true,
            message: resp.data.message,
          });
          setTimeout(() => {
            this.setState({
              notification: false,
            });
          }, 3000);
        }
      });
  };
  logout = () => {
    localStorage.setItem("accessToken", "");
    window.location.reload();
  };
  showPass = () => {
    this.setState({
      inputType: "text",
    });
  };
  hidepass = () => {
    this.setState({
      inputType: "password",
    });
  };
  nextpage = () => {
    axios
      .get(
        `http://localhost:2000/api/pokemon?page=${
          this.state.page + 1
        }&pageSize=8`,
        {
          headers: {
            Authorization: localStorage.getItem["Authorization"],
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        if (resp.data.status === "success") {
          resp.data.data.docs.map((item) => {
            this.state.pokemon_list.push(item);
          });
          this.setState({
            pokemon_list: this.state.pokemon_list,
            page: resp.data.data.page,
            nextpage: resp.data.data.hasNextPage,
            prevpage: resp.data.data.hasPrevPage,
          });
        }
      });
  };
  render() {
    return (
      <div>
        <div
          style={{
            backgroundColor: "#567189",
            height: "10vh",
            padding: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Pokemon APP
          </div>
          {this.state.login_status === true ? (
            <div>
              {this.state.name}
              <br />
              <button onClick={this.logout}> Logout</button>
            </div>
          ) : this.state.notification === true ? (
            <div>{this.state.message}</div>
          ) : null}
        </div>
        {this.state.login_status === false ? (
          <div>
            <div>
              <div>Login Form</div>
              <div>
                <input
                  type="text"
                  placeholder="Your Email"
                  name="email"
                  onChange={this.handleChange}
                />
                <br />
                <input
                  type={this.state.inputType}
                  name="password"
                  placeholder="Password"
                  onChange={this.handleChange}
                />
                {this.state.inputType === "password" ? (
                  <p
                    onClick={this.showPass}
                    style={{
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Show password
                  </p>
                ) : (
                  <p
                    onClick={this.hidepass}
                    style={{
                      fontSize: "15px",
                      cursor: "pointer",
                      marginLeft: "40px",
                      marginTop: "10px",
                    }}
                  >
                    Hide password
                  </p>
                )}
                <button onClick={this.login}>Login</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <InfiniteScroll
              dataLength={this.state.pokemon_list.length}
              next={this.nextpage}
              hasMore={this.state.nextpage}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "25% 25% 25% 25%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {this.state.pokemon_list.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#DDDDDD",
                      height: "400px",
                      width: "300px",
                      margin: "25px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      borderRadius: "15px",
                    }}
                  >
                    <img
                      src={item.images_url}
                      alt=""
                      style={{
                        height: "250px",
                        width: "200px",
                        marginTop: "10px",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Name: {item.name}
                      HP: {item.hp}
                    </div>
                    <div>
                      ATTACKS: {item.attacks.map((att) => att).join(", ")}{" "}
                      <br />
                      ABILITY:{" "}
                      {item.abilities.length > 0
                        ? item.abilities.map((abelity) => abelity).join(", ")
                        : "NA"}
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    );
  }
}
