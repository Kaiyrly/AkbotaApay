import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import Table from '../components/Table';
import axios from 'axios';
import '../styles/DocumentPage.css';

const API_URL = 'https://table-change.herokuapp.com/documents';

const appStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
};

const buttonStyles = {
  margin: '10px',
};

function DocumentPage() {
  const { id } = useParams();

  const [dataInvariant, setDataInvariant] = useState([]);
  const [dataVariant, setDataVariant] = useState([]);
  const [columnLabels, setColumnLabels] = useState([]);
  const [newRowInvariant, setNewRowInvariant] = useState(['', '', '', '', '', '', '']);
  const [newRowVariant, setNewRowVariant] = useState(['', '', '', '', '', '', '']);
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [isVariantTable, setIsVariantTable] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        const { dataInvariant, dataVariant, columnLabels } = response.data;
        setDataInvariant(dataInvariant);
        setDataVariant(dataVariant);
        setColumnLabels(columnLabels);
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };
  
    if (dataInvariant.length === 0 && dataVariant.length === 0 && columnLabels.length === 0) {
      fetchDocument();
    } else if (dataInvariant.length > 0 && dataVariant.length > 0 && columnLabels.length > 0) {
      recalculateLastRow();
    }
  }, [id, dataInvariant.length, dataVariant.length, columnLabels.length]);
  


  const saveDocument = async () => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        dataInvariant,
        dataVariant,
        columnLabels
      });
      console.log('Document saved:', response.data);
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };


  const openAddRowModal = (variantTable) => {
    setIsAddRowModalOpen(true);
    setIsVariantTable(variantTable);
  };

  const closeAddRowModal = () => {
    setIsAddRowModalOpen(false);
    setNewRowInvariant(['', '', '', '', '', '', '']);
    setNewRowVariant(['', '', '', '', '', '', '']);
  };

  const openAddColumnModal = () => {
    setIsAddColumnModalOpen(true);
  };

  const closeAddColumnModal = () => {
    setIsAddColumnModalOpen(false);
    setNewColumnLabel('');
  };

  
  const handleInputChange = (e, rowIndex, cellIndex, isVariantTable) => {
    const { value } = e.target;

    if (isVariantTable) {
      setDataVariant(prevData => {
        const newData = [...prevData];
        newData[rowIndex][cellIndex] = value;

        if (rowIndex !== newData.length - 1) {
          let totalForWeek = 0;
          for (let i = 2; i < newData[rowIndex].length - 2; i++) {
            totalForWeek += isNaN(parseFloat(newData[rowIndex][i])) ? 0 : parseFloat(newData[rowIndex][i]);
          }
          const totalForYear = totalForWeek * 36;
          newData[rowIndex][newData[rowIndex].length - 2] = totalForWeek.toString();
          newData[rowIndex][newData[rowIndex].length - 1] = totalForYear.toString();
        }
        return newData;
      });
    } else {
      setDataInvariant(prevData => {
        const newData = [...prevData];
        newData[rowIndex][cellIndex] = value;
  
        if (rowIndex !== newData.length - 1) {
          let totalForWeek = 0;
          for (let i = 2; i < newData[rowIndex].length - 2; i++) {
            totalForWeek += isNaN(parseFloat(newData[rowIndex][i])) ? 0 : parseFloat(newData[rowIndex][i]);
          }
          const totalForYear = totalForWeek * 36;
          newData[rowIndex][newData[rowIndex].length - 2] = totalForWeek.toString();
          newData[rowIndex][newData[rowIndex].length - 1] = totalForYear.toString();
        }
        return newData;
      });
    }

    recalculateLastRow();
  };
  
  
  

  const handleAddInputChange = (e, index, isVariantTable) => {
    const { value } = e.target;
    if (isVariantTable) {
      setNewRowVariant(prevRow => {
        const newRowValues = [...prevRow];
        newRowValues[index] = value;
        return newRowValues;
      });
    } else {
      setNewRowInvariant(prevRow => {
        const newRowValues = [...prevRow];
        newRowValues[index] = value;
        return newRowValues;
      });
    }
  };
  
  

    const recalculateLastRow = () => {
        let invariantLast = []
        console.log(dataInvariant, dataVariant, columnLabels)
        setDataInvariant(prevData => {
            const newData = [...prevData];
            const lastRowIndex = newData.length - 1;
            console.log(columnLabels)
            let columnTotals = Array(columnLabels.length - 2).fill(0);
            for (let i = 0; i < lastRowIndex; i++) {
                for (let j = 1; j < columnLabels.length; j++) {
                    const cellValue = parseFloat(newData[i][j]);
                    if (!isNaN(cellValue)) {
                        columnTotals[j - 1] += cellValue;
                    }
                }
            }
        
            newData[lastRowIndex] = [...newData[lastRowIndex].slice(0, 2), ...columnTotals];
            invariantLast = newData[lastRowIndex]
            return newData;
        });

        setDataVariant(prevData => {
            const newData = [...prevData];
            const lastRowIndex = newData.length - 1;
        
            let columnTotals = invariantLast.slice(2, columnLabels.length);
            console.log(invariantLast.slice(2, columnLabels.length))
            for (let i = 0; i < lastRowIndex; i++) {
                for (let j = 1; j < columnLabels.length; j++) {
                    const cellValue = parseFloat(newData[i][j]);
                    if (!isNaN(cellValue)) {
                        columnTotals[j - 1] += cellValue;
                    }
                }
            }
            newData[lastRowIndex] = [...newData[lastRowIndex].slice(0, 2), ...columnTotals];
            
            return newData;
        });
        
       
    };
      
  
  
  
  

  const handleAddRow = (setData, isVariantTable) => {
    // Calculate the total for the week
    let totalForWeek = 0;
    const newRowValues = isVariantTable ? newRowVariant.slice(0, columnLabels.length - 3) : newRowInvariant.slice(0, columnLabels.length - 3);
    for (let i = 2; i < columnLabels.length - 2; i++) {
      totalForWeek += isNaN(parseFloat(newRowValues[i])) ? 0 : parseFloat(newRowValues[i]);
    }
    // Calculate the total for the year
    const totalForYear = totalForWeek * 36; // Assuming there are 36 weeks in a school year
    const rowToAdd = [...newRowValues, totalForWeek.toString(), totalForYear.toString()];
    console.log(rowToAdd)
    // Insert the new row at the second to last position in the data array
    setData(prevData => {
      let newData = [...prevData.slice(0, prevData.length - 1), rowToAdd, prevData[prevData.length - 1]];

      
      return newData;
    });
    recalculateLastRow();

    if (isVariantTable) {
      setNewRowVariant(['', '', '', '', '', '', '', '']);
    } else {
      setNewRowInvariant(['', '', '', '', '', '', '', '']);
    }
    closeAddRowModal();
  };

  const handleDeleteRow = (index, isVariantTable) => {
    if (isVariantTable) {
      setDataVariant(prevData => {
        const newData = [...prevData];
        newData.splice(index, 1);
        return newData;
      });
    } else {
      setDataInvariant(prevData => {
        const newData = [...prevData];
        newData.splice(index, 1);
        return newData;
      });
    }

    recalculateLastRow();
    
  };

  const handleAddColumn = (event) => {
    event.preventDefault();
    if (newColumnLabel.trim()) {
      setColumnLabels(prevLabels => [...prevLabels.slice(0, prevLabels.length - 2), newColumnLabel, 'Аптасына', 'Жылына']);

      // Add the new column to the data
      const addColumnToData = (data) => data.map(row => [...row.slice(0, row.length - 2), '0', row[row.length - 2], row[row.length - 1]]);
      setDataInvariant(addColumnToData(dataInvariant));
      setDataVariant(addColumnToData(dataVariant));

      // Update the new row inputs
      setNewRowInvariant(prevRow => [...prevRow.slice(0, prevRow.length - 2), '', prevRow[prevRow.length - 2], prevRow[prevRow.length - 1]]);
      setNewRowVariant(prevRow => [...prevRow.slice(0, prevRow.length - 2), '', prevRow[prevRow.length - 2], prevRow[prevRow.length - 1]]);

      closeAddColumnModal();
    }
  };

  const handleDeleteColumn = (columnIndex) => {
    setColumnLabels(prevLabels => prevLabels.filter((_, index) => index !== columnIndex));
    setDataInvariant(prevData => prevData.map(row => row.filter((_, index) => index !== columnIndex)));
    setDataVariant(prevData => prevData.map(row => row.filter((_, index) => index !== columnIndex)));
    setNewRowInvariant(prevRow => prevRow.filter((_, index) => index !== columnIndex));
    setNewRowVariant(prevRow => prevRow.filter((_, index) => index !== columnIndex));
  };

  return (
    <div className="App" style={appStyles}>
    <button className="button" onClick={saveDocument}>Сақтау</button>
    <button className="button" onClick={openAddColumnModal}>Жаңа сынып қосу</button>
      <h2>Инварианттық компонент</h2>

      {/* Add Column Modal */}
      <Modal
        isOpen={isAddColumnModalOpen}
        onRequestClose={closeAddColumnModal}
        contentLabel="Add Column Modal"
        className="modal"
      >
        <h2>Жаңа сынып қосу</h2>
        <form onSubmit={handleAddColumn}>
          <label className="form-label" htmlFor="new-column-label">Сынып аты:</label>
          <input
            className="form-input"
            type="text"
            id="new-column-label"
            value={newColumnLabel}
            onChange={(event) => setNewColumnLabel(event.target.value)}
          />
          <div className="form-button-container">
            <button className="form-button" type="submit">Қосу</button>
            <button className="form-button" type="button" onClick={closeAddColumnModal}>Тоқтату</button>
          </div>
        </form>
      </Modal>
      <Table
        data={dataInvariant}
        columnLabels={columnLabels}
        handleInputChange={handleInputChange}
        handleDeleteRow={handleDeleteRow}
        handleDeleteColumn={handleDeleteColumn}
        isVariantTable={false}
      />

      <button className="button" style={buttonStyles} onClick={() => {openAddRowModal(false)}}>Жаңа пән қосу</button>
      <Modal
        isOpen={isAddRowModalOpen}
        onRequestClose={closeAddRowModal}
        contentLabel="Add Row Modal"
        className="modal"
      >
        <h2>Жаңа пән қосу</h2>
        <form>
          {columnLabels.slice(1, columnLabels.length - 2).map((label, index) => (
            <div key={index}>
              <label className="form-label" htmlFor={`new-row-input-${index}`}>{label}:</label>
              <input
                className="form-input"
                type="text"
                id={`new-row-input-${index}`}
                value={isVariantTable ? newRowVariant[index] : newRowInvariant[index]}
                onChange={(event) => handleAddInputChange(event, index, isVariantTable)}
              />
            </div>
          ))}
          <div className="form-button-container">
            <button className="form-button" type="button" style={buttonStyles} onClick={() => handleAddRow(isVariantTable ? setDataVariant : setDataInvariant, isVariantTable)}>
              Қосу
            </button>
            <button className="form-button" type="button" style={buttonStyles} onClick={closeAddRowModal}>
              Тоқтату
            </button>
          </div>
        </form>
      </Modal>

      <h2>Вариативтік компонент</h2>
      <Table
        data={dataVariant}
        columnLabels={columnLabels}
        handleInputChange={handleInputChange}
        handleDeleteRow={handleDeleteRow}
        handleDeleteColumn={handleDeleteColumn}
        isVariantTable={true}
      />
      <button className="button" style={buttonStyles} onClick={() => {openAddRowModal(true)}}>Жаңа пән қосу</button>
    </div>
  );
  }
  
export default DocumentPage;
  