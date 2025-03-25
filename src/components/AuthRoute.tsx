
import React, { Component } from "react";
import { NavigateFunction } from "react-router-dom";
import { withRouter } from "../utils/withRouter";

type AuthRouteProps = {
  navigate: NavigateFunction;
  children: React.ReactNode;
};

type AuthRouteState = {
  isAuthenticated: boolean;
};

export class AuthRoute extends Component<AuthRouteProps, AuthRouteState> {
  constructor(props: AuthRouteProps) {
    super(props);

    this.state = {
      isAuthenticated: false,
    };
  }

  componentDidMount() {
    window.addEventListener("storage", this.handleStorageChange);


    this.setState(
      { isAuthenticated: this.checkAuthentication() },
      () => {
        if (this.state.isAuthenticated) {
          this.props.navigate("/empTable");
        }
      }
    );
  }

  checkAuthentication = (): boolean => {
    const credential = localStorage.getItem("credential");
    const userInfo = localStorage.getItem("userInfo");

    return !!(credential && userInfo);
  };

  componentDidUpdate(prevProps: AuthRouteProps, prevState: AuthRouteState) {
    if (prevState.isAuthenticated !== this.state.isAuthenticated && this.state.isAuthenticated) {
      this.props.navigate("/empTable");
    }
  }

  componentWillUnmount() {
    window.removeEventListener("storage", this.handleStorageChange);
  }

  handleStorageChange = () => {
    const isAuthenticated = this.checkAuthentication();
    this.setState({ isAuthenticated });
  };

  render() {
    const { isAuthenticated } = this.state;
    const { children } = this.props;

    if (!isAuthenticated) {
      return children;
    }

    return null;
  }
}

export default withRouter(AuthRoute);
