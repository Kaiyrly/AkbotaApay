import React from 'react';
import { styled } from '@mui/material/styles';

const TableRowContainer = styled('tr')({
  '&:nh-of-type".(even)': {
    backgroundColor: '#f9f9f9',
  },
});

const TableCell = styled('td')({
  padding: '8px',
  textAlign: 'center',
  fontSize: '14px', // Add the desired font size
});

const DeleteButton = styled('button')({
  border: 'none',
  background: 'none',
  color: 'green',
  cursor: 'pointer',
  fontWeight: 'bold',
  textDecoration: 'underline',
  '&:hover': {
    color: 'darkred',
  },
});

const EditableInput = styled('input')({
  border: 'none',
  background: 'transparent',
  width: '100%',
  outline: 'none',
  fontSize: 'inherit', // Inherit the font size from the parent element
  textAlign: 'center', // Align the content to the center
});

function TableRow({ row, handleInputChange, handleDeleteRow, rowIndex, isVariantTable, isLastRow }) {
    return (
      <TableRowContainer>
        {!isLastRow && <TableCell>{rowIndex + 1}</TableCell>}
        {row.map((cell, cellIndex) => {
          const isEditable = cellIndex > 0 && cellIndex < row.length - 2 && !isLastRow;
          return (
            <TableCell key={cellIndex}>
              {isEditable ? (
                <EditableInput
                  value={cell}
                  onChange={(e) => handleInputChange(e, rowIndex, cellIndex, isVariantTable)}
                />
              ) : (
                cell
              )}
            </TableCell>
          );
        })}
        <TableCell>
          <DeleteButton onClick={() => handleDeleteRow(rowIndex, isVariantTable)}>Пәнді жою</DeleteButton>
        </TableCell>
      </TableRowContainer>
    );
  }
  
export default TableRow;
  

