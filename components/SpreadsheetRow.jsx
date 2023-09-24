import React, { useState, useEffect } from 'react';

export default function SpreadsheetRow({ rowData, onDeleteRow, onMoveRow }) {
  const [editableFields, setEditableFields] = useState({});
  const [content, setContent] = useState({ ...rowData });
  const [selectedRows, setSelectedRows] = useState([]);

  const handleFieldClick = (fieldName) => {
    if (!editableFields[fieldName]) {
      // Allow only one field to be editable at a time
      setEditableFields({ [fieldName]: true });
      // Store the original content when starting to edit
      setContent((prevContent) => ({ ...prevContent }));
    }
  };

  const handleFieldBlur = (fieldName) => {
    setEditableFields({ [fieldName]: false });
  };

  const handleContentChange = (fieldName, newValue, dataType) => {
    if (dataType === 'currency') {
      // Ensure newValue is numeric for currency field
      if (!isNaN(newValue)) {
        setContent((prevContent) => ({ ...prevContent, [fieldName]: newValue }));
      }
    } else if (dataType === 'date') {
      // Ensure newValue is a valid date format (you can customize this validation)
      if (/^\d{4}-\d{2}-\d{2}$/.test(newValue)) {
        setContent((prevContent) => ({ ...prevContent, [fieldName]: newValue }));
      }
    } else {
      setContent((prevContent) => ({ ...prevContent, [fieldName]: newValue }));
    }
  };

  const handleInputKeyDown = (fieldName, e, dataType) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      // Commit the change when Enter key or Tab key is pressed
      handleFieldBlur(fieldName);
    } else if (e.key === 'Escape') {
      // Revert to the original value when Escape key is pressed
      setContent((prevContent) => ({ ...prevContent }));
      handleFieldBlur(fieldName);
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const transactionStates = ['cleared', 'Completed', 'Canceled'];

  const toggleRowSelection = (rowId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(rowId)) {
        // If row is already selected, deselect it
        return prevSelectedRows.filter((id) => id !== rowId);
      } else {
        // If row is not selected, select it
        return [...prevSelectedRows, rowId];
      }
    });
  };

  const isRowSelected = (rowId) => {
    return selectedRows.includes(rowId);
  };

  const renderEditableCell = (fieldName, displayValue, dataType, rowId) => {
    return editableFields[fieldName] ? (
      <td onBlur={() => handleFieldBlur(fieldName)}>
        <input
          type={dataType === 'currency' || dataType === 'date' ? 'text' : 'text'}
          value={content[fieldName]}
          onChange={(e) =>
            handleContentChange(fieldName, e.target.value, dataType)
          }
          onKeyDown={(e) => handleInputKeyDown(fieldName, e, dataType)}
        />
      </td>
    ) : (
      <td
        onClick={() => {
          handleFieldClick(fieldName);
          toggleRowSelection(rowId);
        }}
        className={isRowSelected(rowId) ? 'selected' : ''}
      >
        {content[fieldName] || displayValue}
      </td>
    );
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={isRowSelected(rowData.id)}
          onChange={() => toggleRowSelection(rowData.id)}
        />{" "}
        {/* Checkbox for selection */}
      </td>
      {renderEditableCell('date', rowData.transactionDate, 'date', rowData.id)}
      {renderEditableCell('description', rowData.description, 'text', rowData.id)}
      {renderEditableCell('category', rowData.category, 'text', rowData.id)}
      {renderEditableCell(
        'amount',
        formatCurrency(rowData.amount),
        'currency',
        rowData.id
      )}
      {renderEditableCell('state', rowData.transactionState, 'text', rowData.id)}
      {renderEditableCell('type', rowData.trasactionType, 'text', rowData.id)}
      {renderEditableCell('reocur', rowData.reoccurringType, 'text', rowData.id)}
      {renderEditableCell('notes', rowData.notes, 'text', rowData.id)}
    </tr>
  );
}
