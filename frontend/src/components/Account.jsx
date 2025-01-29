import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/Account.css";

function Account() {
    const [username, setUsername] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [editUsername, setEditUsername] = useState(false);
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

    const updateUsername = (e) => {
        e.preventDefault();
    
        api
          .patch("/api/users/me/update/", { username: newUsername })
          .then((res) => {
            setUsername(res.data.username);
            setEditUsername(false);
            setNewUsername("");
            setMessage("Username updated successfully!");
          })
          .catch((error) => {
            setError("Error updating username. It may already exist.");
            console.error(error);
          });
      };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="account-container">
            <h2>Account Information</h2>
            <p><strong>Username:</strong> {username}</p>

            {/* Toggle Edit Mode */}
            {!editUsername ? (
                <button onClick={() => setEditUsername(true)}>Edit Username</button>
            ) : (
                <div className="edit-username">
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter new username"
                    />
                    <button onClick={updateUsername}>Update</button>
                    <button onClick={() => setEditUsername(false)}>Cancel</button>
                </div>
            )}

            {message && <p className="success">{message}</p>}
        </div>
    );
}

export default Account;
