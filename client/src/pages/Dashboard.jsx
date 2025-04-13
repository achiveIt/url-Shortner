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
        <div className="min-h-screen bg-beige p-6" style={{ backgroundColor: 'rgb(214,200,181)' }}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-center w-full">📄 Your Shortened Links</h1>
    
                <div className="flex gap-3 items-center w-full md:w-auto justify-center md:justify-end">
                    <input
                        type="text"
                        placeholder="Search by keyword..."
                        className="bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={() => navigate('/analytics')}
                        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition"
                    >
                        Analytics
                    </button>
                    <button
                        onClick={() => navigate('/create')}
                        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition"
                    >
                        Create New Link
                    </button>
                </div>
            </div>
    
            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="w-full table-auto bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-white text-gray-800 text-center"> {/* match table row background */}
                            <th className="p-3 border">Original URL</th>
                            <th className="p-3 border">Short URL</th>
                            <th className="p-3 border">Clicks</th>
                            <th className="p-3 border">Created</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">QR Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {links.map((link) => (
                            <tr key={link._id} className="text-center bg-white hover:bg-gray-100 transition">
                                <td className="p-3 border break-all">{link.originalUrl}</td>
                                <td className="p-3 border text-blue-600 underline">
                                    <a
                                        href={`${SERVER_BASE_URL}/${link.shortCode}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        /{link.shortCode}
                                    </a>
                                </td>
                                <td className="p-3 border">{link.totalClicks}</td>
                                <td className="p-3 border">{new Date(link.createdAt).toLocaleDateString()}</td>
                                <td className="p-3 border">
                                    {link.expirationDate && new Date(link.expirationDate) < new Date()
                                        ? 'Expired'
                                        : 'Active'}
                                </td>
                                <td
                                    className="p-3 border text-blue-600 underline cursor-pointer"
                                    onClick={() => openQrModal(link.shortCode)}
                                >
                                    View QR
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    
            <div className="mt-6 flex justify-center items-center gap-6">
                <button
                    disabled={!pagination.hasPrev}
                    onClick={() => setPage(page - 1)}
                    className={`px-4 py-2 rounded-md transition ${
                        pagination.hasPrev
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'bg-black text-white cursor-not-allowed'
                    }`}
                >
                    Previous
                </button>
                <span className="text-gray-700 font-medium">
                    Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                    disabled={!pagination.hasNext}
                    onClick={() => setPage(page + 1)}
                    className={`px-4 py-2 rounded-md transition ${
                        pagination.hasNext
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'bg-black text-white cursor-not-allowed'
                    }`}
                >
                    Next
                </button>
            </div>
    
            {qrModelOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-80">
                        <button
                            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                            onClick={closeQrModel}
                        >
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
                                    <a
                                        href={qrData.shortUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 text-blue-600 hover:underline text-sm break-all text-center"
                                    >
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