import Modal from "../../utility/Modal";
import useReadyTimer from "../../../hooks/useReadyTimer";

function InstructionalPrompt({ children, ...props }) {
  const {isReady} = useReadyTimer(500)

  return (
    <Modal isOpen={isReady}>
      {children}
    </Modal>
  )
}

InstructionalPrompt.propTypes = {

}

export default InstructionalPrompt
