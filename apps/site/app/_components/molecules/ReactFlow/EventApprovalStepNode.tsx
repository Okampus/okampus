import { IconPlus } from '@tabler/icons-react';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';

import type { EventApprovalStepDetailsInfo } from '../../../../types/features/event-approval-step.info';

export type EventApprovalStepNodeProps = {
  data: { eventApprovalStep: EventApprovalStepDetailsInfo };
  isConnectable: boolean;
};
// { eventApprovalStep: EventApprovalStepDetailsInfo };
function EventApprovalStepNodeWrapper({ data: { eventApprovalStep }, isConnectable }: EventApprovalStepNodeProps) {
  // const { t } = useTranslation();

  const nextStepsCount = eventApprovalStep.nextSteps.length;
  const nextHandles = eventApprovalStep.nextSteps.map((nextStep, i) => (
    <Handle
      key={nextStep.id}
      id={nextStep.id}
      type="source"
      position={Position.Bottom}
      style={{
        left: `${(100 / (nextStepsCount + 1)) * (i + 1)}%`,
      }}
      className="bg-2"
      onConnect={(params) => console.log('handle onConnect', params)}
      isConnectable={isConnectable}
    />
  ));

  // const validatorsCount = eventApprovalStep.eventApprovalStepValidators.length;
  // const notifieesCount = eventApprovalStep.eventApprovalStepNotifiees.length;

  return (
    <>
      {eventApprovalStep.previousStep && (
        <Handle
          type="target"
          position={Position.Top}
          className="bg-2"
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
      )}
      <div className="flex flex-col items-center gap-6">
        <div className="py-4 pl-6 pr-20 rounded-2xl bg-0">
          <div className="title-sm">{eventApprovalStep.name}</div>
          <div className="subtitle-sm">{eventApprovalStep.name}</div>
          <div className="subtitle-sm !text-[var(--text-0)]">
            {/* {t('validator', { count: validatorsCount })} • {t('notifiee', { count: notifieesCount })} */}
          </div>
        </div>
        {eventApprovalStep.nextSteps.length === 0 && (
          <div className="rounded-full border flex items-center justify-center w-10 h-10 bg-0 z-20">
            <IconPlus className="h-full w-full text-0 p-1.5" />
          </div>
        )}
      </div>
      {nextHandles}
    </>
  );
}

export default memo(EventApprovalStepNodeWrapper);
