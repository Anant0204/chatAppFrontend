import { useState, useEffect, useContext } from "react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { initSocket, sendMessage, receiveMessage } from "../config/socket";
import { UserContext } from "../context/userContext";

const Project = () => {
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(location?.state?.project);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);
  const messageBox = React.createRef();

  //Ftech users when modal is open and socket
  useEffect(() => {
    if (!isModalOpen) {
      setUsers([]);
      return;
    }

    axios
      .get("/users/all-users")
      .then((res) => {
        setUsers(res.data.users || []);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]);
      });
  }, [isModalOpen]);

  // Initialize socket connection
  useEffect(() => {
    if (!project?._id) return;
    initSocket(project._id);

    receiveMessage("project-message", (data) => {
      appendIncomingMessage(data);
    });

    axios
      .get(`/projects/get-projects/${location?.state?.project?._id}`)
      .then((res) => {
        setProject(res.data.project);
      });
    return () => {
      window.socket?.off("project-message", handler);
    };
  }, [project?._id]);

  // Toggle user selection
  const handleUserClick = (_id) => {
    setSelectedUserId((prev) =>
      prev.includes(_id) ? prev.filter((uid) => uid !== _id) : [...prev, _id]
    );
  };
  useEffect(() => {
    console.log("Selected User IDs:", selectedUserId);
  }, [selectedUserId]);

  // Handle Add User button
  const handleAddUser = () => {
    const projectId = location?.state?.project?._id;
    if (selectedUserId.length === 0) return;
    // You can do something with selectedUserId here (e.g., send to backend)
    axios
      .put("/projects/add-user", {
        users: selectedUserId,
        projectId, // Assuming you have projectId in state
      })
      .then((res) => {
        console.log("Users added successfully:", res.data);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding users:", error);
      });
  };

  // Modal component
  const UserModal = () => (
    <div
      className={
        "fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-40 backdrop-blur-sm"
      }
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 flex flex-col relative max-h-96 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold ">Select User </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {users.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              {isModalOpen ? "Loading users..." : "No users found."}
            </div>
          ) : (
            users.map((user) => (
              <button
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className={`cursor-pointer hover:bg-slate-200 ${
                  selectedUserId.includes(user._id)
                    ? "bg-slate-200 border border-blue-500"
                    : ""
                } p-2 flex items-center gap-2 rounded`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                  <i className="ri-user-3-fill"></i>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs text-gray-500">
                    {user.email ? user.email : "No email"}
                  </span>
                </div>
                {selectedUserId.includes(user._id) && (
                  <i className="ri-checkbox-circle-fill text-blue-500 ml-auto"></i>
                )}
              </button>
            ))
          )}
        </div>
        <div className="flex justify-center">
          <button
            className="mt-4 w-fit flex items-center bg-blue-500 text-white py-2 px-4 rounded-full disabled:opacity-50"
            disabled={selectedUserId.length === 0}
            onClick={handleAddUser}
          >
            Add User
            {selectedUserId.length > 0 ? ` (${selectedUserId.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );

  function send() {
    sendMessage("project-message", {
      message,
      sender: user,
    });
    setMessage("");
    appendOutgoingMessage(message);
  }

  function appendIncomingMessage(messageObject) {
    const messageBox = document.querySelector(".message-box");
    const message = document.createElement("div");
    message.classList.add(
      "message",
      "max-w-56",
      "flex",
      "flex-col",
      "p-2",
      "bg-amber-50",
      "w-fit",
      "rounded-sm"
    );
    message.innerHTML = `
            <small class = 'opacity-65 text-xs'>${messageObject.sender.email}</small>
            <p class = 'text-sm'>${messageObject.message}</p>
    `;

    messageBox.appendChild(message);
  }

  function appendOutgoingMessage(message) {
    const messageBox = document.querySelector(".message-box");
    const newMessage = document.createElement("div");
    newMessage.classList.add(
      "message",
      "ml-auto",
      "max-w-56",
      "flex",
      "flex-col",
      "p-2",
      "w-fit",
      "bg-blue-300",
      "rounded-sm"
    );
    newMessage.innerHTML = `
            <small class = 'opacity-65 text-xs'>${user.email}</small>
            <p class = 'text-sm'>${message}</p>
    `;
    messageBox.appendChild(newMessage);
  }

  return (
    <main className="h-screen w-screen flex">
      {isModalOpen && <UserModal />}
      <section className="h-full relative left min-w-96 bg-slate-200 flex flex-col overflow-hidden">
        <header className="flex justify-between p-2 px-4 w-full bg-slate-50 top-0">
          <button
            onClick={() => {
              console.log("Button add collaborator clicked");
              setIsModalOpen(true);
            }}
            className="flex gap-2 items-center p-2 mr-3 bg-slate-300 rounded-full hover:bg-slate-400 transition-all duration-200 ease-in-out"
          >
            <i className="ri-user-add-fill"></i>
            <p>Add Collaborators</p>
          </button>
          <button
            className="p-2"
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
            <i className="ri-group-3-fill"></i>
          </button>
        </header>

        <div className="conversation-area flex-grow flex flex-col gap-2 p-3 relative">
          <div
            ref={messageBox}
            className="message-box flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-160px)] pr-1 hide-scrollbar"
          ></div>
          <div className="inputField w-90 flex absolute bottom-0 -ml-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 bg-slate-400 px-4 border-none flex-grow rounded-full"
              type="text"
              placeholder="Type your message here..."
            />
            <button
              onClick={send}
              className="px-4 bg-black ml-1 rounded-full text-white"
            >
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel flex flex-col gap-2 w-full h-full bg-slate-200 absolute transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header
            className="flex justify-between items-center p-3 px-4 w-full bg-slate-50 "
            onClick={() => setIsSidePanelOpen(false)}
          >
            <h1 className="font-semibold text-md">Collaborators</h1>
            <button>
              <i className="ri-close-circle-fill text-lg"></i>
            </button>
          </header>

          <div className="users flex flex-col gap-2 ">
            {project.users &&
              project.users.map((user) => {
                return (
                  <div
                    key={user._id}
                    className="user cursor-pointer hover:bg-slate-300 p-2 flex flex-row items-center"
                  >
                    <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-gray-500 ">
                      <i className="ri-user-3-fill absolute"></i>
                    </div>
                    <div className="ml-3 font-semibold text-lg">
                      {user.email}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Project;
