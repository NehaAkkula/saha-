import React, { useState, useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import axios from 'axios';
import { Save, RefreshCw, Plus } from 'lucide-react';

const initialNodes: Node[] = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Requirement Analysis' }, type: 'input' },
  { id: '2', position: { x: 350, y: 100 }, data: { label: 'Design & Prototyping' } },
  { id: '3', position: { x: 600, y: 100 }, data: { label: 'Main Development' } },
  { id: '4', position: { x: 600, y: 250 }, data: { label: 'Testing & QA' } },
  { id: '5', position: { x: 850, y: 250 }, data: { label: 'Deployment & Launch' }, type: 'output' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
  { id: 'e4-5', source: '4', target: '5', animated: true },
];

interface WorkflowViewerProps {
  projectId: string;
}

export default function WorkflowViewer({ projectId }: WorkflowViewerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`/api/workflows/${projectId}`)
      .then(res => {
        const loadedNodes = JSON.parse(res.data.nodes);
        const loadedEdges = JSON.parse(res.data.edges);
        if (loadedNodes.length > 0) {
          setNodes(loadedNodes);
          setEdges(loadedEdges);
        } else {
          setNodes(initialNodes);
          setEdges(initialEdges);
        }
      })
      .catch(err => console.error(err));
  }, [projectId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const saveWorkflow = async () => {
    setSaving(true);
    try {
      await axios.post(`/api/workflows/${projectId}`, { nodes, edges });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addNode = () => {
    const newNode = {
      id: String(Date.now()),
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label: 'New Task Node' },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="h-[600px] border border-slate-200 rounded-[32px] overflow-hidden bg-slate-50 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background color="#cbd5e1" gap={20} />
        <Panel position="top-right" className="flex gap-2">
          <button 
            onClick={addNode}
            className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Node</span>
          </button>
          <button 
            onClick={saveWorkflow}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Flow'}</span>
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
