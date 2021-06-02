import './index.css'

export interface ModalProps {
  onSave: () => void,
  onCancel: () => void,
}

export const Modal: React.FC<ModalProps> = ({ onSave, onCancel, children }) => {
  const do_nothing = (evt: any) => {
    evt.stopPropagation()
    return false
  }

  return (
    <div className="modal-bg" onClick={onCancel}>
      <div className="modal" onClick={do_nothing}>
        <div className="closeButton" onClick={onCancel}>X</div>

        <div>
          {children}
        </div>

        <button onClick={() => onSave()}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}
