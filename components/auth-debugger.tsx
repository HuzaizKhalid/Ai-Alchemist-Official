"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";

export function AuthDebugger() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSignup = async () => {
    setLoading(true);
    console.log('🧪 Testing signup...');
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'debug@test.com',
          password: 'DebugTest123',
          name: 'Debug User'
        })
      });
      
      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📄 Response data:', data);
      
      setTestResult({
        type: 'signup',
        status: response.status,
        success: response.ok,
        data: data
      });
      
    } catch (error) {
      console.error('❌ Signup error:', error);
      setTestResult({
        type: 'signup',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testSignin = async () => {
    setLoading(true);
    console.log('🧪 Testing signin...');
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'debug@test.com',
          password: 'DebugTest123'
        })
      });
      
      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📄 Response data:', data);
      
      setTestResult({
        type: 'signin',
        status: response.status,
        success: response.ok,
        data: data
      });
      
    } catch (error) {
      console.error('❌ Signin error:', error);
      setTestResult({
        type: 'signin',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testAuthMe = async () => {
    setLoading(true);
    console.log('🧪 Testing auth/me...');
    
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📄 Response data:', data);
        setTestResult({
          type: 'auth-check',
          status: response.status,
          success: true,
          data: data
        });
      } else {
        setTestResult({
          type: 'auth-check',
          status: response.status,
          success: false,
          message: 'Not authenticated'
        });
      }
      
    } catch (error) {
      console.error('❌ Auth check error:', error);
      setTestResult({
        type: 'auth-check',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg max-w-sm z-50">
      <h3 className="text-white font-bold mb-2">🔧 Auth Debugger</h3>
      
      <div className="space-y-2 mb-4">
        <Button 
          onClick={testAuthMe} 
          disabled={loading}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Test Auth Status
        </Button>
        <Button 
          onClick={testSignup} 
          disabled={loading}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Test Signup
        </Button>
        <Button 
          onClick={testSignin} 
          disabled={loading}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Test Signin
        </Button>
      </div>
      
      {testResult && (
        <div className="text-xs text-white bg-black/50 p-2 rounded max-h-40 overflow-auto">
          <div className="font-bold">{testResult.type} Result:</div>
          <div className={testResult.success ? 'text-green-400' : 'text-red-400'}>
            Status: {testResult.status || 'Error'}
          </div>
          {testResult.data && (
            <pre className="mt-1 text-xs overflow-x-auto">
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          )}
          {testResult.error && (
            <div className="text-red-400 mt-1">
              Error: {testResult.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
