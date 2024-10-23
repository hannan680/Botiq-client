'use client';
import Image from "next/image";
import Greetings from "./components/Greetings";
import { useEffect, useState } from "react";
import PreLoader from "./components/PreLoader";
import CalendarSelector from "./components/CalenderSelector";
import CategoryList from "./components/CategoryList";
import AiEmployeeGrid from "./components/AiEmployeeGrid";
import { useUserContext } from "./providers/userContext";
import Link from "next/link";
import { useCheckSnapshot } from "./hooks/useCheckSnapshot";
import { AlertTriangle, XCircle } from "lucide-react";


interface UserData {
  activeLocation?: string;
  // Add other user data properties as needed
}

interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'draft';
  createdAt: string;
  updatedAt: string;
}

interface WorkflowStatus {
  requiredName: string;
  found: boolean;
  actualWorkflow: Workflow | null;
}

interface CheckSnapshotData {
  data: {
    workflowStatus: WorkflowStatus[];
    missingWorkflows: string[];
    allWorkflowsPresent: boolean;
  };
}

interface UseUserContextReturn {
  userData: UserData | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseCheckSnapshotReturn {
  data: CheckSnapshotData | undefined;
  isError: boolean;
}



export default function Home(): JSX.Element {
  const { userData, isLoading, error } = useUserContext();
  const { data } = useCheckSnapshot(userData?.activeLocation!);
  
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [missingWorkflows, setMissingWorkflows] = useState<string[]>([]);
  const [draftWorkflows, setDraftWorkflows] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (data?.data) {
      const missing = data.data.missingWorkflows || [];
      const drafts = data.data.workflowStatus
        .filter(wf => wf.found && wf.actualWorkflow?.status === 'draft')
        .map(wf => wf.actualWorkflow?.name as string);
      
      if (missing.length > 0 || drafts.length > 0) {
        setMissingWorkflows(missing);
        setDraftWorkflows(drafts);
        setShowWarning(true);
      }
    }
  }, [data]);


  if (!isLoaded || isLoading) {
    return <PreLoader />;
  }

  if (error) {
    return (
      <div className="h-[100vh] flex justify-center items-center bg-app-gradient px-5">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" role="alert">
          <strong className="font-bold">Something went wrong!</strong>
          <span className="block">An unknown error occurred. Please try again later.</span>
        </div>
      </div>
    );
  }


  if(!userData?.activeLocation){
    return (
      <div className="h-[100vh] flex justify-center bg-app-gradient px-5  ">
      <div className="hero-container h-full flex flex-row max-w-7xl">
        <div className="hero-container-col1 flex justify-center flex-col flex-1 gap-5 ">
          <Greetings/>
          <p className="hero-content text-2xl font-bold  text-slate-900 leading-8">
          <span className="text-2xl text-slate-900">
  Hold tight! The Agency Dashboard is coming soon.
</span>
        Until then, switch to a sub-account and enjoy the magic!"
          </p>  
        </div>
        <div className="hero-container-col2 flex flex-col items-center justify-center flex-1">
          <Image 
            src="/images/hero-bot.png"  
            width={300} 
            height={300} 
            alt="Bot"  
            className="max-w-xl w-[500px]"
          />
        </div>
        
      </div>
     
      </div>
    )
  }

  return (
    <>
              {/* Hide This For Later Update */}

      {/* {
      showWarning && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 px-4 py-3 shadow-sm z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium text-yellow-700">Some AI workflows are currently missing from your system!</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => window.open('https://example.com/workflow-download', '_blank')}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              >
                Download Workflows
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-yellow-700 hover:text-yellow-800 text-sm"
              >
                View More
              </button>
            </div>
          </div>
        </div>
      )} */}

      <div>
        <div className={`h-[700px] flex justify-center bg-app-gradient px-5 ${showWarning ? 'pt-16' : ''}`}>
        <div className="hero-container h-full flex flex-row max-w-7xl">
            <div className="hero-container-col1 flex justify-center flex-col flex-1 gap-5">
              <Greetings />
              <p className="hero-content text-2xl font-thin text-white leading-8">
              Create a prompt using our ChatBot, test it in a conversation, and insert it into a Custom Value.              </p>
              <Link href="/customBuild"
                className="bg-gray-800 text-white px-6 py-3 rounded-full flex items-center justify-between w-[max-content]"
              >
Create and Test AI Prompt              </Link>
              <div className="mt-[100px]">
                <CalendarSelector />
              </div>
            </div>
            <div className="hero-container-col2 flex flex-col items-center flex-1">
              <Image 
                src="/images/hero-bot.png"  
                width={300} 
                height={300} 
                alt="Bot"  
                className="max-w-xl w-[500px]"
              />
            </div>
          </div>        </div>
          {/* Hide This For Later Update */}
        {/* <AiEmployeeGrid /> */}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Workflow Setup Details</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {missingWorkflows.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="font-medium text-red-700">Missing Workflows:</p>
                  </div>
                  <ul className="list-disc pl-5 mt-2 text-red-700">
                    {missingWorkflows.map((workflow, index) => (
                      <li key={index} className="text-sm">{workflow}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {draftWorkflows.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <p className="font-medium text-yellow-700">Draft Workflows (Need Publishing):</p>
                  </div>
                  <ul className="list-disc pl-5 mt-2 text-yellow-700">
                    {draftWorkflows.map((workflow, index) => (
                      <li key={index} className="text-sm">{workflow}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}