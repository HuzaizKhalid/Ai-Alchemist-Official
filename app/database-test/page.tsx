"use client";
import { useState, useEffect } from "react";

export default function DatabaseTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-db");
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">MongoDB Connection Test</h1>

      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test MongoDB Connection"}
      </button>

      {testResult && (
        <div
          className={`p-4 rounded-lg ${
            testResult.success
              ? "bg-green-100 border-green-500"
              : "bg-red-100 border-red-500"
          } border`}
        >
          <h2 className="text-xl font-semibold mb-4">
            {testResult.success
              ? "✅ Connection Successful"
              : "❌ Connection Failed"}
          </h2>

          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
