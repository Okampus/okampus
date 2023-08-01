'use client';

import AvatarImage from '../../../../../../../../components/atoms/Image/AvatarImage';
import EmptyStateImage from '../../../../../../../../components/atoms/Image/EmptyStateImage';
import FormItem from '../../../../../../../../components/atoms/Item/FormItem';
import GroupItem from '../../../../../../../../components/atoms/Item/GroupItem';
import FormLayout from '../../../../../../../../components/atoms/Layout/FormLayout';
import ModalLayout from '../../../../../../../../components/atoms/Layout/ModalLayout';
import ViewLayout from '../../../../../../../../components/atoms/Layout/ViewLayout';
import ActionButton from '../../../../../../../../components/molecules/Button/ActionButton';
import ChangeSetForm from '../../../../../../../../components/molecules/Form/ChangeSetForm';
import FormSubmissionRender from '../../../../../../../../components/molecules/Form/FormSubmissionRender';
import ChoiceWithFreeInput from '../../../../../../../../components/molecules/Input/ChoiceWithFreeInput';
import SelectInput from '../../../../../../../../components/molecules/Input/SelectInput';
import SwitchInput from '../../../../../../../../components/molecules/Input/SwitchInput';
import UserLabeled from '../../../../../../../../components/molecules/Labeled/UserLabeled';
import ApprovalDashboard from '../../../../../../../../components/organisms/ApprovalDashboard';

import { notificationAtom } from '../../../../../../../../context/global';
import { useTeamManage } from '../../../../../../../../context/navigation';
import { useTypedQueryAndSubscribe } from '../../../../../../../../hooks/apollo/useTypedQueryAndSubscribe';
import { useModal } from '../../../../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../../../../hooks/context/useTranslation';

import { ReactComponent as AddUserEmptyState } from '@okampus/assets/svg/empty-state/add-user.svg';

