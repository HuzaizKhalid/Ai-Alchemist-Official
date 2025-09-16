"use client";"use client";"use client";



import React from "react";

import { Clock, Users, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";import React from "react";import React from "react";

import { RecentHistoryItem } from "@/hooks/use-recent-global-history";

import { Clock, Users, TrendingUp } from "lucide-react";import { Clock, Users, TrendingUp } from "lucide-react";

interface RecentHistoryProps {

  history: RecentHistoryItem[];import { cn } from "@/lib/utils";import { cn } from "@/lib/utils";

  isLoading: boolean;

  error: string | null;import { RecentHistoryItem } from "@/hooks/use-recent-global-history";import { RecentHistoryItem } from "@/hooks/use-recent-global-history";

  visible: boolean;

  selectedIndex: number;

  onHistoryClick: (query: string, index: number) => void;

  onHistoryHover: (index: number) => void;interface RecentHistoryProps {interface RecentHistoryProps {

}

  history: RecentHistoryItem[];  history: RecentHistoryItem[];

const RecentHistory: React.FC<RecentHistoryProps> = ({

  history,  isLoading: boolean;  isLoading: boolean;

  isLoading,

  error,  error: string | null;  error: string | null;

  visible,

  selectedIndex,  visible: boolean;  visible: boolean;

  onHistoryClick,

  onHistoryHover,  selectedIndex: number;  selectedIndex: number;

}) => {

  if (!visible) return null;  onHistoryClick: (query: string, index: number) => void;  onHistoryClick: (query: string, index: number) => void;



  // Helper function to format time  onHistoryHover: (index: number) => void;  onHistoryHover: (index: number) => void;

  const formatTime = (date: Date) => {

    const now = new Date();}}

    const diffInMs = now.getTime() - date.getTime();

    const diffInHours = diffInMs / (1000 * 60 * 60);



    if (diffInHours < 1) {const RecentHistory: React.FC<RecentHistoryProps> = ({const RecentHistory: React.FC<RecentHistoryProps> = ({ort React from "react";

      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

      return `${diffInMinutes}m ago`;  history,  return (

    } else if (diffInHours < 24) {

      return `${Math.floor(diffInHours)}h ago`;  isLoading,    <div className="absolute bottom-full left-0 right-0 mb-1 z-[9999] animate-in fade-in slide-in-from-bottom-2 duration-200">

    } else {

      const diffInDays = Math.floor(diffInHours / 24);  error,      <div className="bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-xl shadow-2xl max-h-80 overflow-hidden">ort { Clock, Users, TrendingUp } from "lucide-react";

      return `${diffInDays}d ago`;

    }  visible,import { cn } from "@/lib/utils";

  };

  selectedIndex,import { RecentHistoryItem } from "@/hooks/use-recent-global-history";

  return (

    <div className="absolute top-full left-0 right-0 mt-1 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">  onHistoryClick,

      <div className="bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-xl shadow-2xl max-h-80 overflow-hidden">

        {/* Loading State */}  onHistoryHover,interface RecentHistoryProps {

        {isLoading && (

          <div className="flex items-center justify-center py-4 px-6">}) => {  history: RecentHistoryItem[];

            <div className="flex items-center space-x-3 text-slate-400">

              <div className="w-4 h-4 border-2 border-slate-600 border-t-emerald-400 rounded-full animate-spin" />  if (!visible) return null;  isLoading: boolean;

              <span className="text-sm">Loading recent searches...</span>

            </div>  error: string | null;

          </div>

        )}  // Helper function to format time  visible: boolean;



        {/* Error State */}  const formatTime = (date: Date) => {  selectedIndex: number;

        {error && !isLoading && (

          <div className="flex items-center justify-center py-4 px-6">    const now = new Date();  onHistoryClick: (query: string, index: number) => void;

            <div className="text-red-400 text-sm flex items-center space-x-2">

              <Clock className="w-4 h-4" />    const diffInMs = now.getTime() - date.getTime();  onHistoryHover: (index: number) => void;

              <span>Unable to load recent searches</span>

            </div>    const diffInHours = diffInMs / (1000 * 60 * 60);}

          </div>

        )}



        {/* History List */}    if (diffInHours < 1) {const RecentHistory: React.FC<RecentHistoryProps> = ({

        {!isLoading && !error && history.length > 0 && (

          <>      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));  history,

            {/* Header */}

            <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-700/20">      return `${diffInMinutes}m ago`;  isLoading,

              <div className="flex items-center space-x-2 text-slate-400 text-xs">

                <Users className="w-3 h-3" />    } else if (diffInHours < 24) {  error,

                <span>Recent Global Searches</span>

              </div>      return `${Math.floor(diffInHours)}h ago`;  visible,

            </div>

    } else {  selectedIndex,

            {/* History Items */}

            <div className="max-h-64 overflow-y-auto" style={{ pointerEvents: 'auto' }}>      const diffInDays = Math.floor(diffInHours / 24);  onHistoryClick,

              {history.map((item, index) => (

                <div      return `${diffInDays}d ago`;  onHistoryHover,

                  key={`${item.id || index}-${item.createdAt}`}

                  className={cn(    }}) => {

                    "px-4 py-3 cursor-pointer transition-all duration-150 flex items-start space-x-3 group relative",

                    "hover:bg-slate-700/50 border-l-2",  };  if (!visible) return null;

                    selectedIndex === index

                      ? "bg-emerald-500/20 border-emerald-400 text-white"

                      : "border-transparent text-slate-200"

                  )}  return (  // Helper function to format time

                  style={{ pointerEvents: 'auto' }}

                  onClick={() => onHistoryClick(item.query, index)}    <div className="absolute bottom-full left-0 right-0 mb-1 z-[9999] animate-in fade-in slide-in-from-bottom-2 duration-200">  const formatTime = (date: Date) => {

                  onMouseEnter={() => onHistoryHover(index)}

                  onMouseLeave={() => {      <div className="bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-xl shadow-2xl max-h-80 overflow-hidden">    const now = new Date();

                    if (selectedIndex === index) {

                      onHistoryHover(-1);        {/* Loading State */}    const diffInMs = now.getTime() - date.getTime();

                    }

                  }}        {isLoading && (    const diffInHours = diffInMs / (1000 * 60 * 60);

                >

                  {/* Icon */}          <div className="flex items-center justify-center py-4 px-6">

                  <div

                    className={cn(            <div className="flex items-center space-x-3 text-slate-400">    if (diffInHours < 1) {

                      "w-4 h-4 mt-0.5 transition-colors",

                      selectedIndex === index              <div className="w-4 h-4 border-2 border-slate-600 border-t-emerald-400 rounded-full animate-spin" />      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

                        ? "text-emerald-300"

                        : "text-slate-500 group-hover:text-slate-400"              <span className="text-sm">Loading recent searches...</span>      return `${diffInMinutes}m ago`;

                    )}

                  >            </div>    } else if (diffInHours < 24) {

                    <TrendingUp className="w-4 h-4" />

                  </div>          </div>      return `${Math.floor(diffInHours)}h ago`;



                  {/* Content */}        )}    } else {

                  <div className="flex-1 min-w-0">

                    <div      const diffInDays = Math.floor(diffInHours / 24);

                      className={cn(

                        "text-sm font-medium truncate transition-colors",        {/* Error State */}      return `${diffInDays}d ago`;

                        selectedIndex === index

                          ? "text-white"        {error && !isLoading && (    }

                          : "text-slate-200 group-hover:text-white"

                      )}          <div className="flex items-center justify-center py-4 px-6">  };

                    >

                      {item.query}            <div className="text-red-400 text-sm flex items-center space-x-2">

                    </div>

              <Clock className="w-4 h-4" />  return (

                    <div className="flex items-center space-x-3 mt-1">

                      <span className="text-xs text-slate-400">              <span>Unable to load recent searches</span>    <div className="absolute top-full left-0 right-0 mt-1 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">

                        {formatTime(new Date(item.createdAt))}

                      </span>            </div>      <div className="bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-xl shadow-2xl max-h-80 overflow-hidden">

                      {item.userName && (

                        <span className="text-xs text-slate-500">          </div>        {/* Loading State */}

                          by {item.userName}

                        </span>        )}        {isLoading && (

                      )}

                    </div>          <div className="flex items-center justify-center py-4 px-6">

                  </div>

        {/* History List */}            <div className="flex items-center space-x-3 text-slate-400">

                  {/* Keyboard hint */}

                  {selectedIndex === index && (        {!isLoading && !error && history.length > 0 && (              <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />

                    <div className="flex items-center space-x-1 text-xs text-emerald-400/80 ml-2">

                      <span>↵</span>          <>              <span className="text-sm">Loading recent searches...</span>

                    </div>

                  )}            {/* Header */}            </div>

                </div>

              ))}            <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-700/20">          </div>

            </div>

              <div className="flex items-center space-x-2 text-slate-400 text-xs">        )}

            {/* Footer */}

            <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-700/20">                <Users className="w-3 h-3" />

              <div className="flex items-center justify-between text-xs text-slate-500">

                <div className="flex items-center space-x-4">                <span>Recent Global Searches</span>        {/* Error State */}

                  <div className="flex items-center space-x-1">

                    <kbd className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs">              </div>        {error && !isLoading && (

                      ↑↓

                    </kbd>            </div>          <div className="flex items-center justify-center py-4 px-6">

                    <span>navigate</span>

                  </div>            <div className="text-red-400 text-sm flex items-center space-x-2">

                  <div className="flex items-center space-x-1">

                    <kbd className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs">            {/* History Items */}              <Clock className="w-4 h-4" />

                      ↵

                    </kbd>            <div className="max-h-64 overflow-y-auto" style={{ pointerEvents: 'auto' }}>              <span>Unable to load recent searches</span>

                    <span>select</span>

                  </div>              {history.map((item, index) => (            </div>

                  <div className="flex items-center space-x-1">

                    <kbd className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs">                <div          </div>

                      Esc

                    </kbd>                  key={`${item.id || index}-${item.createdAt}`}        )}

                    <span>close</span>

                  </div>                  className={cn(

                </div>

                <span className="text-slate-600">                    "px-4 py-3 cursor-pointer transition-all duration-150 flex items-start space-x-3 group relative",        {/* Recent History List */}

                  {history.length} recent searches

                </span>                    "hover:bg-slate-700/50 border-l-2",        {!isLoading && !error && history.length > 0 && (

              </div>

            </div>                    selectedIndex === index          <>

          </>

        )}                      ? "bg-emerald-500/20 border-emerald-400 text-white"            {/* Header */}



        {/* No History State */}                      : "border-transparent text-slate-200"            <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-700/20">

        {!isLoading && !error && history.length === 0 && (

          <div className="flex flex-col items-center justify-center py-6 px-6 text-slate-400">                  )}              <div className="flex items-center space-x-2 text-slate-400 text-xs">

            <Clock className="w-8 h-8 mb-2 text-slate-600" />

            <p className="text-sm text-center">No recent searches available</p>                  style={{ pointerEvents: 'auto' }}                <TrendingUp className="w-3 h-3" />

            <p className="text-xs text-slate-500 mt-1">

              Recent searches from all users will appear here                  onClick={() => onHistoryClick(item.query, index)}                <span>Recent Searches</span>

            </p>

          </div>                  onMouseEnter={() => onHistoryHover(index)}                <span className="text-slate-500">• from community</span>

        )}

      </div>                  onMouseLeave={() => {              </div>

    </div>

  );                    // Only clear selection if this item was selected via hover (not keyboard)            </div>

};

                    if (selectedIndex === index) {

export default RecentHistory;
                      onHistoryHover(-1);            {/* History Items */}

                    }            <div className="max-h-64 overflow-y-auto">

                  }}              {history.map((item, index) => (

                >                <div

                  {/* Icon */}                  key={item.id}

                  <div                  onClick={() => onHistoryClick(item.query, index)}

                    className={cn(                  onMouseEnter={() => onHistoryHover(index)}

                      "w-4 h-4 mt-0.5 transition-colors",                  className={cn(

                      selectedIndex === index                    "flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-150 border-b border-slate-800/30 last:border-b-0",

                        ? "text-emerald-300"                    selectedIndex === index

                        : "text-slate-500 group-hover:text-slate-400"                      ? "bg-blue-500/20 border-l-4 border-l-blue-400"

                    )}                      : "hover:bg-slate-700/50"

                  >                  )}

                    <TrendingUp className="w-4 h-4" />                >

                  </div>                  <div className="flex-1 min-w-0 pr-3">

                    <div className="flex items-center space-x-2 mb-1">

                  {/* Content */}                      <Users className="w-3 h-3 text-blue-400 flex-shrink-0" />

                  <div className="flex-1 min-w-0">                      <span className="text-blue-300 text-xs font-medium">

                    <div                        {item.userName}

                      className={cn(                      </span>

                        "text-sm font-medium truncate transition-colors",                      <span className="text-slate-500 text-xs">

                        selectedIndex === index                        {formatTime(item.createdAt)}

                          ? "text-white"                      </span>

                          : "text-slate-200 group-hover:text-white"                    </div>

                      )}                    <p

                    >                      className={cn(

                      {item.query}                        "text-sm truncate transition-colors",

                    </div>                        selectedIndex === index

                          ? "text-white font-medium"

                    <div className="flex items-center space-x-3 mt-1">                          : "text-slate-200 group-hover:text-white"

                      <span className="text-xs text-slate-400">                      )}

                        {formatTime(new Date(item.createdAt))}                    >

                      </span>                      {item.displayQuery}

                      {item.userName && (                    </p>

                        <span className="text-xs text-slate-500">                  </div>

                          by {item.userName}

                        </span>                  {/* Indicator for selected item */}

                      )}                  {selectedIndex === index && (

                    </div>                    <div className="flex-shrink-0 ml-2">

                  </div>                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />

                    </div>

                  {/* Keyboard hint */}                  )}

                  {selectedIndex === index && (                </div>

                    <div className="flex items-center space-x-1 text-xs text-emerald-400/80 ml-2">              ))}

                      <span>↵</span>            </div>

                    </div>

                  )}            {/* Footer */}

                </div>            <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-700/10">

              ))}              <div className="flex items-center justify-center text-slate-500 text-xs">

            </div>                <Clock className="w-3 h-3 mr-1" />

                <span>Start typing for AI suggestions</span>

            {/* Footer */}              </div>

            <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-700/20">            </div>

              <div className="flex items-center justify-between text-xs text-slate-500">          </>

                <div className="flex items-center space-x-4">        )}

                  <div className="flex items-center space-x-1">

                    <kbd className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs">        {/* Empty State */}

                      ↑↓        {!isLoading && !error && history.length === 0 && (

                    </kbd>          <div className="flex flex-col items-center justify-center py-6 px-4">

                    <span>navigate</span>            <Users className="w-8 h-8 text-slate-500 mb-2" />

                  </div>            <span className="text-slate-400 text-sm text-center">

                  <div className="flex items-center space-x-1">              No recent searches found

                    <kbd className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs">            </span>

                      ↵            <span className="text-slate-500 text-xs text-center mt-1">

                    </kbd>              Start typing for AI suggestions

                    <span>select</span>            </span>

                  </div>          </div>

                  <div className="flex items-center space-x-1">        )}

                    <kbd className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs">      </div>

                      Esc    </div>

                    </kbd>  );

                    <span>close</span>};

                  </div>

                </div>export default RecentHistory;

                <span className="text-slate-600">
                  {history.length} recent searches
                </span>
              </div>
            </div>
          </>
        )}

        {/* No History State */}
        {!isLoading && !error && history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 px-6 text-slate-400">
            <Clock className="w-8 h-8 mb-2 text-slate-600" />
            <p className="text-sm text-center">No recent searches available</p>
            <p className="text-xs text-slate-500 mt-1">
              Recent searches from all users will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentHistory;