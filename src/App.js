import React, { useState } from 'react';
import Modal from 'react-modal';
import Table from './components/Table';
import './styles/App.css';

const appStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
};

const buttonStyles = {
  margin: '10px',
};


const initialDataInvariant = [
  ['1', 'Әліппе, Ана тілі', '6', '0', '0', '0', '6', '210'],
  ['2', 'Қазақ тілі', '0', '4', '4', '4', '12', '432'],
  ['3', 'Әдебиеттік оқу', '0', '3', '3', '3', '9', '324'],
  ['4', 'Орыс тілі', '0', '2', '2', '2', '6', '216'],
  ['5', 'Шетел тілі', '0', '2', '2', '2', '6', '216'],
  ['6', 'Математика', '4', '4', '5', '5', '18', '644'],
  ['7', 'Цифрлық сауаттылық', '0,5', '1', '1', '1', '3,5', '125,5'],
  ['8', 'Жаратылыстану', '1', '1', '2', '2', '6', '215'],
  ['9', 'Дүниетану', '1', '1', '1', '1', '4', '143'],
  ['10', 'Музыка', '1', '1', '1', '1', '4', '143'],
  ['11', 'Көркем еңбек', '0', '1', '1', '1', '3', '108'],
  ['12', 'Еңбекке баулу', '1', '0', '0', '0', '1', '35'],
  ['13', 'Бейнелеу өнері', '1', '0', '0', '0', '1', '35'],
  ['14', 'Дене шынықтыру', '3', '3', '3', '3', '12', '429'],
  ['', 'Инварианттық оқу жүктемесі', '18,5', '23', '25', '25', '91,5', '3275,5'],  
];

const initialDataVariant = [
  ['1', 'Белсенді-қозғалмалы сипаттағы жеке және топтық сабақтар', '1', '1', '1', '1', '4', '143'],
  ['2', 'Математика және логика', '1', '1', '1', '1', '4', '72'],
  ['', 'Ең жоғарғы оқу жүктемесі', '19,5', '24', '26', '26', '95,5', '3418,5']
];


function App() {
  const [dataInvariant, setDataInvariant] = useState(initialDataInvariant);
  const [dataVariant, setDataVariant] = useState(initialDataVariant);
  const [newRowInvariant, setNewRowInvariant] = useState(['', '', '', '', '', '', '', '']);
  const [newRowVariant, setNewRowVariant] = useState(['', '', '', '', '', '', '', '']);
  const [columnLabels, setColumnLabels] = useState(['№', 'Білім салалары және оқу пәндері', '1 сынып', '2 сынып', '3 сынып', '4 сынып', 'Аптасына', 'Жылына']);
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [isVariantTable, setIsVariantTable] = useState(false);

  const openAddRowModal = (variantTable) => {
    setIsAddRowModalOpen(true);
    setIsVariantTable(variantTable);
  };

  const closeAddRowModal = () => {
    setIsAddRowModalOpen(false);
    setNewRowInvariant(['', '', '', '', '', '', '', '']);
    setNewRowVariant(['', '', '', '', '', '', '', '']);
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

        recalculateLastRow(newData, true);
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
  
        recalculateLastRow(newData, false);
        return newData;
      });
    }
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
  
  

  const recalculateLastRow = (data, isVariant) => {
    const lastRowIndex = data.length - 1;
    let columnTotals = Array(columnLabels.length - 2).fill(0);
  
    for (let i = 0; i < lastRowIndex; i++) {
      for (let j = 2; j < columnLabels.length; j++) {
        const cellValue = parseFloat(data[i][j]);
        if (!isNaN(cellValue)) {
          columnTotals[j - 2] += cellValue;
        }
      }
    }
  
    if (isVariant) {
      const invariantLastRow = dataInvariant[dataInvariant.length - 1];
      for (let j = 2; j < columnLabels.length - 2; j++) {
        const cellValue = parseFloat(invariantLastRow[j]);
        if (!isNaN(cellValue)) {
          columnTotals[j - 2] += cellValue;
        }
      }
    }
  
    const newLabel = isVariant ? 'Ең жоғарғы оқу жүктемесі' : 'Инварианттық оқу жүктемесі';
    data[lastRowIndex] = ['', newLabel, ...columnTotals];
  };
  
  

  const handleAddRow = (setData, isVariantTable) => {
    console.log(isVariantTable)
    // Calculate the total for the week
    let totalForWeek = 0;
    const newRowValues = isVariantTable ? newRowVariant.slice(0, columnLabels.length - 2) : newRowInvariant.slice(0, columnLabels.length - 2);
    for (let i = 2; i < columnLabels.length - 2; i++) {
      totalForWeek += isNaN(parseFloat(newRowValues[i])) ? 0 : parseFloat(newRowValues[i]);
    }
    // Calculate the total for the year
    const totalForYear = totalForWeek * 36; // Assuming there are 36 weeks in a school year
    const rowToAdd = [...newRowValues, totalForWeek.toString(), totalForYear.toString()];

    // Insert the new row at the second to last position in the data array
    setData(prevData => {
      let newData = [...prevData.slice(0, prevData.length - 1), rowToAdd, prevData[prevData.length - 1]];

      recalculateLastRow(newData); // Recalculate the last row

      return newData;
    });

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
        recalculateLastRow(newData, true); // Recalculate the last row
        return newData;
      });
    } else {
      setDataInvariant(prevData => {
        const newData = [...prevData];
        newData.splice(index, 1);
        recalculateLastRow(newData, false); // Recalculate the last row
        return newData;
      });
    }
    
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
          {columnLabels.slice(0, columnLabels.length - 2).map((label, index) => (
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
  
export default App;
  