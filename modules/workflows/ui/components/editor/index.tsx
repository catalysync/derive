import FlowEditor from '@/modules/workflows/ui/components/flow-editor'
import { Workflow } from '@/app/generated/prisma'
import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import TopBar from './top-bar'

interface Props {
  workflow: Workflow
}

const Editor = ({workflow}: Props) => {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <TopBar title='Workflow editor' subtitle={workflow.name} workflowId={workflow.id} />
        <section className="flex h-full overflow-auto">
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  )
}

export default Editor
