import React, { use } from 'react';


import { Navigate } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import Loading from './Loading';

const PrivateRoute = ({children}) => {

    const {user , loading} = use(AuthContext);


    if(loading)
    {
       return <Loading></Loading>
    }
   if(user && user?.email )
   {
    return children;
   }
   else{
    return <Navigate state={location.pathname} to='/login'></Navigate>
   }
   
};

export default PrivateRoute;