import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/Account.css";

function Account() {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const response = await api.get("/api/users/me/");
      setUsername(response.data.username);
    } catch (error) {
      setError("Error fetching user data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const updateUsername = async (e) => {
    e.preventDefault();

    try {
      const response = await api.patch("/api/users/me/update/", { username: newUsername });
      setUsername(response.data.username);
      setEditUsername(false);
      setNewUsername("");
      setMessage("Username updated successfully!");
      setError("");
    } catch (error) {
      setError("Error updating username. It may already exist.");
      console.error(error);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    // if (newPassword.length < 8) {
    //   setError("Password must be at least 8 characters long.");
    //   return;
    // }

    const payload = {
      old_password: oldPassword,
      new_password: newPassword,
    }

    console.log(payload);

    try {
      await api.patch("/api/users/me/update/", { old_password: oldPassword, new_password: newPassword, });
      setMessage("Password updated successfully!");
      setEditPassword(false);
      setNewPassword("");
      setError("");
    } catch (error) {
      setError("Error updating password.");
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="account-container">
      <h2>Account Information</h2>
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Password:</strong> ********</p>

      {/* Edit Buttons */}
      {!editUsername && !editPassword && (
        <div>
          <button className="edit-btn" onClick={() => setEditUsername(true)}>Edit Username</button>
          <button className="edit-btn" onClick={() => setEditPassword(true)}>Edit Password</button>
        </div>
      )}

      {/* Edit Username Section */}
      {editUsername && (
        <div className="edit-section">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter new username"
          />
          <button className="primary-btn" onClick={updateUsername}>Update</button>
          <button className="secondary-btn" onClick={() => setEditUsername(false)}>Cancel</button>
        </div>
      )}

      {/* Edit Password Section */}
      {editPassword && (
        <div className="edit-section">
            <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
                />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <button className="primary-btn" onClick={updatePassword}>Update</button>
          <button className="secondary-btn" onClick={() => setEditPassword(false)}>Cancel</button>
        </div>
      )}

      {/* Success & Error Messages */}
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Account;
