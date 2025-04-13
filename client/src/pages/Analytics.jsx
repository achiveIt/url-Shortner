import { useEffect, useState } from 'react';
import AnalyticsChart from '../components/AnalyticsChart';
import { SERVER_BASE_URL } from '../../constants';
import { useNavigate } from 'react-router-dom';

export default function Analytics() {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [selectedLinkId, setSelectedLinkId] = useState(null);
    const [loading, setLoading] = useState(true);  
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true); 
            const res = await fetch(`${SERVER_BASE_URL}/api/analytics`, {
                credentials: 'include',
            });
            const json = await res.json();
            setAnalyticsData(json.message);

            if (json.message.length > 0) {
                setSelectedLinkId(json.message[0].linkId);
            }
            setLoading(false);
        };

        fetchAnalytics();
    }, []);

    const uniqueLinkData = Array.from(
        new Map(
            analyticsData.map(item => [item.linkId, item])
        ).values()
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Analytics</h1>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                    Back to Dashboard
                </button>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading...</div> 
            ) : (
                <>
                    <select value={selectedLinkId || ''} onChange={e => setSelectedLinkId(e.target.value)} className="mb-6 p-2 border rounded">
                        {uniqueLinkData.map(item => (
                            <option key={item.linkId} value={item.linkId}>
                                {item.originalUrl} ({item.shortId})
                            </option>
                        ))}
                    </select>

                    {selectedLinkId && (
                        <AnalyticsChart data={analyticsData} linkId={selectedLinkId} />
                    )}
                </>
            )}
        </div>
    );
}