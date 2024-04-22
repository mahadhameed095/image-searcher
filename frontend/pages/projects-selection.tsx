import { DefaultService as client } from "@/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectSelection(){
    const [creationModeActive, setCreationModeActive] = useState(false);
    const [projectName, setProjectName] = useState("");

    const navigate = useNavigate();
    const projects = useQuery({ 
      queryKey : ['getAllProjects'],
      queryFn : client.getProjects
    });

    async function navigateToProject(_projectName : string){
      await client.switchProject({ projectName : _projectName });
      navigate(`/projects/${_projectName}`);
    }

    const addProject = useMutation({
      mutationKey : [''],
      mutationFn : client.switchProject,
      onSuccess : () => {
        setCreationModeActive(false);
        navigateToProject(projectName);
      }
    });

    return (
      <div className="min-h-screen w-screen overflow-hidden flex justify-center items-center">

        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className='flex justify-between items-center '>
              Projects
              <Button 
                  className='w-fit'
                  onClick={() => setCreationModeActive(true)}
              >
                <PlusIcon />
              </Button>
            </CardTitle>
            <CardDescription>Select one of the projects or create one.</CardDescription>
          </CardHeader>
          <CardContent className='items-center flex flex-col'>
            <ul className='w-full'>
              {
                projects.data &&
                  projects.data.map(project => (
                    <li key={project}>
                      <button onClick={() => navigateToProject(project)}>
                        {project}
                      </button>
                    </li>
                  ))
              }
              {
                creationModeActive && 
                  <Input 
                    id="imagesDir"
                    value={projectName}
                    disabled={addProject.isPending}
                    onKeyDown={e => {
                      if(e.key === "Enter"){
                        addProject.mutate({ projectName })
                      }
                    }}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                }
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }