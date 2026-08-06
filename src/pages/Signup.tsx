import { AuthCard } from '../components/security/AuthCard';
import { useState } from 'react';
import { SignupUser } from '../api/AuthService';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e: React.SyntheticEvent) =>
    {
        e.preventDefault();
        setErrorMessage('');

        if (password !== passwordConfirm) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const data = await SignupUser(username, password);
            localStorage.setItem('token', data.token)
            navigate('/home');
        }
        catch (error)
        {
            console.error("Signup Error: ", error);
            setErrorMessage('Signup failed. Please try again.');
        }
    }

    return (
        <AuthCard 
            title="Create your account"
            isSignup={true}
            username={username}
            password={password}
            passwordConfirm={passwordConfirm}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onPasswordConfirmChange={setPasswordConfirm}
            errorMessage={errorMessage}
            onSubmit={handleSignup}
        />
    );
}
