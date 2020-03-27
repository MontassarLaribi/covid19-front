import React, {Component} from 'react';
import {FuseUtils} from '@fuse';
import {matchRoutes} from 'react-router-config';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import AppContext from 'app/AppContext';

const parseJwt =(token) =>{
    if(!token)return []
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
class FuseAuthorization extends Component {

    constructor(props, context)
    {
        super(props);
        const {routes} = context;
        this.state = {
            accessGranted: true,
            routes
        };
    }

    componentDidMount()
    {
        if ( !this.state.accessGranted )
        {
            this.redirectRoute();
        }
    }

    componentDidUpdate()
    {
        if ( !this.state.accessGranted )
        {
            this.redirectRoute();
        }
    }

    static getDerivedStateFromProps(props, state)
    {
        const {location, /* userRole */} = props;
        const {pathname} = location;
        const user=parseJwt(window.localStorage.getItem('jwt_access_token'))
        const userRole=user.roles

        const matched = matchRoutes(state.routes, pathname)[0];

        return {
            accessGranted: matched ? FuseUtils.hasPermission(matched.route.auth, userRole) : true
        }
    }

    shouldComponentUpdate(nextProps, nextState)
    {
        return nextState.accessGranted !== this.state.accessGranted;
    }

    redirectRoute()
    {
        const {location, userRole, history} = this.props;
        const {pathname, state} = location;
        const redirectUrl = state && state.redirectUrl ? state.redirectUrl : '/';

        /*
        User is guest
        Redirect to Login Page
        */
        if ( !userRole || userRole.length === 0 )
        {
            history.push({
                pathname: '/login',
                state   : {redirectUrl: pathname}
            });
        }
        /*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or redirectUrl
        */
        else
        {
            history.push({
                pathname: redirectUrl
            });
        }
    }

    render()
    {
        // console.info('Fuse Authorization rendered', accessGranted);
        return this.state.accessGranted ? <React.Fragment>{this.props.children}</React.Fragment> : null;
    }
}

function mapStateToProps({auth})
{
    console.log('auth mapStateToProps', auth)
    return {
        userRole: auth.user.role
    }
}

FuseAuthorization.contextType = AppContext;

export default withRouter(connect(mapStateToProps)(FuseAuthorization));