import { ApprovalState, ControlType } from '@okampus/shared/enums';
import { teamJoinWithUser, updateTeamJoinMutation, updateTeamMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';
import { extractPositiveNumber } from '@okampus/shared/utils';

import { useMutation } from '@apollo/client';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

import type { FormField, FormSchema, Submission } from '@okampus/shared/types';

// TODO: manage archives
export default function TeamManageTeamJoinsPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { t } = useTranslation();

  const [, setNotification] = useAtom(notificationAtom);
  const { closeModal, openModal } = useModal();

  const [updateTeamJoin] = useMutation(updateTeamJoinMutation);
  const [updateTeam] = useMutation(updateTeamMutation);

  // const [query, setQuery] = useState('');
  // const [selectedStates, setSelectedStates] = useState<ApprovalState[]>([]);

  const archiveDate = useMemo(
    () =>
      teamManage?.teamHistories.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())[0]
        .eventDate,
    [teamManage?.teamHistories]
  );

  const where = useMemo(() => {
    // const ilike = { _ilike: `%${query}%` };
    // const joinedBy = {
    //   _or: [{ firstName: ilike }, { lastName: ilike }, { individual: { actor: { name: ilike, email: ilike } } }],
    // };

    return {
      // ...(selectedStates.length > 0 ? { state: { _in: selectedStates } } : {}),
      // ...(query.length > 0 ? { joinedBy } : {}),
      createdAt: { _gte: archiveDate },
      teamId: { _eq: teamManage?.id },
    };
  }, [archiveDate, teamManage?.id]);

  const { data } = useTypedQueryAndSubscribe({ queryName: 'teamJoin', selector: [{ where }, teamJoinWithUser] });

  // const { data, subscribeToMore } = useTypedQuery({ teamJoin: [{ where }, teamJoinWithUser] });
  // useEffect(() => {
  //   subscribeToMore({
  //     document: typedGql('subscription')({ teamJoin: [{ where }, teamJoinWithUser] }),
  //     updateQuery: (prev, { subscriptionData }) => {
  //       if (!subscriptionData.data) return prev;
  //       return { teamJoin: subscriptionData.data.teamJoin };
  //     },
  //   });
  // }, [subscribeToMore, where]);

  if (!teamManage || !teamManage.joinForm) return null;

  // ISO 8601 Durations
  const membershipDurationItems = [
    { label: 'Tous les 6 mois', value: 'P6M' },
    { label: 'Tous les ans', value: 'P1Y' },
    { label: 'Jamais', value: '' },
  ];

  const feesItems = [
    { label: 'Gratuit', value: '0' },
    { label: '5€', value: '5' },
    { label: '10€', value: '10' },
    { label: '20€', value: '20' },
  ];

  const attributedRoleSchema = [
    {
      name: 'role',
      label: 'Rôle attribué',
      type: ControlType.Select,
      options: teamManage.roles.map((role) => ({ label: role.name, value: role.id })),
      isRequired: true,
    },
  ] as const;

  const initialValues = {
    membershipDuration: teamManage.membershipDuration,
    membershipFees: teamManage.membershipFees.toString(),
    isJoinFormActive: teamManage.isJoinFormActive,
  };

  return (
    <ViewLayout header="Adhésions" bottomPadded={false} scrollable={false}>
      <ChangeSetForm
        className="flex flex-col gap-6"
        checkFields={[]}
        initialValues={initialValues}
        onSave={(values) => {
          const update = {
            membershipDuration: values.membershipDuration,
            membershipFees: values.membershipFees ? extractPositiveNumber(values.membershipFees) || 0 : 0,
            isJoinFormActive: values.isJoinFormActive,
          };

          // @ts-ignore
          updateTeam({ variables: { id: teamManage.id, update } });
        }}
        renderChildren={({ changeValues, values }) => {
          return (
            <>
              <SwitchInput
                options={{ name: 'isJoinFormActive', label: "Formulaire d'adhésion activé ?" }}
                checked={values.isJoinFormActive}
                onChange={(value) => changeValues((current) => ({ ...current, isJoinFormActive: value }))}
                subtitle="Si le formulaire est désactivé, les adhérents pourront candidater à l'équipe en un clic."
              />
              <FormItem form={teamManage.joinForm} />
              <GroupItem
                heading="Paramètres d'adhésion"
                groupClassName="grid xl-max:grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-12"
              >
                {/* <TextInput
                  allowedChars={/[\d,.-]/}
                  value={values.membershipFees}
                  onChange={(value) => changeValues((current) => ({ ...current, membershipFees: value }))}
                  triggerCheck={checkingValues.membershipFees}
                  setTriggerCheck={(trigger) => changeCheckingValues({ membershipFees: trigger })}
                  prefix={<div className="font-medium text-0">Frais d&apos;adhésion</div>}
                  suffix={<div className="px-2">€</div>}
                  textAlign="right"
                /> */}
                <ChoiceWithFreeInput
                  items={feesItems}
                  value={values.membershipFees}
                  onChange={(value) => changeValues((current) => ({ ...current, membershipFees: value }))}
                  props={{
                    options: { name: 'membershipFees', placeholder: 'Autre' },
                    suffix: <div className="px-2">€</div>,
                  }}
                />
                <SelectInput
                  value={values.membershipDuration}
                  onChange={(value) => changeValues((current) => ({ ...current, membershipDuration: value }))}
                  options={{ name: 'membershipDuration', label: 'Renouvellement des adhésions' }}
                  items={membershipDurationItems}
                />
              </GroupItem>
            </>
          );
        }}
      />
      <ApprovalDashboard
        className="mt-8"
        stateFilter={(join, states) => states.includes(join.state as ApprovalState)}
        searchFilter={(join, query) => {
          const lowerQuery = query.toLowerCase();
          const actor = join.joinedBy.individual?.actor;
          return (
            actor?.name.toLowerCase().includes(lowerQuery) ||
            actor?.email.toLowerCase().includes(lowerQuery) ||
            join.joinedBy?.firstName.toLowerCase().includes(lowerQuery) ||
            join.joinedBy?.lastName.toLowerCase().includes(lowerQuery)
          );
        }}
        states={Object.values(ApprovalState).map((state) => ({
          label: t(`enums.ApprovalState.${state}`),
          value: state,
        }))}
        renderHeader={(join) => (
          <div className="flex items-center gap-2.5 text-0">
            Adhésion de <UserLabeled individual={join.joinedBy.individual} id={join.joinedBy.id} small={true} />
          </div>
        )}
        renderItem={(join) => (
          <UserLabeled
            showCardOnClick={false}
            individual={join.joinedBy.individual}
            id={join.joinedBy.id}
            content={t(`enums.ApprovalState.${join.state}`)}
          />
        )}
        renderSelected={(join) => (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-center">
              <AvatarImage actor={join.joinedBy.individual?.actor} size={18} type="user" />
              <div className="flex flex-col">
                <div className="text-1 font-semibold text-lg">{join.joinedBy.individual?.actor?.name}</div>
                <div className="text-2 text-xs font-medium">{join.joinedBy.individual?.actor?.email}</div>
              </div>
            </div>
            <hr className="border-color-3" />
            <FormSubmissionRender
              schema={join.formSubmission?.form.schema as FormField[]}
              submission={join.formSubmission?.submission as Submission<FormSchema>}
            />
            <div className="flex flex-col text-0 gap-6">
              <div className="flex gap-12 px-1">
                <div className="flex flex-col gap-2">
                  <div className="menu-title">Rôle souhaité</div>
                  <div className="font-semibold text-2 text-sm">{join.receivedRole?.name}</div>
                </div>
                {join.state === ApprovalState.Approved && <div className="menu-title">Rôle attribué</div>}
              </div>
              <div className="flex gap-4">
                {join.state === ApprovalState.Pending ? (
                  <>
                    <ActionButton
                      action={{
                        label: 'Accepter la candidature',
                        type: ActionType.Success,
                        linkOrActionOrMenu: () =>
                          openModal({
                            node: (
                              <ModalLayout header="Attribuer un rôle">
                                <FormLayout
                                  schema={attributedRoleSchema}
                                  onSubmit={(values) => {
                                    const update = { state: ApprovalState.Approved, receivedRoleId: values.role };
                                    updateTeamJoin({
                                      // @ts-ignore
                                      variables: { id: join.id, update },
                                      onCompleted: () => {
                                        setNotification({
                                          type: ToastType.Success,
                                          message: `L'adhésion de ${join.joinedBy.individual?.actor?.name} a été acceptée !`,
                                        });
                                        closeModal();
                                      },
                                      onError: (error) =>
                                        setNotification({ type: ToastType.Error, message: error.message }),
                                    });
                                  }}
                                />
                              </ModalLayout>
                            ),
                          }),
                      }}
                    />
                    <ActionButton
                      action={{
                        label: 'Refuser',
                        type: ActionType.Danger,
                        linkOrActionOrMenu: () =>
                          updateTeamJoin({
                            // @ts-ignore
                            variables: { id: join.id, update: { state: ApprovalState.Rejected } },
                            onCompleted: () => {
                              setNotification({
                                type: ToastType.Success,
                                message: `L'adhésion de ${join.joinedBy.individual?.actor?.name} a été refusée !`,
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
        )}
        items={data?.teamJoin || []}
        emptyState={
          <EmptyStateImage
            image={<AddUserEmptyState className="max-w-sm" />}
            title="Gérez vos adhésions et invitez de nouveaux membres"
            subtitle="Sélectionner une adhésion sur la gauche pour en voir les détails."
          />
        }
      />
    </ViewLayout>
  );
}
