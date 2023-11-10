"use client"
import { useState } from 'react';

const TransferForm = () => {
    const [sourceDept, setSourceDept] = useState('');
    const [destDept, setDestDept] = useState('');
    const [productId, setProductId] = useState('');

    const handleTransfer = () => {
        // Handle form submission (e.g., send data to API route)
        console.log('Transfer submitted:', { sourceDept, destDept, productId });
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Source Department"
                value={sourceDept}
                onChange={(e) => setSourceDept(e.target.value)}
            />
            <input
                type="text"
                placeholder="Destination Department"
                value={destDept}
                onChange={(e) => setDestDept(e.target.value)}
            />
            <input
                type="text"
                placeholder="Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
            />
            <button onClick={handleTransfer}>Transfer</button>
        </div>
    );
};

export default TransferForm;
