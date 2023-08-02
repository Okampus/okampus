import TextInput from '../molecules/Input/TextInput';
import SidebarLayout from '../atoms/Layout/SidebarLayout';
import SimpleFilterInput from '../molecules/Input/SimpleFilterInput';
import { useMemo, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';

import type { SelectItem } from '@okampus/shared/types';

export type ApprovalDashboardProps<T, U> = {
  className?: string;
  items: T[];
  states: SelectItem<U>[];
  renderItem: (item: T) => React.ReactNode;
  renderSelected: (item: T) => React.ReactNode;
  renderHeader: (item: T) => React.ReactNode;
  searchFilter?: (item: T, search: string) => boolean;
  stateFilter?: (item: T, states: U[]) => boolean;
  emptyState?: React.ReactNode;
};
export default function ApprovalDashboard<T, U>({
  className,
  items,
  states,
  renderItem,
  renderSelected,
  renderHeader,
  searchFilter,
  stateFilter,
  emptyState,
}: ApprovalDashboardProps<T, U>) {
  const [selectedApproval, setSelectedApproval] = useState<T | null>(null);
  const [selectedStates, setSelectedStates] = useState<U[]>([]);
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (
          selectedStates.length > 0 &&
          selectedStates.length !== states.length &&
          stateFilter &&
          !stateFilter(item, selectedStates)
        )
          return false;

        if (query && searchFilter && !searchFilter(item, query)) return false;

        return true;
      }),
    [items, query, searchFilter, selectedStates, states.length, stateFilter]
  );

  const filterItems = useMemo(
    () =>
      states.map((state) => ({
        ...state,
        count: items.filter((item) => stateFilter?.(item, [state.value])).length,
      })),
    [items, stateFilter, states]
  );

  return (
    <SidebarLayout
      className={className}
      closeContent={() => setSelectedApproval(null)}
      emptyState={emptyState}
      contentHeader={selectedApproval && renderHeader(selectedApproval)}
      sidebar={
        <ul className="h-full p-2 flex flex-col">
          <li className="shrink-0 py-2 pr-2 flex gap-3">
            {searchFilter && (
              <TextInput
                value={query}
                onChange={setQuery}
                options={{ placeholder: 'Rechercher...' }}
                paddingAfterPrefix={true}
                prefix={<IconSearch className="text-[var(--text-2)]" />}
              />
            )}
            {stateFilter && (
              <SimpleFilterInput items={filterItems} selected={selectedStates} setSelected={setSelectedStates} />
            )}
          </li>
          <ul className="h-full overflow-y-scroll overflow-x-hidden scrollbar">
            {filteredItems.map((item, idx) => (
              <li
                key={idx}
                onClick={() => setSelectedApproval(item)}
                className="p-2 rounded-lg bg-1-hover cursor-pointer"
              >
                {renderItem(item)}
              </li>
            ))}
          </ul>
        </ul>
      }
      content={
        selectedApproval && (
          <div className="p-5">
            {renderSelected(selectedApproval)}
            {/* {selectedTeamJoin ? (
              <div className="flex flex-col gap-6">
                <div className="flex gap-4 items-center">
                  <AvatarImage actor={selectedTeamJoin.joinedBy.individual?.actor} size={18} type="user" />
                  <div className="flex flex-col">
                    <div className="text-1 font-semibold text-lg">
                      {selectedTeamJoin.joinedBy.individual?.actor?.name}
                    </div>
                    <div className="text-2 text-xs font-medium">
                      {selectedTeamJoin.joinedBy.individual?.actor?.email}
                    </div>
                  </div>
                </div>
                <hr className="border-color-3" />
                <FormSubmissionRender
                  schema={selectedTeamJoin.formSubmission?.form.schema as FormField[]}
                  submission={selectedTeamJoin.formSubmission?.submission as Submission<FormSchema>}
                />
                <div className="flex flex-col text-0 gap-6">
                  <div className="flex gap-12 px-1">
                    <div className="flex flex-col gap-2">
                      <div className="menu-title">Rôle souhaité</div>
                      <div className="font-semibold text-2 text-sm">{selectedTeamJoin.receivedRole?.name}</div>
                    </div>
                    {selectedTeamJoin.state === ApprovalState.Approved && (
                      <div className="menu-title">Rôle attribué</div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {selectedTeamJoin.state === ApprovalState.Pending ? (
                      <>
                        <ActionButton
                          action={{
                            label: 'Accepter la candidature',
                            type: ActionType.Success,
                            linkOrActionOrMenu: () =>
                              openModal(
                                <ModalLayout header="Attribuer un rôle">
                                  <FormLayout
                                    schema={attributedRoleSchema}
                                    onSubmit={(values) => {
                                      const update = { state: ApprovalState.Approved, receivedRoleId: values.role };
                                      updateJoin({
                                        // @ts-ignore
                                        variables: { id: selectedTeamJoin.id, update },
                                        onCompleted: () => {
                                          setNotification({
                                            type: ToastType.Success,
                                            message: `L'adhésion de ${selectedTeamJoin.joinedBy.individual?.actor?.name} a été acceptée !`,
                                          });
                                        },
                                        onError: (error) =>
                                          setNotification({ type: ToastType.Error, message: error.message }),
                                      });
                                    }}
                                  />
                                </ModalLayout>
                              ),
                          }}
                        />
                        <ActionButton
                          action={{
                            label: 'Refuser',
                            type: ActionType.Danger,
                            linkOrActionOrMenu: () =>
                              updateJoin({
                                // @ts-ignore
                                variables: { id: selectedTeamJoin.id, update: { state: ApprovalState.Rejected } },
                                onCompleted: () => {
                                  setNotification({
                                    type: ToastType.Success,
                                    message: `L'adhésion de ${selectedTeamJoin.joinedBy.individual?.actor?.name} a été refusée !`,
                                  });
                                },
                                onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
                              }),
                          }}
                        />
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null} */}
          </div>
        )
      }
    />
  );
}
