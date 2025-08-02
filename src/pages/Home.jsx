import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
// import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [project, setproject] = useState([]);
  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    console.log("Creating project with name:", projectName);

    axios
      .post("/projects/create", { name: projectName })
      .then((res) => {
        console.log("Project created successfully:", res);
        setIsModalOpen(false);
        setProjectName(""); // Reset project name after creation
      })
      .catch((error) => {
        console.log("Error creating project:", error);
      });
  }

  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => {
        setproject(res.data.projects);
      })
      .catch((error) => {
        console.log("Error fetching projects:", error);
      });
  }, []);

  return (
    <main className="p-4">
      <div className="projects flex flex-wrap gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="project p-4 border-blue-300 border-2 rounded-md flex items-center hover:bg-blue-400 transition-all duration-500 ease-in-out"
        >
          <p>New Project</p>
          <i className="ri-links-line pl-3"></i>
        </button>

        {project.map((proj) => (
          <div
            onClick={() => navigate(`/project`, { state: { project: proj } })}
            key={proj._id}
            className="project-item flex flex-col gap-2 cursor-pointer p-4 min-w-32 rounded-md border-2 border-green-300 hover:bg-green-400 transition-all duration-500 ease-in-out"
          >
            <h3 className="font-semibold ">Project Name : {proj.name}</h3>
            <div className="flex gap-2 font-semibold">
              <small>
                Collaborators : <i className="ri-user-line"></i>
              </small>
              {proj.users.length}
            </div>
          </div>
        ))}
      </div>

      <div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
              <form onSubmit={createProject}>
                <label className="block mb-2 text-gray-700">Project Name</label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
