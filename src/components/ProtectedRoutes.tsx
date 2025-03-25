import React, { Component } from "react";
import { Navigate } from "react-router-dom";

type AuthRouteProps = {
  children: React.ReactNode;
};

type AuthRouteState = {
  isAuthenticated: boolean;
};

export class ProtectedRoutes extends Component<AuthRouteProps, AuthRouteState> {
  constructor(props: AuthRouteProps) {
    super(props);

    this.state = {
      isAuthenticated: this.checkAuthentication(), 
    };
  }

  componentDidMount() {
    window.addEventListener("storage", this.handleStorageChange);
  }

  componentWillUnmount() {
    window.removeEventListener("storage", this.handleStorageChange);
  }

  checkAuthentication = (): boolean => {
    const credential = localStorage.getItem("credential");
    const userInfo = localStorage.getItem("userInfo");

    return !!(credential && userInfo);
  };

  handleStorageChange = () => {
    const isAuthenticated = this.checkAuthentication();
    this.setState({ isAuthenticated });
  };

  render() {
    const { isAuthenticated } = this.state;
    const { children } = this.props;

    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return children;
  }
}

export default ProtectedRoutes;
