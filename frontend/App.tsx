import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProjectView from "./pages/project-view";
import ProjectSelection from "./pages/projects-selection";
import ClusterGraph from "./pages/cluster-graph";

const queryClient = new QueryClient()
export default function App(){
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path = "/" element={<ProjectSelection />} />
          <Route path = "/projects/:projectName" element={<ProjectView />}/>
          <Route path = "/projects/:projectName/clusterGraph" element={<ClusterGraph />}/>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}