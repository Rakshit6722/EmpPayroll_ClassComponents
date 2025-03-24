import React, { Component } from 'react'
import { NavigateFunction } from 'react-router-dom'
import { withRouter } from '../utils/withRouter'

type AuthRouteProps = {
    navigate: NavigateFunction,
    children: React.ReactNode
}

type AuthRouteState = {
    isAuthenticated: boolean
}

export class AuthRoute extends Component<AuthRouteProps, AuthRouteState> {
    constructor(props: AuthRouteProps) {
        super(props)
    
        this.state = {
            isAuthenticated: this.checkAuthentication()
        }
    }

    checkAuthentication = (): boolean => {

        const credential = localStorage.getItem('credential')
        const userInfo = localStorage.getItem('userInfo')
        

        return !!(credential && userInfo)
    }


    componentDidMount() {

        window.addEventListener('storage', this.handleStorageChange)
    }

    componentWillUnmount() {

        window.removeEventListener('storage', this.handleStorageChange)
    }

    handleStorageChange = () => {
        this.setState({
            isAuthenticated: this.checkAuthentication()
        })
    }

    render() {
        const { isAuthenticated } = this.state
        const { navigate, children } = this.props


        if (!isAuthenticated) {
            return children
        }

        navigate('/empTable')
        return null
    }
}

export default withRouter(AuthRoute)