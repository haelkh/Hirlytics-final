// import React, { useState } from "react";
// import SignIn from "../SignIn/SignIn";
// import SignUp from "../SignUp/SignUp";
// import "./AuthContainer.css";

// const AuthContainer = ({ setView }: { setView: (view: string) => void }) => {
//   const [isSignIn, setIsSignIn] = useState(true);

//   return (
//     <div className="auth-container">
//       {isSignIn ? (
//         <SignIn toggleAuth={() => setIsSignIn(false)} setView={setView} />
//       ) : (
//         <SignUp toggleAuth={() => setIsSignIn(true)} setView={setView} />
//       )}
//     </div>
//   );
// };

// export default AuthContainer;