import React, { useState, useEffect } from "react";

function App() {
  // Assuming your data is in the following format
  const initialData = [
    {
      name: "Тіл және әдебиет",
      values: [6, 11, 11, 11, 39, 1398]
    },
    {
      name: "Әліппе, Ана тілі",
      values: [6, null, null, null, 6, 210]
    },
    //... add the rest of your data here
  ];

  const [data, setData] = useState(initialData);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let newTotal = 0;
    data.forEach(item => {
      newTotal += item.values[4]; // assuming the sum of 4th column
    });
    setTotal(newTotal);
  }, [data]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Білім салалары және оқу пәндері</th>
            <th>Сыныптар бойынша апталық сағат саны</th>
            <th>Жалпы жүктеме, сағат</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.name}</td>
              {row.values.map((value, j) => (
                <td key={j}>{value}</td>
              ))}
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td></td>
            <td>{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
