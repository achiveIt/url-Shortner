import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLinks } from '../redux/slices/linkSlice';
import { SERVER_BASE_URL } from '../../constants';

export default function Dashboard() {
    const dispatch = useDispatch();
    const links = useSelector((state) => state.links.allLinks);

    useEffect(() => {
        const fetchLinks = async () => {
          try {
            console.log("trying to fetch data to dashboard");
            
            const res = await fetch(`${SERVER_BASE_URL}/api/links`, 
                {
                    method: "GET",
                    credentials: 'include',
                   headers: {
                       "Content-Type": "application/json",
                   },
                });
            if (!res.ok) {
                console.log("Failed to fecth request");
                
                throw new Error('Failed to fetch');
            }
            const data = await res.json();
            dispatch(setLinks(data.data.links));
          } catch (err) {
            console.log("bhaiii error block mae aagye");
            console.log(err);
            
            
            console.error('Error fetching links', err);
          }
        };
        fetchLinks();
      }, [dispatch]);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Shortened Links</h1>
        <table className="w-full table-auto border">
            <thead>
                <tr className="bg-gray-200">
                    <th className="p-2 border">Original URL</th>
                    <th className="p-2 border">Short URL</th>
                    <th className="p-2 border">Clicks</th>
                    <th className="p-2 border">Created</th>
                    <th className="p-2 border">Status</th>
                </tr>
            </thead>
            <tbody>
                {links.map((link) => (
                    <tr key={link._id} className="text-center">
                        <td className="p-2 border break-all">{link.originalUrl}</td>
                        <td className="p-2 border text-blue-600 underline">
                            <a href={`${SERVER_BASE_URL}/${link.shortCode}`} target="_blank" rel="noopener noreferrer">
                                {`/${link.shortCode}`}
                            </a>
                        </td>
                        <td className="p-2 border">{link.totalClicks}</td>
                        <td className="p-2 border">{new Date(link.createdAt).toLocaleDateString()}</td>
                        <td className="p-2 border">{link.expirationDate && new Date(link.expirationDate) < new Date() ? 'Expired': 'Active'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}