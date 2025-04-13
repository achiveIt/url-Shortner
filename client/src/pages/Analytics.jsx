import { useEffect, useState } from 'react';
import AnalyticsChart from '../components/AnalyticsChart';
import { SERVER_BASE_URL } from '../../constants';

export default function Analytics() {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [selectedLinkId, setSelectedLinkId] = useState(null);
  
    useEffect(() => {
        const fetchAnalytics = async () => {
            const res = await fetch(`${SERVER_BASE_URL}/api/analytics`, {
                credentials: 'include',
            });
            const json = await res.json();
            setAnalyticsData(json.message);
    
            if (json.message.length > 0) {
                setSelectedLinkId(json.message[0].linkId);
            }
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
        <h1 className="text-2xl font-bold mb-4">Analytics</h1>
  
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
      </div>
    );
  }