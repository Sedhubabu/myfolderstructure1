import React, { useEffect, useState } from "react";
import explorer from "./explorer";
import fileIcon from './images/fileIcon.png';
import folderIcon from './images/folderIcon.jpg';
import './App.css';

const Folder = ({
  data,
  onSelect,
  selectedFolderId,
  setShowInput,
  setIsFolder,
  showInput,
  handleEdit,
  isEditing,
  setIsEditing,
  editedName,
  setEditedName,
  handleDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onSelect(data.id);
  };

  const handleEditClick = () => {
    setIsEditing(data.id);
    setEditedName(data.name);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && isEditing === data.id) {
      handleEdit(data.id, editedName);
      setIsEditing(null);
    }
  };

  return (
    <div
      style={{
        marginLeft: 20,
        backgroundColor: selectedFolderId === data.id ? "#DCDCDC" : "transparent",
        padding: "5px",
        borderRadius: "5px",
        width: "325px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {isEditing === data.id ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ flexGrow: 1 }}
          />
        ) : (
          <span
            style={{
              cursor: "pointer",
              fontWeight: data.isFolder ? "bold" : "normal",
              textDecoration: selectedFolderId === data.id ? "underline" : "none",
            }}
            onClick={handleToggle}
          >
            {data.isFolder ? (isExpanded ? "- " : "+ ") : ""}
            {data.name}
          </span>
        )}
        {selectedFolderId === data.id && !isEditing && (
          <div style={{ display: "flex", gap: "5px" }}>
            <button onClick={handleEditClick}>Edit</button>
            <button onClick={() => handleDelete(data.id)}>Delete</button>
          </div>
        )}
        {data.id === "1" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <img
              className="add-icon"
              src={fileIcon}
              alt="Add File"
              style={{ width: "20px" }}
              onClick={() => { setShowInput(true); setIsFolder(false); }}
            />
            <img
              className="add-icon"
              src={folderIcon}
              alt="Add Folder"
              style={{ width: "20px" }}
              onClick={() => { setShowInput(true); setIsFolder(true); }}
            />
          </div>
        )}
      </div>
      {isExpanded &&
      Array.isArray(data.items) &&
        data.items.map((item) => (
          <Folder
            key={item.id}
            data={item}
            onSelect={onSelect}
            selectedFolderId={selectedFolderId}
            setShowInput={setShowInput}
            setIsFolder={setIsFolder}
            showInput={showInput}
            handleEdit={handleEdit}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editedName={editedName}
            setEditedName={setEditedName}
            handleDelete={handleDelete}
          />
        ))}
    </div>
  );
};

const App = () => {
  const [explorerData, setExplorerData] = useState(explorer);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [isFolder, setIsFolder] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editedName, setEditedName] = useState("");

  const addNewItem = (folderId, name, isFolder) => {
    const addHelper = (node) => {
      if (node.id === folderId && node.isFolder) {
        node.items.push({
          id: Date.now().toString(),
          name,
          isFolder,
          items: isFolder ? [] : undefined,
        });
        return true;
      } else if (node.items) {
        for (let child of node.items) {
          if (addHelper(child)) {
            return true;
          }
        }
      }
      return false;
    };

    const updatedExplorer = { ...explorerData };
    addHelper(updatedExplorer);
    setExplorerData(updatedExplorer);
  };

  const handleCreate = (type) => {
    if (newItemName.trim() && selectedFolderId) {
      addNewItem(selectedFolderId, newItemName, type === "folder");
      setShowInput(false);
      setNewItemName("");
    }
  };

  const handleEdit = (id, newName) => {
    const editHelper = (node) => {
      if (node.id === id) {
        node.name = newName;
        return true;
      } else if (node.items) {
        for (let child of node.items) {
          if (editHelper(child)) {
            return true;
          }
        }
      }
      return false;
    };

    const updatedExplorer = { ...explorerData };
    editHelper(updatedExplorer);
    setExplorerData(updatedExplorer);
  };

  const handleDelete = (id) => {

    if (id === "1") {
      alert("The root folder cannot be deleted.");
      return;
    }
    
    const deleteHelper = (node) => {
      if (node.items) {
        const index = node.items.findIndex((child) => child.id === id);
        if (index !== -1) {
          node.items.splice(index, 1);
          return true;
        }
        for (let child of node.items) {
          if (deleteHelper(child)) {
            return true;
          }
        }
      }
      return false;
    };

    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      const updatedExplorer = { ...explorerData };
      deleteHelper(updatedExplorer);
      setExplorerData(updatedExplorer);
      setSelectedFolderId(null);
    }
  };

  const handleCancel = () => {
    setShowInput(false);
    setNewItemName("");
  };

  return (
    <div style={{ width: "fit-content" }}>
      <h1>Folder Structure</h1>
      {showInput && (
        <div style={{ margin: "10px 0" }}>
          <input
            type="text"
            placeholder={isFolder ? "Enter Folder Name" : "Enter File Name"}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <button onClick={() => handleCreate(isFolder ? "folder" : "file")}>
            {isFolder ? "Create Folder" : "Create File"}
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
      <Folder
        data={explorerData}
        onSelect={setSelectedFolderId}
        selectedFolderId={selectedFolderId}
        setShowInput={setShowInput}
        setIsFolder={setIsFolder}
        showInput={showInput}
        handleEdit={handleEdit}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editedName={editedName}
        setEditedName={setEditedName}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
