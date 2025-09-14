"use client";"use client";



import React, { useState, useRef } from 'react';import React, { useState, useRef } from 'react';

import SearchForm from '@/components/SearchForm';import SearchForm from '@/components/SearchForm';



export default function TestSuggestionsPage() {export default function TestSuggestionsPage() {

  const [query, setQuery] = useState("");  const [query, setQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);  const inputRef = useRef<HTMLTextAreaElement>(null);



  const handleSearch = async (e: React.FormEvent) => {  const handleSearch = async (e: React.FormEvent) => {

    e.preventDefault();    e.preventDefault();

    if (!query.trim()) return;    if (!query.trim()) return;



    console.log('Search executed:', { query });    console.log('Search executed:', { query });

    alert(`Search executed with query: "${query}"`);    alert(`Search executed with query: "${query}"`);

        

    setIsLoading(true);    setIsLoading(true);

    // Simulate search delay    // Simulate search delay

    setTimeout(() => {    setTimeout(() => {

      setIsLoading(false);      setIsLoading(false);

    }, 2000);    }, 2000);

  };  };



  return (  return (

    <div className="min-h-screen bg-slate-900 text-white p-8">    <div className="min-h-screen bg-slate-900 text-white p-8">

      <div className="max-w-4xl mx-auto space-y-8">      <div className="max-w-4xl mx-auto space-y-8">

        <div className="text-center space-y-4">        <div className="text-center space-y-4">

          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">

            Recent History + Live Suggestions Test            Search Suggestions Test

          </h1>          </h1>

          <p className="text-slate-400 text-lg">          <p className="text-slate-400 text-lg">

            Test the new recent global history feature and live suggestions            Test the suggestion selection and positioning fixes

          </p>          </p>

        </div>        </div>



        {/* Test Instructions */}        {/* Test Instructions */}

        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">

          <h2 className="text-xl font-semibold mb-4 text-emerald-400">New Feature Test Instructions</h2>          <h2 className="text-xl font-semibold mb-4 text-emerald-400">Test Instructions</h2>

          <div className="space-y-3 text-slate-300">          <div className="space-y-3 text-slate-300">

            <div className="flex items-start space-x-3">            <div className="flex items-start space-x-3">

              <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">              <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">

                <span className="text-emerald-400 text-sm font-bold">1</span>                <span className="text-emerald-400 text-sm font-bold">1</span>

              </div>              </div>

              <div>              <div>

                <strong className="text-white">Focus Input (Empty)</strong> - Click on the search box to see recent global chat history from all users                <strong className="text-white">Focus Input</strong> - Click on the search box to see recent global chat history from all users

              </div>              </div>

            </div>            </div>

                        

            <div className="flex items-start space-x-3">            <div className="flex items-start space-x-3">

              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">

                <span className="text-blue-400 text-sm font-bold">2</span>                <span className="text-blue-400 text-sm font-bold">2</span>

              </div>              </div>

              <div>              <div>

                <strong className="text-white">Start Typing</strong> - Begin typing to see live API suggestions replace the history                <strong className="text-white">Start Typing</strong> - Begin typing to see live API suggestions replace the history

              </div>              </div>

            </div>            </div>

                        

            <div className="flex items-start space-x-3">            <div className="flex items-start space-x-3">

              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">

                <span className="text-purple-400 text-sm font-bold">3</span>                <span className="text-purple-400 text-sm font-bold">3</span>

              </div>              </div>

              <div>              <div>

                <strong className="text-white">Test Selection</strong> - Use arrow keys + Enter or mouse clicks to select items                <strong className="text-white">Test Selection</strong> - Use arrow keys + Enter or mouse clicks to select items

              </div>              </div>

            </div>            </div>

                        

            <div className="flex items-start space-x-3">            <div className="flex items-start space-x-3">

              <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">              <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">

                <span className="text-orange-400 text-sm font-bold">4</span>                <span className="text-orange-400 text-sm font-bold">4</span>

              </div>              </div>

              <div>              <div>

                <strong className="text-white">Clear and Refocus</strong> - Clear input and click again to see recent history                <strong className="text-white">Check Flow</strong> - Clear input to see recent history again

              </div>              </div>

            </div>            </div>

          </div>          </div>

        </div>        </div>



        {/* Search Form */}        {/* Search Form */}

        <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-600/30">        <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-600/30">

          <SearchForm           <SearchForm 

            query={query}            query={query}

            setQuery={setQuery}            setQuery={setQuery}

            handleSearch={handleSearch}            handleSearch={handleSearch}

            isLoading={isLoading}            isLoading={isLoading}

            inputRef={inputRef}            inputRef={inputRef}

            className="w-full"            className="w-full"

          />          />

        </div>        </div>



        {/* Expected Results */}        {/* Expected Results */}

        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">

          <h2 className="text-xl font-semibold mb-4 text-blue-400">Expected Behavior</h2>          <h2 className="text-xl font-semibold mb-4 text-blue-400">Expected Behavior</h2>

          <div className="grid md:grid-cols-2 gap-6">          <div className="grid md:grid-cols-2 gap-6">

            <div>            <div>

              <h3 className="font-semibold text-emerald-400 mb-2">🔍 Recent Global History</h3>              <h3 className="font-semibold text-emerald-400 mb-2">🔍 Recent History</h3>

              <ul className="text-slate-300 space-y-1 text-sm">              <ul className="text-slate-300 space-y-1 text-sm">

                <li>• Shows when input is focused (no typing)</li>                <li>• Shows when input is focused (no typing)</li>

                <li>• Displays last 5 searches from all users</li>                <li>• Displays last 5 searches from all users</li>

                <li>• Shows user names and timestamps</li>                <li>• Shows user names and timestamps</li>

                <li>• Click or keyboard navigation works</li>                <li>• Click or keyboard navigation works</li>

              </ul>              </ul>

            </div>            </div>

            <div>            <div>

              <h3 className="font-semibold text-blue-400 mb-2">💡 Live API Suggestions</h3>              <h3 className="font-semibold text-blue-400 mb-2">💡 Live Suggestions</h3>

              <ul className="text-slate-300 space-y-1 text-sm">              <ul className="text-slate-300 space-y-1 text-sm">

                <li>• Appears when you start typing (replaces history)</li>                <li>• Appears when you start typing</li>

                <li>• Fetches from 4 live APIs (Google, Wikipedia, etc.)</li>                <li>• Fetches from 4 live APIs</li>

                <li>• Real-time debounced updates</li>                <li>• Replaces history display</li>

                <li>• Same selection mechanism as history</li>                <li>• Real-time debounced updates</li>

              </ul>              </ul>

            </div>            </div>

          </div>          </div>

        </div>        </div>



        <div className="text-center text-slate-500 text-sm space-y-2">        <div className="text-center text-slate-500 text-sm">

          <p>Check browser console for detailed logs and API responses</p>          <p>Check browser console for detailed logs and API responses</p>

          <p className="text-xs">This tests both the recent history feature and existing live suggestions</p>        </div>

        </div>      </div>

      </div>    </div>

    </div>  );

  );}

}
  const handleSearch = async (e: React.FormEvent) => {          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">

    e.preventDefault();            Search Suggestions Test

    if (!query.trim()) return;          </h1>

          <p className="text-slate-400 text-lg">

    console.log('Search executed:', { query });            Test the suggestion selection and positioning fixes

    alert(`Search executed with query: "${query}"`);          </p>

            </div>

    setIsLoading(true);

    // Simulate search delay        {/* Test Instructions */}

    setTimeout(() => {        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">

      setIsLoading(false);          <h2 className="text-xl font-semibold mb-4 text-emerald-400">Test Instructions</h2>

    }, 2000);          <div className="space-y-3 text-slate-300">

  };            <div className="flex items-start space-x-3">

              <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">

  return (                <span className="text-emerald-400 text-sm font-bold">1</span>

    <div className="min-h-screen bg-slate-900 text-white p-8">              </div>

      <div className="max-w-4xl mx-auto space-y-8">              <div>

        <div className="text-center space-y-4">                <strong className="text-white">Type a query</strong> (e.g., "climate change", "renewable energy", "ai") and wait for suggestions to appear

          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">              </div>

            Search Suggestions Test            </div>

          </h1>            

          <p className="text-slate-400 text-lg">            <div className="flex items-start space-x-3">

            Test the suggestion selection and positioning fixes              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">

          </p>                <span className="text-blue-400 text-sm font-bold">2</span>

        </div>              </div>

              <div>

        {/* Test Instructions */}                <strong className="text-white">Test Keyboard Selection:</strong> Use ↑↓ arrow keys to navigate suggestions, then press Enter to select

        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">              </div>

          <h2 className="text-xl font-semibold mb-4 text-emerald-400">Test Instructions</h2>            </div>

          <div className="space-y-3 text-slate-300">            

            <div className="flex items-start space-x-3">            <div className="flex items-start space-x-3">

              <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">

                <span className="text-emerald-400 text-sm font-bold">1</span>                <span className="text-purple-400 text-sm font-bold">3</span>

              </div>              </div>

              <div>              <div>

                <strong className="text-white">Type a query</strong> (e.g., "climate change", "renewable energy", "ai") and wait for suggestions to appear                <strong className="text-white">Test Mouse Selection:</strong> Click on any suggestion to select it

              </div>              </div>

            </div>            </div>

                        

            <div className="flex items-start space-x-3">            <div className="flex items-start space-x-3">

              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">              <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">

                <span className="text-blue-400 text-sm font-bold">2</span>                <span className="text-orange-400 text-sm font-bold">4</span>

              </div>              </div>

              <div>              <div>

                <strong className="text-white">Test Keyboard Selection:</strong> Use ↑↓ arrow keys to navigate suggestions, then press Enter to select                <strong className="text-white">Check Positioning:</strong> Verify suggestions appear below the input field (not above other content)

              </div>              </div>

            </div>            </div>

                      </div>

            <div className="flex items-start space-x-3">        </div>

              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">

                <span className="text-purple-400 text-sm font-bold">3</span>        {/* Search Form */}

              </div>        <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-600/30">

              <div>          <SearchForm 

                <strong className="text-white">Test Mouse Selection:</strong> Click on any suggestion to select it            onSearch={(query, type) => {

              </div>              console.log('Search executed:', { query, type });

            </div>              alert(`Search executed with query: "${query}" (type: ${type})`);

                        }}

            <div className="flex items-start space-x-3">            className="w-full"

              <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">          />

                <span className="text-orange-400 text-sm font-bold">4</span>        </div>

              </div>

              <div>        {/* Expected Results */}

                <strong className="text-white">Check Positioning:</strong> Verify suggestions appear below the input field (not above other content)        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">

              </div>          <h2 className="text-xl font-semibold mb-4 text-blue-400">Expected Results</h2>

            </div>          <div className="grid md:grid-cols-2 gap-6">

          </div>            <div>

        </div>              <h3 className="font-semibold text-emerald-400 mb-2">✅ Selection Fix</h3>

              <ul className="text-slate-300 space-y-1 text-sm">

        {/* Search Form */}                <li>• Selected suggestion text should be used for search</li>

        <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-600/30">                <li>• Both keyboard (Enter) and mouse (click) should work</li>

          <SearchForm                 <li>• Alert should show the selected suggestion text</li>

            query={query}              </ul>

            setQuery={setQuery}            </div>

            handleSearch={handleSearch}            <div>

            isLoading={isLoading}              <h3 className="font-semibold text-blue-400 mb-2">✅ Positioning Fix</h3>

            inputRef={inputRef}              <ul className="text-slate-300 space-y-1 text-sm">

            className="w-full"                <li>• Suggestions should appear below the input</li>

          />                <li>• No overlay issues with other elements</li>

        </div>                <li>• Proper z-index and positioning</li>

              </ul>

        {/* Expected Results */}            </div>

        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">          </div>

          <h2 className="text-xl font-semibold mb-4 text-blue-400">Expected Results</h2>        </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>        <div className="text-center text-slate-500 text-sm">

              <h3 className="font-semibold text-emerald-400 mb-2">✅ Selection Fix</h3>          <p>Check browser console for detailed search logs</p>

              <ul className="text-slate-300 space-y-1 text-sm">        </div>

                <li>• Selected suggestion text should be used for search</li>      </div>

                <li>• Both keyboard (Enter) and mouse (click) should work</li>    </div>

                <li>• Alert should show the selected suggestion text</li>  );

              </ul>}
            </div>
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">✅ Positioning Fix</h3>
              <ul className="text-slate-300 space-y-1 text-sm">
                <li>• Suggestions should appear below the input</li>
                <li>• No overlay issues with other elements</li>
                <li>• Proper z-index and positioning</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-slate-500 text-sm">
          <p>Check browser console for detailed search logs</p>
        </div>
      </div>
    </div>
  );
}