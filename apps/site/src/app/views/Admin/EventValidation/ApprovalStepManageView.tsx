import { eventApprovalStepDetailsInfo, useTypedQuery } from '@okampus/shared/graphql';
import { EventApprovalStepNode } from '@okampus/ui/molecules';
import { useCallback } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from 'reactflow';

import type { Connection, Edge, Node } from 'reactflow';

import 'reactflow/dist/style.css';

// const initialNodes = [
//   { id: '1', type: 'input', data: { label: 'Start here...' }, position: { x: -150, y: 0 } },
//   { id: '2', type: 'input', data: { label: '...or here!' }, position: { x: 150, y: 0 } },
//   { id: '3', data: { label: 'Delete me.' }, position: { x: 0, y: 100 } },
//   { id: '4', data: { label: 'Then me!' }, position: { x: 0, y: 200 } },
//   { id: '5', type: 'output', data: { label: 'End here!' }, position: { x: 0, y: 300 } },
// ];

// const initialEdges = [
//   { id: '1->3', source: '1', target: '3' },
//   { id: '2->3', source: '2', target: '3' },
//   { id: '3->4', source: '3', target: '4' },
//   { id: '4->5', source: '4', target: '5' },
// ];
const nodeTypes = {
  eventApprovalStepNode: EventApprovalStepNode,
};

export function ApprovalStepManageView() {
  const { data } = useTypedQuery({ eventApprovalStep: [{}, eventApprovalStepDetailsInfo] });

  if (!data) return null;

  const initialNodes =
    data?.eventApprovalStep.map((eventApprovalStep, i) => ({
      id: eventApprovalStep.id as string,
      data: { eventApprovalStep },
      position: { x: 0, y: 0 + i * 150 },
      type: 'eventApprovalStepNode',
    })) ?? [];

  const initialEdges =
    data?.eventApprovalStep.flatMap((step) => {
      return step.nextSteps.map((nextStep) => ({
        id: `${step.id}->${nextStep.id}`,
        source: step.id as string,
        target: nextStep.id as string,
        sorceHandle: nextStep.id as string,
      }));
    }) ?? [];

  return <ApprovalStepManageViewWrapper initialNodes={initialNodes} initialEdges={initialEdges} />;
}

type ApprovalStepManageViewWrapper = { initialNodes: Node[]; initialEdges: Edge[] };
export function ApprovalStepManageViewWrapper({ initialNodes, initialEdges }: ApprovalStepManageViewWrapper) {
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onConnect = useCallback((params: Connection) => setEdges(addEdge(params, edges)), [edges]);
  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setEdges(
        // eslint-disable-next-line unicorn/no-array-reduce
        deleted.reduce((acc: Edge[], node: Node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, edges]
  );

  return (
    <div className="flex h-full px-content margin-content">
      {/* <div className="w-[15rem]">{JSON.stringify(data)}</div> */}
      <div className="rounded-3xl overflow-hidden w-full h-full">
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodesDelete={onNodesDelete}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          attributionPosition="top-right"
          proOptions={{ hideAttribution: true }} // TEMP: attribution removed due to dark mode issue; readd when fixed
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
