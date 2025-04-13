import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_BASE_URL } from '../../constants';

export default function CreateLink() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`${SERVER_BASE_URL}/api/links/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    originalUrl,
                    customAlias,
                    expirationDate,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setSuccess('Link created successfully!');
            setOriginalUrl('');
            setCustomAlias('');
            setExpirationDate('');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[rgb(214,200,181)] p-6">
            <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Create Short Link</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 text-sm"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

                <form onSubmit={handleCreate}>
                    <input
                        type="url"
                        placeholder="Original URL"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        required
                        className="w-full px-4 py-2 mb-4 border rounded"
                    />

                    <input
                        type="text"
                        placeholder="Custom Alias (optional)"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        className="w-full px-4 py-2 mb-4 border rounded"
                    />

                    <div className="mb-6">
                        <label className="block mb-1 text-sm text-gray-700 text-left">Expiration Date (optional)</label>
                        <input
                            type="date"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Create Link
                    </button>
                </form>
            </div>
        </div>
    );
}