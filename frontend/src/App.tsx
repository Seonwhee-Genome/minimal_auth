import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Signin.tsx";
import SignUp from "./pages/Signup.tsx";
import Profile from "./pages/Profile.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
