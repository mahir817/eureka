import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    profession: '',
    graduation_year: '',
    institute: '',
    stream: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password, name, profession, graduation_year, institute, stream } = formData;
    const formDataObj = new FormData();
    formDataObj.append('username', username);
    formDataObj.append('password', password);
    formDataObj.append('name', name);
    formDataObj.append('profession', profession);
    formDataObj.append('graduation_year', graduation_year);
    formDataObj.append('institute', institute);
    formDataObj.append('stream', stream);

    const requiredFields = ['username', 'password', 'name', 'profession', 'graduation_year', 'institute', 'stream'];
    const isFormValid = requiredFields.every(field => formData[field].trim() !== '');

    if (!isFormValid) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate('/login', { replace: true });
      } else if (response.status === 500) {
        const data = await response.json();
        if (data.error === 'Username already exists') {
          setErrorMsg('Username already exists. Please choose a different username.');
        } else {
          setErrorMsg('An error occurred. Please try again later.');
        }
      } else {
      }
    } catch (error) {
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Signup Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" required="" value={formData.username} onChange={handleChange} />
        </label>
        <br />
        <label>
          Name:
          <input type="text" name="name" required="" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Profession:
          <input type="text" name="profession" required="" value={formData.profession} onChange={handleChange} />
        </label>
        <br />
        <label>
          Institute:
          <input type="text" name="institute" required="" value={formData.institute} onChange={handleChange} placeholder="Enter your institute name" />
        </label>
        <br />
        <label>
          Stream:
          <select name="stream" value={formData.stream} required="" onChange={handleChange}>
            <option value="">--Select Stream--</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics and Communication">Electronics and Communication</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Electrical">Electrical</option>
            <option value="Civil">Civil</option>
            <option value="others">Others</option>
          </select>
        </label>
        <br />
        <label>
          Graduation Year:
          <input type="text" name="graduation_year" required="" value={formData.graduation_year} onChange={handleChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" required="" value={formData.password} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
        {errorMsg && <p>{errorMsg}</p>}
        <br />
        <Link to="/login"> Already have an account? Login now!</Link>
      </form>
    </div>
  );
};

export default SignupForm;










