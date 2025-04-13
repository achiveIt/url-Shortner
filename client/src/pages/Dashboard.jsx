import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLinks } from '../redux/slices/linkSlice';
import { SERVER_BASE_URL } from '../../constants';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

export default function Dashboard() {
    const dispatch = useDispatch();
    const links = useSelector((state) => state.links.allLinks);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
    });

    const [qrModelOpen, setQrModalOpen] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [loadingQr, setLoadingQr] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const queryParams = new URLSearchParams({
                    page,
                    limit: 10,
                    search: searchTerm,
                });
    
                const res = await fetch(`${SERVER_BASE_URL}/api/links?${queryParams.toString()}`, {
                    method: "GET",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                dispatch(setLinks(data.data.links));
    
                setPagination({
                    total: data.data.total,
                    page: data.data.page,
                    limit: data.data.limit,
                    totalPages: data.data.totalPages,
                    hasNext: data.data.hasNextPage,
                    hasPrev: data.data.hasPrevPage,
                });
            } catch (err) {
                console.error('Error fetching links', err);
            }
        };
    
        const debouncedFetch = debounce(fetchLinks, 300);
        debouncedFetch();
    
        return () => debouncedFetch.cancel();
    }, [dispatch, page, searchTerm]);

    const openQrModal = async (shortCode) => {
        setLoadingQr(true);
        setQrModalOpen(true);
        setError(null);
        try {
            const res = await fetch(`${SERVER_BASE_URL}/api/qr/${shortCode}`);
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            setQrData(json.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingQr(false);
        }
    };

    const closeQrModel = () => {
        setQrModalOpen(false);
        setQrData(null);
        setError(null);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Your Shortened Links</h1>
                <div className="flex gap-3">
                    <input type="text"
                            placeholder="Search by keyword..."
                            className="border px-3 py-1 rounded"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button onClick={() => navigate('/analytics')} className="bg-blue-500 text-white px-4 py-1 rounded">
                        Analytics
                    </button>
                    <button onClick={() => navigate('/create')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Create New Link
                    </button>
                </div>
            </div>
            <table className="w-full table-auto border">
                <thead>
                    <tr className="bg-gray-200 text-center">
                        <th className="p-2 border">Original URL</th>
                        <th className="p-2 border">Short URL</th>
                        <th className="p-2 border">Clicks</th>
                        <th className="p-2 border">Created</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">QR Image</th>
                    </tr>
                </thead>
                <tbody>
                    {links.map((link) => (
                        <tr key={link._id} className="text-center">
                            <td className="p-2 border break-all">{link.originalUrl}</td>
                            <td className="p-2 border text-blue-600 underline">
                                <a href={`${SERVER_BASE_URL}/${link.shortCode}`} target="_blank" rel="noopener noreferrer">
                                    /{link.shortCode}
                                </a>
                            </td>
                            <td className="p-2 border">{link.totalClicks}</td>
                            <td className="p-2 border">{new Date(link.createdAt).toLocaleDateString()}</td>
                            <td className="p-2 border">{link.expirationDate && new Date(link.expirationDate) < new Date() ? 'Expired' : 'Active'}</td>
                            <td className="p-2 border text-blue-600 underline cursor-pointer" onClick={() => openQrModal(link.shortCode)}>
                                View QR
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-center items-center gap-4">
                <button disabled={!pagination.hasPrev}
                    onClick={() => setPage(page - 1)}
                    className={`px-3 py-1 rounded ${pagination.hasPrev ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
                    Previous
                </button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button disabled={!pagination.hasNext}
                    onClick={() => setPage(page + 1)}
                    className={`px-3 py-1 rounded ${pagination.hasNext ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
                    Next
                </button>
            </div>

            {qrModelOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-80">
                        <button className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                            onClick={closeQrModel}>
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-center">Scan QR Code</h2>
                        {loadingQr ? (
                            <p className="text-center text-gray-500">Loading...</p>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : (
                            qrData && (
                                <div className="flex flex-col items-center">
                                    <img src={qrData.qrCode} alt="QR Code" className="w-48 h-48" />
                                    <a  href={qrData.shortUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 text-blue-600 hover:underline text-sm break-all">
                                        {qrData.shortUrl}
                                    </a>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}