import { useLanguage } from '@/context/languageContext';
import React from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import './MadietConfirmModal.scss';

interface MadietConfirmModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

const MadietConfirmModal: React.FC<MadietConfirmModalProps> = ({
    show,
    onHide,
    onConfirm,
    isLoading
}) => {
    const { getValue } = useLanguage();

    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop={true}
            keyboard={!isLoading}
            centered={true}
            className="madiet-confirm-modal"
        >
            <Modal.Header closeButton={!isLoading}>
                <Modal.Title>{getValue('sync_confirmation_title')}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="confirmation-message">
                    {getValue('sync_confirmation_message')}
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={onHide}
                    disabled={isLoading}
                >
                    {getValue('cancel')}
                </Button>
                <Button
                    variant="primary"
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="confirm-btn"
                >
                    {isLoading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            {getValue('syncing_users')}
                        </>
                    ) : (
                        getValue('yes')
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MadietConfirmModal;