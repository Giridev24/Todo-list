import React, { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TrashFill, PencilSquare } from "react-bootstrap-icons";
import { baseUrl } from "./Urls";

const Home = () => {
  const [todo, setTodo] = useState("");
  const [datas, setDatas] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const [loading, setLoading] = useState(false); // New state for loading

  const todoNew = (e) => {
    setTodo(e.target.value);
  };

  useEffect(() => {
    fetchData(); 

   
    const hasShownToast = localStorage.getItem('hasShownToast');

    if (!hasShownToast) {
    
      const timer = setTimeout(() => {
        toast.success(
          <h3 className="custom-toast">
            Netlify's free deployment took <span className="text-warning">50 seconds</span> to wake up. Please wait and use the app. <sub>-GIRI</sub>
          </h3>,
          {
            position: "top-center",
            autoClose: 15000,
            className: "custom-toast-container", 
            bodyClassName: "custom-toast"
          }
        );

        // Mark that the toast has been shown
        localStorage.setItem('hasShownToast', 'true');
      }, 2000);

      return () => clearTimeout(timer); // Clean up timer on unmount
    }
  }, []);

  const fetchData = async () => {
    setLoading(true); // Set loading to true when starting to fetch data
    try {
      const response = await axios.get(`${baseUrl}/home`);
      setDatas(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is done
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (editItemId) {
        await axios.put(`${baseUrl}/home/${editItemId}`, { todo: todo });
        await toast(<h6 style={{ fontWeight: 'bold', color: 'rgb(29, 9, 78)' }}>Todo Updated successfully</h6>);
        setEditItemId(null);
      } else {
        await axios.post(`${baseUrl}/home`, { todo: todo });
        await toast(<h6 style={{ fontWeight: 'bold', color: 'rgb(29, 9, 78)' }}>Todo Added successfully</h6>);
      }
      fetchData();
      setTodo("");
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems({
      ...checkedItems,
      [id]: !checkedItems[id],
    });
  };

  const handleEdit = (id, currentTodo) => {
    setEditItemId(id);
    setTodo(currentTodo);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/home/${id}`);
      fetchData();
      await toast(<h6 style={{ fontWeight: 'bold', color: 'rgb(29, 9, 78)' }}>Todo Deleted successfully</h6>);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="container c">
      <div className="todo fadeInUp-animation">
        <form className="text-center" onSubmit={handleUpload}>
          <h1>To do list</h1>
          <input
            className="inp"
            type="text"
            value={todo}
            onChange={todoNew}
            placeholder="Enter your text here"
          />
          <button className="add" type="submit">
            {editItemId ? "Update" : "Add"}
          </button>
          <div
            className="content"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div>
              {loading ? ( // Conditionally render loading message
                <h4 className=" text-center text-warning mt-3" style={{ letterSpacing: '4px' }}>Loads in 50 sec...</h4>
              ) : datas.length === 0 ? (
                <div>
                  <h3 className="mt-5">No Records</h3>
                </div>
              ) : (
                datas.map((data) => (
                  <div className="data" key={data._id}>
                    <div className="row d-flex justify-content-around align-items-center">
                      <div className="col-1">
                        <input
                          className="box mt-2"
                          type="checkbox"
                          checked={checkedItems[data._id] || false}
                          onChange={() => handleCheckboxChange(data._id)}
                        />
                      </div>
                      <div className="col-8">
                        {editItemId === data._id ? (
                          <input
                            type="text"
                            value={todo}
                            onChange={todoNew}
                            className="edit-input"
                          />
                        ) : (
                          <h6
                            className={`pt-1 mt-1 list ${
                              checkedItems[data._id] ? "strikethrough" : ""
                            }`}
                          >
                            {data.todo}
                          </h6>
                        )}
                      </div>
                      <div
                        className="col-1"
                        onClick={() => handleEdit(data._id, data.todo)}
                      >
                        <PencilSquare className="edit" />
                      </div>
                      <div
                        className="col-1"
                        onClick={() => handleDelete(data._id)}
                      >
                        <TrashFill className="trash" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;
