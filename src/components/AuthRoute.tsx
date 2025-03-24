// import React, { useState, useEffect } from 'react'
// import { NavigateFunction, useNavigate } from 'react-router-dom'

// type AuthRouteProps = {
//     children: React.ReactNode
// }

// export const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
//     const navigate = useNavigate()
//     const [isAuthenticated, setIsAuthenticated] = useState(checkAuthentication())

//     function checkAuthentication(): boolean {
//         const credential = localStorage.getItem('credential')
//         const userInfo = localStorage.getItem('userInfo')
        
//         return !!(credential && userInfo)
//     }

//     useEffect(() => {

//         if (checkAuthentication()) {
//             navigate('/empTable')
//             return
//         }

//         const handleStorageChange = () => {
//             const authenticated = checkAuthentication()
//             setIsAuthenticated(authenticated)

//             if (authenticated) {
//                 navigate('/empTable')
//             }
//         }

//         window.addEventListener('storage', handleStorageChange)

//         return () => {
//             window.removeEventListener('storage', handleStorageChange)
//         }
//     }, [navigate])

//     if (!isAuthenticated) {
//         return <>{children}</>
//     }

//     return null
// }

// export default AuthRoute

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
