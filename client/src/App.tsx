import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

import { Sidebar } from "@/components/sidebar";
import { AudioPlayer } from "@/components/audio-player";
import { CreatePlaylistModal } from "@/components/create-playlist-modal";

import Home from "@/pages/home";
import Search from "@/pages/search";
import Library from "@/pages/library";
import PlaylistDetail from "@/pages/playlist";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/library" component={Library} />
      <Route path="/playlist/:id" component={PlaylistDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen bg-spotify-black text-white overflow-hidden">
          <Sidebar onCreatePlaylist={() => setShowCreateModal(true)} />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="bg-spotify-dark p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-white">Music Explorer</h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
                  <span className="text-spotify-black font-semibold text-sm">U</span>
                </div>
              </div>
            </div>
            
            <Router />
          </div>
        </div>

        <AudioPlayer />
        
        <CreatePlaylistModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
