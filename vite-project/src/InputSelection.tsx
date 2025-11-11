import { useState } from 'react'
import './style/InputSelection.css'

function InputSelection({  addNote }: { addNote: (inputValue: string) => void }) {
  const [inputValue, setInputValue] = useState('')

  
  const handleAdd = () => {
    addNote(inputValue)
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (

    <div className="input-section">
        <input
        type="text"
        className="note-input"
        placeholder="Write a note..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        />
        <button 
        className="add-button"
        onClick={handleAdd}
        disabled={inputValue.trim() === ''}
        >
        Add Note
        </button>
    </div>
  )
}

export default InputSelection
