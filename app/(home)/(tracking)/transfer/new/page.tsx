// pages/transfers/new.tsx
import React from 'react';
import TransferForm from '@/components/forms/TransferForm';

const NewTransferPage: React.FC = () => {
    return (
        <div>
            <h1>Add New Transfer</h1>
            <TransferForm />
        </div>
    );
};

export default NewTransferPage;
