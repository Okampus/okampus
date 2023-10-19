import AvatarImage from '../../atoms/Image/AvatarImage';
import { useTranslation } from '../../../_hooks/context/useTranslation';

import { DiffType } from '@okampus/shared/types';
import { capitalize, isNonNullObject } from '@okampus/shared/utils';
import { Cloud, ClockCountdown } from '@phosphor-icons/react/dist/ssr';

import { LogContext, LogType } from '@prisma/client';
import clsx from 'clsx';

import type { LogMinimalInfo } from '../../../../types/features/log.info';
import type { IntlContext } from '../../../../types/intl-context.type';
import type { TOptions } from '../../../../utils/i18n/translate';

import type { JSONType, LogDiff } from '@okampus/shared/types';

function getActor(log: LogMinimalInfo): { name: string; image: React.ReactNode } {
  const actor = log.createdBy?.actor;
  const className = 'rounded-[50%] shrink-0';
  if (actor)
    return {
      name: actor.name,
      image: (
        <div className={className}>
          <AvatarImage actor={actor} type="user" />
        </div>
      ),
    };
  // if (log.context === LogContext.System)
  if (log.context === LogContext.CRON)
    return {
      name: 'CRON',
      image: (
        <ClockCountdown
          className={clsx(className, 'h-[2.5rem] w-[2.5rem] p-1 bg-1 text-0 border border-[var(--border-2)]')}
        />
      ),
    };

  return {
    name: 'Système',
    image: (
      <Cloud className={clsx(className, 'h-[2.5rem] w-[2.5rem] p-1 bg-1 text-0 border border-[var(--border-2)]')} />
    ),
  };
}

function getPayload(
  t: (context: IntlContext, key: string, data?: TOptions, returnRaw?: true) => string,
  log: LogMinimalInfo,
): { actionType: string; payload: Record<string, unknown> } {
  if (log.type === LogType.Update) {
    const diffFields = Object.keys(log.diff as LogDiff);
    const count = diffFields.length;
    if (count > 1) {
      const entityName = t('entities', `entityNames.${log.entityName}`, {});
      return { actionType: `Update.fields`, payload: { entityName, count } };
    }
    const fieldName = t('entities', `fieldNames.${diffFields[0]}`, {});
    return { actionType: `Update.default`, payload: { fieldName } };
  }

  return {
    actionType: `${log.type}`,
    payload: { entityName: t('entities', `entityNames.${log.entityName}`, {}, true) },
  };
}

function renderValue(field: JSONType, type: DiffType, relType?: string) {
  if (type === DiffType.Number) return <span className="font-bold text-0">{(field as number).toFixed(2)}</span>;
  if (type === DiffType.Boolean)
    return (
      <span className={clsx('font-bold', type === DiffType.Boolean && field ? 'text-[var(--success)]' : 'text-0')}>
        {field ? 'Oui' : 'Non'}
      </span>
    );

  if (type === DiffType.String) return <span className="font-bold text-0">{field as string}</span>;
  if (type === DiffType.Rel)
    return (
      <span className="font-bold text-0">
        {relType} &lt;@{field as string}&gt;
      </span>
    );

  if (isNonNullObject(field)) {
    return (
      <div className="flex flex-col gap-1">
        {Object.entries(field).map(([key, value]) => {
          return (
            <div key={key} className="flex gap-1">
              <span className="font-bold text-0">
                {key}: {JSON.stringify(value)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

export type LogItemProps = { log: LogMinimalInfo };
export default function LogItem({ log }: LogItemProps) {
  const { name, image } = getActor(log);
  const { t, format } = useTranslation();

  const { actionType, payload } = getPayload(t, log);

  const diff = Object.entries(log.diff as LogDiff);
  return (
    <div className="flex gap-4">
      {image}
      <span className="text-0 font-medium">
        {name} {t('actions', actionType, payload)}
        <div className="text-2 text-sm font-medium">{format('weekDayHour', new Date(log.createdAt))}</div>
        <div className="py-2 text-1 font-medium">
          {diff.map(([field, { after, before, type, relType }]) => {
            return (
              <div key={field} className="text-0">
                {capitalize(t('entities', `fieldNames.${field}.one`))} changé de {renderValue(before, type, relType)} à{' '}
                {renderValue(after, type, relType)}.
              </div>
            );
          })}
        </div>
      </span>
    </div>
  );
}
