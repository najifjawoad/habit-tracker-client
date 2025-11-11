import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
 import { auth } from '../firebase/firebase.init';

import { GoogleAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {

    const [user , setUser] = useState(null);
    const [loading , setLoading]= useState(true);

    const logOut = ()=>
    {   setLoading(true);
        return signOut(auth);
    }

    const signInWithGoogle = () =>
    {   
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const createUser = (email, password)=>
    {  setLoading(true);
       return createUserWithEmailAndPassword(auth, email ,  password);
    }
    

    const signInUser = (email, password) =>
    {   setLoading(true);
        return signInWithEmailAndPassword(auth , email , password)
    }
    const upadteTheUser = (updatedData)=>
  {
     return updateProfile(auth.currentUser , updatedData);
  }
    const authInfo = {
        createUser,
        user,
        setUser,
        loading,
        signInUser,
        signInWithGoogle,
        logOut,
        upadteTheUser,

    }

    useEffect(()=>{
        const unsubscribe =  onAuthStateChanged (auth,(currentUser)=>
        {
              setUser(currentUser);
              setLoading(false)
        })

        return () => {
            unsubscribe();
        }
    },[] )
    
    return (
        <div>
            <AuthContext value={authInfo}>
                {children}

            </AuthContext>
            
        </div>
    );
};

export default AuthProvider;