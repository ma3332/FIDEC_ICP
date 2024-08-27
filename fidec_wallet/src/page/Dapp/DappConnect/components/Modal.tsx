import ModalStore from '../../../../store/ModalStore'
import SessionProposalModal from '../views/SessionProposalModal'
import SessionSendTransactionModal from '../views/SessionSendTransactionModal'
import SessionSignTransactionModal from '../views/SessionSignTransactionModal'
import SessionRequestModal from '../views/SessionSignModal' 
import {  Modal as AntdModal } from 'antd';
import { useSnapshot } from 'valtio'; 
import SessionUnsuportedMethodModal from '../views/SessionUnsuportedMethodModal.tsx'

export default function Modal() {
  const { open, view } = useSnapshot(ModalStore.state);

  return (
    <AntdModal open={open} footer = {null} closable={false} style={{ border: '1px solid rgba(139, 139, 139, 0.4)' }}>
      {view === 'SessionProposalModal' && open && <SessionProposalModal />}
      {view === 'SessionSignModal' && open && <SessionRequestModal />} 
      {view === 'SessionSendTransactionModal' && open && <SessionSendTransactionModal />} 
      {view === 'SessionSignTransactionModal' && open && <SessionSignTransactionModal />} 
      {view === 'SessionUnsuportedMethodModal' && open && <SessionUnsuportedMethodModal />} 
    </AntdModal>
  )
}