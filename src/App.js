import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import DocumentPage from './pages/DocumentPage';
import './styles/App.css';

const API_URL = 'https://table-change.herokuapp.com/documents';

const initialDataInvariant = [
  ['Әліппе, Ана тілі', '6', '0', '0', '0', '6', '210'],
  ['Қазақ тілі', '0', '4', '4', '4', '12', '432'],
  ['Әдебиеттік оқу', '0', '3', '3', '3', '9', '324'],
  ['Орыс тілі', '0', '2', '2', '2', '6', '216'],
  ['Шетел тілі', '0', '2', '2', '2', '6', '216'],
  ['Математика', '4', '4', '5', '5', '18', '644'],
  ['Цифрлық сауаттылық', '0,5', '1', '1', '1', '3,5', '125,5'],
  ['Жаратылыстану', '1', '1', '2', '2', '6', '215'],
  ['Дүниетану', '1', '1', '1', '1', '4', '143'],
  ['Музыка', '1', '1', '1', '1', '4', '143'],
  ['Көркем еңбек', '0', '1', '1', '1', '3', '108'],
  ['Еңбекке баулу', '1', '0', '0', '0', '1', '35'],
  ['Бейнелеу өнері', '1', '0', '0', '0', '1', '35'],
  ['Дене шынықтыру', '3', '3', '3', '3', '12', '429'],
  ['', 'Инварианттық оқу жүктемесі', '18,5', '23', '25', '25', '91,5', '3275,5'],
];

const initialDataVariant = [
  ['Белсенді-қозғалмалы сипаттағы жеке және топтық сабақтар', '1', '1', '1', '1', '4', '143'],
  ['Математика және логика', '1', '1', '1', '1', '4', '72'],
  ['', 'Ең жоғарғы оқу жүктемесі', '19,5', '24', '26', '26', '95,5', '3418,5'],
];

const columnLabels = ['№', 'Білім салалары және оқу пәндері', '1 сынып', '2 сынып', '3 сынып', '4 сынып', 'Аптасына', 'Жылына'];

function App() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(API_URL);
      const documentIds = response.data.map((document) => {
        return { id: document._id, title: document.title };
      });
      setDocuments(documentIds);
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Handle error condition
    }
  };


  const deleteDocument = async (documentId) => {
    try {
      await axios.delete(`${API_URL}/${documentId}`);
      setDocuments((prevDocuments) =>
        prevDocuments.filter((document) => document.id !== documentId)
      );
    } catch (error) {
      console.log('Error deleting document:', error);
    }
  };

  const createNewDocument = async (e) => {
    e.preventDefault();
    try {
      const newDocument = {
        dataInvariant: initialDataInvariant,
        dataVariant: initialDataVariant,
        columnLabels: columnLabels,
        title: title,
      };
      const response = await axios.post(API_URL, newDocument);
      setDocuments((prevDocuments) => [
        ...prevDocuments,
        { id: response.data._id, title: response.data.title },
      ]);
      setTitle('');
    } catch (error) {
      console.error('Error creating new document:', error);
      // Handle error condition
    }
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <div className="container">
                <form className="form" onSubmit={createNewDocument}>
                  <div className="form-input-container">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Кестенің аты"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <button type="submit" className="button">
                      Жаңа кесте қосу
                    </button>
                  </div>
                </form>
                <ul className="document-list">
                  {documents.map((document) => (
                    <li key={document.id} className="document-item">
                      <div className="document-info">
                        <Link
                          to={`/document/${document.id}`}
                          className="document-title"
                        >
                          {document.title}
                        </Link>
                      </div>
                      <button
                        className="delete-button"
                        onClick={() => deleteDocument(document.id)}
                      >
                        Жою
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
          <Route path="/document/:id" element={<DocumentPage />} />
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;