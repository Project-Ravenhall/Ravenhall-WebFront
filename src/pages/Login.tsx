import { AuthCard } from '../components/security/AuthCard';
import { useState } from 'react';
import { LoginUser } from '../api/AuthService';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.SyntheticEvent) =>
  {
    try {
      e.preventDefault();
      const data = await LoginUser(username, password);
      localStorage.setItem("token", data.token)
      navigate('/home');
    }
    catch (error)
    {
      console.error("Login Error: ", error)
      setErrorMessage("Invalid username or password");
    }
  }

  return (
        <AuthCard 
            title="Welcome back"
            isSignup={false}
            username={username}
            password={password}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            errorMessage={errorMessage}
            onSubmit={handleLogin}
        />
    );
}