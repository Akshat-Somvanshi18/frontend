// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {


  const [jsonInputText, setJsonInputText] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [filtersSelected, setFiltersSelected] = useState([]);
  const [inputError, setInputError] = useState('');

  const handleJsonTextChange = (event) => {
    setJsonInputText(event.target.value);
  };

  const handleSubmitRequest = async () => {
    
    try {

      const parsedPayload = JSON.parse(jsonInputText);
      if (!parsedPayload.data) throw new Error('Invalid input.');
      const response = await axios.post('http://localhost:2000/bfhl', parsedPayload); // Update URL with your deployed backend URL
      setApiResponse(response.data);
      setInputError('');
    } catch (error) {
      setInputError('Invalid JSON input.');
    }
  };

  const handleFilterSelectionChange = (event) => {
    const { options } = event.target;
    const selectedItems = [];
    for (const option of options) {
      if (option.selected) {
        selectedItems.push(option.value);
      }
    }
    setFiltersSelected(selectedItems);
  };


  const displayFilteredResults = () => {
    if (!apiResponse) return null;
  
    const { numbers, alphabets, highest_lowercase_alphabet } = apiResponse;
    let filteredContent = "Filtered Content";
  
    // Initialize an array to hold formatted parts of the output
    const formattedParts = [];
  
    // Check selected filters and push formatted data
    if (filtersSelected.includes("Numbers") && numbers) {
      formattedParts.push(`Numbers: ${numbers.join(", ")}`);
    }
  
    if (filtersSelected.includes("Alphabets") && alphabets) {
      formattedParts.push(`Alphabets: ${alphabets.join(", ")}`);
    }
  
    if (
      filtersSelected.includes("Highest Lowercase Alphabet") &&
      highest_lowercase_alphabet
    ) {
      formattedParts.push(
        `Highest Lowercase Alphabet: ${highest_lowercase_alphabet}`
      );
    }
  
    // Combine the formatted parts into a single string
    if (formattedParts.length > 0) {
      filteredContent += `\n${formattedParts.join("\n")}`;
    } else {
      filteredContent = "No filter selected";
    }
  
    return (
      <div className="bg-success text-light p-3 border rounded">
        <pre>{filteredContent}</pre>
      </div>
    );
  };
  

  return (
    <div className="App container mt-5 w-50">
      <h1 className="mb-4 text-center">Akshat S Somvanshi (21BIT0004)</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={jsonInputText}
          onChange={handleJsonTextChange}
          placeholder="Enter JSON data here"
        />
      </div>
      <button className="btn btn-outline-success w-100 mb-3" onClick={handleSubmitRequest}>
        Submit Data
      </button>
      {inputError && <p className="text-danger">{inputError}</p>}

      {apiResponse && (
        <>
          <div className="mb-3">
  <select
    className="form-select"
    onChange={handleFilterSelectionChange}
  >
    <option value="">Select a filter</option>
    <option value="Numbers">Numbers</option>
    <option value="Alphabets">Alphabets</option>
    <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
  </select>
</div>
          {displayFilteredResults()}
        </>
      )}
    </div>
  );
}

export default App;
