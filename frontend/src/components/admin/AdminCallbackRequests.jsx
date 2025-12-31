import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export default function AdminCallbackRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/callback-requests")
      .then(res => res.json())
      .then(setRequests)
      .catch(() => setError("Failed to load callback requests."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Callback Requests</h1>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map(req => (
            <Card key={req.id} className="border hover:border-red-500 transition-all">
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Badge className="bg-red-500 text-white">{req.location}</Badge>
                  <span className="text-gray-500 text-xs ml-auto">{new Date(req.createdAt).toLocaleString()}</span>
                </div>
                <div className="font-bold text-lg mb-1">{req.name}</div>
                <div className="text-gray-700 mb-1">{req.email}</div>
                <div className="text-gray-700 mb-1">{req.phone}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        {requests.length === 0 && !loading && <div className="text-gray-500 mt-8">No callback requests yet.</div>}
      </div>
    </div>
  );
}
