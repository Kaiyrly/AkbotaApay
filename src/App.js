import React, { useState } from 'react';
import './styles/App.css';

const columnLabels = ['№', 'Білім салалары және оқу пәндері', '1 сынып', '2 сынып', '3 сынып', '4 сынып', 'Аптасына', 'Жылына'];

const initialDataInvariant = [
  ['', 'Тіл және әдебиет', '6', '11', '11', '11', '39', '1398'],
  ['1', 'Әліппе, Ана тілі', '6', '0', '0', '0', '6', '210'],
  ['2', 'Қазақ тілі', '0', '4', '4', '4', '12', '432'],
  ['3', 'Әдебиеттік оқу', '0', '3', '3', '3', '9', '324'],
  ['4', 'Орыс тілі', '0', '2', '2', '2', '6', '216'],
  ['5', 'Шетел тілі', '0', '2', '2', '2', '6', '216'],
  ['', 'Математика және информатика', '4,5', '5', '6', '6', '21,5', '769,5'],
  ['6', 'Математика', '4', '4', '5', '5', '18', '644'],
  ['7', 'Цифрлық сауаттылық', '0,5', '1', '1', '1', '3,5', '125,5'],
  ['', 'Жаратылыстану', '1', '1', '2', '2', '6', '215'],
  ['8', 'Жаратылыстану', '1', '1', '2', '2', '6', '215'],
  ['', 'Адам және қоғам', '1', '1', '1', '1', '4', '143'],
  ['9', 'Дүниетану', '1', '1', '1', '1', '4', '143'],
  ['', 'Технология және өнер', '3', '2', '2', '2', '9', '321'],
  ['10', 'Музыка', '1', '1', '1', '1', '4', '143'],
  ['11', 'Көркем еңбек', '0', '1', '1', '1', '3', '108'],
  ['12', 'Еңбекке баулу', '1', '0', '0', '0', '1', '35'],
  ['13', 'Бейнелеу өнері', '1', '0', '0', '0', '1', '35'],
  ['', 'Дене шынықтыру', '3', '3', '3', '3', '12', '429'],
  ['14', 'Дене шынықтыру', '3', '3', '3', '3', '12', '429'],
  ['', 'Инварианттық оқу жүктемесі', '18,5', '23', '25', '25', '91,5', '3275,5'],  
];

const initialDataVariant = [
  ['', 'Белсенді-қозғалмалы сипаттағы жеке және топтық сабақтар', '1', '1', '1', '1', '4', '143'],
  ['', 'Математика және логика', '1', '1', '1', '1', '4', '72'],
  ['', 'Ең жоғарғы оқу жүктемесі', '19,5', '24', '26', '26', '95,5', '3418,5']
];

function Table({ data, isEditing, setIsEditing, handleSaveEdit, handleInputChange }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columnLabels.map((heading, index) => (
            <th key={index}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {row.map((cell, i) => (
              <td key={i}>
                {isEditing && index === isEditing.row && i < row.length - 2 ?
                  <input value={isEditing.values[i]} onChange={(e) => handleInputChange(e, i)} /> :
                  cell
                }
              </td>
            ))}
            {isEditing && index === isEditing.row ?
              <td><button onClick={() => handleSaveEdit(index)}>Save</button></td> :
              <td><button onClick={() => setIsEditing({ row: index, values: row.slice(0, row.length - 2) })}>Edit</button></td>
            }
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  const [dataInvariant, setDataInvariant] = useState(initialDataInvariant);
  const [dataVariant, setDataVariant] = useState(initialDataVariant);
  const [newRow, setNewRow] = useState(['', '', '', '', '', '', '', '']);
  const [isEditing, setIsEditing] = useState(null);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    setIsEditing(prev => {
      const newValues = [...prev.values];
      newValues[index] = value;
      return { ...prev, values: newValues };
    });
  };

  const handleSaveEdit = (index) => {
    const editedRow = [...isEditing.values];
    let totalForWeek = 0;
    for (let i = 2; i < 6; i++) {
      totalForWeek += isNaN(parseFloat(editedRow[i])) ? 0 : parseFloat(editedRow[i]);
    }
    const totalForYear = totalForWeek * 36;
    editedRow.push(totalForWeek.toString(), totalForYear.toString());

    setDataInvariant(prevData => {
      const newData = [...prevData];
      newData[index] = editedRow;
      recalculateLastRow(newData); // Recalculate the last row
      return newData;
    });
    setIsEditing(null);
  };

  const recalculateLastRow = (data) => {
    const lastRowIndex = data.length - 1;
    let columnTotals = Array(6).fill(0);

    for (let i = 1; i < lastRowIndex; i++) {
      for (let j = 2; j < 8; j++) {
        const cellValue = parseFloat(data[i][j]);
        if (!isNaN(cellValue)) {
          columnTotals[j - 2] += cellValue;
        }
      }
    }

    console.log(columnTotals)

    data[lastRowIndex] = ['', 'Инварианттық оқу жүктемесі', ...columnTotals];
  };

  const handleAddRow = (setData) => {
    // Calculate the total for the week
    let totalForWeek = 0;
    for (let i = 2; i < 6; i++) {
      totalForWeek += isNaN(parseFloat(newRow[i])) ? 0 : parseFloat(newRow[i]);
    }
    // Calculate the total for the year
    const totalForYear = totalForWeek * 36; // Assuming there are 36 weeks in a school year

    const rowToAdd = [...newRow.slice(0, 6), totalForWeek.toString(), totalForYear.toString()];

    // Insert the new row at the second to last position in the data array
    setData(prevData => {
      let newData = [...prevData.slice(0, prevData.length - 1), rowToAdd, prevData[prevData.length - 1]];

      recalculateLastRow(newData); // Recalculate the last row

      return newData;
    });

    setNewRow(['', '', '', '', '', '', '', '']);
  };

  return (
    <div className="App">
      <Table
        data={dataInvariant}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSaveEdit={handleSaveEdit}
        handleInputChange={handleInputChange}
      />

      <div>
        {newRow.slice(0, 6).map((cell, index) => (
          <input key={index} value={cell} onChange={e => handleInputChange(e, index)} />
        ))}
        <button onClick={() => handleAddRow(setDataInvariant)}>Add Row</button>
      </div>

      <Table
        data={dataVariant}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSaveEdit={handleSaveEdit}
        handleInputChange={handleInputChange}
      />
      <div>
        {newRow.slice(0, 6).map((cell, index) => (
          <input key={index} value={cell} onChange={e => handleInputChange(e, index)} />
        ))}
        <button onClick={() => handleAddRow(setDataVariant)}>Add Row</button>
      </div>
    </div>
  );
}

export default App;