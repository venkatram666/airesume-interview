import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] =
    useState("");

  const [resume, setResume] =
    useState({
      name: "",
      skills: "",
      education: "",
    });

  useEffect(() => {
    const fetchProfile =
      async () => {
        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          navigate("/");
          return;
        }

        try {
          const res =
            await API.get(
              "/auth/profile",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setUser(
            res.data.userId
          );
        } catch {
          localStorage.removeItem(
            "token"
          );

          navigate("/");
        }
      };

    fetchProfile();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    navigate("/");
  };

  return (
    <div className="container">
      <h1>
        AI Resume &
        Interview Portal
      </h1>

      <p>
        Logged In User ID:
        {user}
      </p>

      <h2>
        Resume Builder
      </h2>

      <input
        placeholder="Full Name"
        onChange={(e) =>
          setResume({
            ...resume,
            name:
              e.target.value,
          })
        }
      />

      <input
        placeholder="Skills"
        onChange={(e) =>
          setResume({
            ...resume,
            skills:
              e.target.value,
          })
        }
      />

      <input
        placeholder="Education"
        onChange={(e) =>
          setResume({
            ...resume,
            education:
              e.target.value,
          })
        }
      />

      <div className="resume-preview">
        <h3>
          Resume Preview
        </h3>

        <p>
          Name:
          {resume.name}
        </p>

        <p>
          Skills:
          {resume.skills}
        </p>

        <p>
          Education:
          {resume.education}
        </p>
      </div>

      <div className="interview-card">
        <h3>
          Upcoming Interview
        </h3>

        <p>
          Company: TCS
        </p>

        <p>
          Date:
          25-06-2026
        </p>

        <p>
          Time:
          10:00 AM
        </p>
      </div>

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;