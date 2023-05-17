import React from 'react';
import { styled } from '@mui/material/styles';
import TableRow from './TableRow';

const TableContainer = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
});

const TableHead = styled('thead')({
  backgroundColor: '#f5f5f5',
});

const TableBody = styled('tbody')({
  '& tr:nth-of-type".(even)': {
    backgroundColor: '#f9f9f9',
  },
});

const TableCell = styled('td')({
  padding: '8px',
  textAlign: 'center',
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

function Table({ data, columnLabels, handleInputChange, handleDeleteRow, handleDeleteColumn, isVariantTable }) {
  return (
    <TableContainer>
      <TableHead>
        <tr>
          {columnLabels.map((heading, index) => (
            <TableCell key={index}>
              {heading}
              {(index > 1 && index < columnLabels.length - 2) && (
                <DeleteButton onClick={() => handleDeleteColumn(index)}>Бағанды жою</DeleteButton>
              )}
            </TableCell>
          ))}
        </tr>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow
            key={index}
            row={row}
            handleInputChange={handleInputChange}
            handleDeleteRow={handleDeleteRow}
            rowIndex={index}
            isVariantTable={isVariantTable}
            isLastRow={index === data.length - 1}
          />
        ))}
      </TableBody>
    </TableContainer>
  );
}

export default Table;
