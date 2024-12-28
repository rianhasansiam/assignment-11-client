import PropTypes from "prop-types";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../../Firebase/firbaseConfig";
import axios from "axios";

export const AuthContext = createContext(null);

// Social Auth Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const twitterProvider = new TwitterAuthProvider();

const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create user
  const createUser = (email, password, displayName, photoURL) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        // Update profile after user creation
        return updateProfile(auth.currentUser, {
          displayName,
          photoURL,
        });
      }
    );
  };

  // Update user profile
  const updateUserProfile = (name, image) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: image,
    });
  };

  // Sign in user
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // GitHub login
  const githubLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  // Twitter login
  const twitterLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, twitterProvider);
  };

  // Logout user
  const logout = () => {
    setLoading(true);
    signOut(auth);
    setUser(null); // Clear user state on logout
  };

  // Observer for authentication state changes
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the current user on state change
      setLoading(false);
      
      // If the user is authenticated, send the token to the server
      if (currentUser) {
        const loggedUser = { email: currentUser.email };
        // console.log(loggedUser)
        axios
          .post("https://assignment-11-server-umber-nine.vercel.app/jwt", loggedUser, {
            withCredentials: true,
          })
          .then((res) => {
            console.log("Token response", res.data);
          });
      } else {
        axios
          .post("https://assignment-11-server-umber-nine.vercel.app/logout", {}, { withCredentials: true })
          .then((res) => {
            console.log("Logged out", res.data);
          });
      }
    });

    // Clean up observer on component unmount
    return () => unSubscribe();
  }, []);

  // All values to be shared in the context
  const allValues = {
    createUser,
    signInUser,
    googleLogin,
    githubLogin,
    logout,
    user,
    updateUserProfile,
    twitterLogin,
    loading,
  };

  return (
    <AuthContext.Provider value={allValues}>{children}</AuthContext.Provider>
  );
};

FirebaseProvider.propTypes = {
  children: PropTypes.node,
};

export default FirebaseProvider;
