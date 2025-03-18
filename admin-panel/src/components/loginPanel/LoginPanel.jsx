import React, { useState } from "react"
import "./loginPanel.css"
import { Link, useNavigate } from "react-router-dom"

const LoginPanel = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }
      const data = await response.json()
      setSuccess("Login successful!")

      // Przechowywanie tokena JWT w localStorage
      localStorage.setItem("token", data.accessToken)
      localStorage.setItem("userId", data.userId)
      console.log(data.roleId)
      // Tutaj możesz dodać obsługę przechowywania tokenu JWT, jeśli serwer go zwraca

      const transactionResponse = await fetch(
        `http://localhost:8080/api/transaction/ongoing/${data.userId}`,
        {
          method: "GET",
        }
      )

      if (!transactionResponse.ok) {
        throw new Error("Failed to fetch ongoing transaction")
      }

      const transactionData = await transactionResponse.json()
      localStorage.setItem("cartId", transactionData.id)
      console.log(data.roleId)
      if (data.roleId == 1 || data.roleId == 3) {
        navigate("/home")
      } else {
        navigate("/")
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="login">
      <div className="login-panel">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="login-panel__additions">
            {/* <p>Remember me</p>
            <p className='login-panel__password-reminder'>Forgot password?</p> */}
          </div>
          <button type="submit">Log in</button>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <p>
            Don't have an account?{" "}
            <span className=" login-panel__register-option bolder">
              <Link to="/register">Register</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPanel

// const token = localStorage.getItem('token');
// fetch('http://localhost:8080/api/some-endpoint', {
//   method: 'GET',
//   headers: {
//     'Authorization': `Bearer ${token}`
//   }
// });
